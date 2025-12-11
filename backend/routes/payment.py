import os
import hashlib
import hmac
import requests
import json
from flask import request, jsonify, redirect
from flask_jwt_extended import jwt_required, get_jwt_identity
from . import api_bp
from extensions import db
from models import User, Cart, Order, Product

LEMONSQUEEZY_API_URL = "https://api.lemonsqueezy.com/v1"

@api_bp.route('/checkout', methods=['POST'])
@jwt_required()
def create_checkout_session():
    """Create a Lemon Squeezy checkout session"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({"message": "User not found"}), 404

    cart = Cart.query.filter_by(user_id=current_user_id).first()
    if not cart or not cart.items:
        return jsonify({"message": "Cart is empty"}), 400

    store_id = os.getenv('LEMONSQUEEZY_STORE_ID')
    variant_id = os.getenv('LEMONSQUEEZY_VARIANT_ID')
    api_key = os.getenv('LEMONSQUEEZY_API_KEY')

    if not all([store_id, variant_id, api_key]):
        return jsonify({"message": "Server misconfiguration: Lemon Squeezy keys missing"}), 500

    print(f"DEBUG: creating checkout for user {user.id}, cart {cart.id}")

    # Calculate total and Create Unpaid Orders
    total_amount = 0
    description = []
    created_order_ids = []

    try:
        for item in cart.items:
            # 1. Quantity Check
            if item.quantity > 1:
                return jsonify({"message": "One product is only be able to buy and own one for an account.", "code": "quantity_limit"}), 400

            # 2. Ownership Check
            existing_order = Order.query.filter_by(user_id=user.id, product_id=item.product_id, status='paid').first()
            if existing_order:
                 return jsonify({"message": "You already own this product.", "code": "already_owned"}), 400

            product = Product.query.get(item.product_id)
            if product:
                total_amount += product.price * item.quantity
                description.append(f"{item.quantity}x {product.name}")
                
                # Create Order Immediately
                new_order = Order(
                    user_id=user.id,
                    product_id=item.product_id,
                    customer_email=user.email,
                    amount_paid=product.price * item.quantity,
                    status='unpaid',
                    tappay_trade_id="PENDING_LEMON"
                )
                db.session.add(new_order)
                db.session.flush() # Get ID
                created_order_ids.append(new_order.id)
        
        # Clear Cart
        for item in cart.items:
            db.session.delete(item)
            
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Failed to create order records: {str(e)}"}), 500
    
    total_price_cents = int(total_amount * 100) # No tax
    
    payload = {
        "data": {
            "type": "checkouts",
            "attributes": {
                "custom_price": total_price_cents,
                "checkout_data": {
                    "custom": {
                        "user_id": str(user.id),
                        "order_ids": json.dumps(created_order_ids) # Pass list of IDs
                    }
                },
                 "product_options": {
                    "name": ", ".join(description)[:100], 
                    "description": "Purchase from Miria Marketplace",
                    "receipt_button_text": "Return to Store",
                    "receipt_link_url": os.getenv("FRONTEND_URL", "http://localhost:5173") + "/my-orders",
                    "redirect_url": os.getenv("FRONTEND_URL", "http://localhost:5173") + "/my-orders"
                }
            },
            "relationships": {
                "store": {
                    "data": {
                        "type": "stores",
                        "id": str(store_id)
                    }
                },
                "variant": {
                    "data": {
                        "type": "variants",
                        "id": str(variant_id)
                    }
                }
            }
        }
    }

    headers = {
        "Accept": "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
        "Authorization": f"Bearer {api_key}"
    }

    print(f"DEBUG: sending payload to Lemon Squeezy: {payload}")

    try:
        response = requests.post(f"{LEMONSQUEEZY_API_URL}/checkouts", json=payload, headers=headers)
        if not response.ok:
            print(f"Lemon Squeezy API Error: Status {response.status_code}")
            print(f"Response Body: {response.text}")
            return jsonify({"message": f"Lemon Squeezy API Error: {response.text}"}), response.status_code
            
        checkout_data = response.json()
        print(f"DEBUG: checkout created successfully: {checkout_data['data']['id']}")
        checkout_url = checkout_data['data']['attributes']['url']
        return jsonify({"checkout_url": checkout_url})
    except requests.exceptions.RequestException as e:
        print(f"Lemon Squeezy Connection Error: {str(e)}")
        return jsonify({"message": f"Failed to create checkout session: {str(e)}"}), 500


@api_bp.route('/webhook', methods=['POST'])
def handle_webhook():
    """Handle Lemon Squeezy Webhooks"""
    secret = os.getenv('LEMONSQUEEZY_WEBHOOK_SECRET')
    signature = request.headers.get('X-Signature')

    if not secret or not signature:
        return jsonify({"message": "Missing secret or signature"}), 400

    # Verify signature
    digest = hmac.new(
        secret.encode('utf-8'),
        request.data,
        hashlib.sha256
    ).hexdigest()

    if not hmac.compare_digest(digest, signature):
        return jsonify({"message": "Invalid signature"}), 401

    event = request.get_json()
    event_name = event.get('meta', {}).get('event_name')
    data = event.get('data', {})
    attributes = data.get('attributes', {})
    
    # Handle 'order_created'
    if event_name == 'order_created':
        meta = event.get('meta', {})
        custom_data = meta.get('custom_data', {})
        
        # New Flow: Check for order_ids
        order_ids_str = custom_data.get('order_ids')
        
        if order_ids_str:
            try:
                order_ids = json.loads(order_ids_str)
                print(f"DEBUG: Processing webhook for orders: {order_ids}")
                
                orders = Order.query.filter(Order.id.in_(order_ids)).all()
                for order in orders:
                    order.status = 'paid'
                    order.lemon_squeezy_order_id = str(data.get('id'))
                    order.tappay_trade_id = "LEMON_SQUEEZY"
                
                db.session.commit()
                print(f"Updated {len(orders)} orders to PAID")
                return jsonify({"received": True})
            except Exception as e:
                 print(f"Error processing webhook order update: {str(e)}")
                 return jsonify({"message": "Error processing order"}), 500

        # Fallback to Old Flow (if needed for backward compact, though cleaning cart is issue now if we removed it)
        # Assuming we only care about new flow going forward.
        # But if old checkout exists, it has user_id/cart_id.
        user_id = custom_data.get('user_id')
        cart_id = custom_data.get('cart_id')
        
        if user_id and cart_id:
             # This path is legacy race-condition path, keep as fallback?
             # User said "directly create an order... put its state unpaid"
             # So we strongly prefer the new path. 
             # I will keep the legacy path logic BUT it might fail if cart already cleared. 
             # Actually, if cart wasn't cleared in legacy, it works.
             pass 

    return jsonify({"received": True})

@api_bp.route('/orders/<int:order_id>/pay', methods=['POST'])
@jwt_required()
def pay_order(order_id):
    """Create checkout for specific unpaid order"""
    current_user_id = get_jwt_identity()
    order = Order.query.get_or_404(order_id)
    
    if order.customer_email != User.query.get(current_user_id).email: # Simplistic check, ideally use user_id on Order
         return jsonify({"message": "Unauthorized"}), 403
         
    if order.status == 'paid':
        return jsonify({"message": "Order already paid"}), 400
    
    # Check if they already own it via another order
    # Note: order.user_id might be None for old orders, but for new ones it is set.
    # If order.user_id is set, use it. If not, fallback to email check? 
    # Current plan: prefer user_id check if available.
    check_user_id = order.user_id if order.user_id else current_user_id
    
    existing_paid = Order.query.filter(
        Order.user_id == check_user_id,
        Order.product_id == order.product_id,
        Order.status == 'paid'
    ).first()
    
    if existing_paid:
         return jsonify({"message": "You already own this product.", "code": "already_owned"}), 400
        
    # Create single item checkout
    store_id = os.getenv('LEMONSQUEEZY_STORE_ID')
    variant_id = os.getenv('LEMONSQUEEZY_VARIANT_ID')
    api_key = os.getenv('LEMONSQUEEZY_API_KEY')
    
    product = order.product
    total_price_cents = int(order.amount_paid * 100)
    
    payload = {
        "data": {
            "type": "checkouts",
            "attributes": {
                "custom_price": total_price_cents,
                "checkout_data": {
                    "custom": {
                        "order_ids": json.dumps([order.id])
                    }
                },
                 "product_options": {
                    "name": f"Payment for Order #{order.id} - {product.name}",
                    "description": "Miria Marketplace",
                    "receipt_button_text": "Return to Store",
                    "receipt_link_url": os.getenv("FRONTEND_URL", "http://localhost:5173") + "/my-orders",
                    "redirect_url": os.getenv("FRONTEND_URL", "http://localhost:5173") + "/my-orders"
                }
            },
            "relationships": {
                "store": {"data": {"type": "stores", "id": str(store_id)}},
                "variant": {"data": {"type": "variants", "id": str(variant_id)}}
            }
        }
    }
    
    headers = {
        "Accept": "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
        "Authorization": f"Bearer {api_key}"
    }
    
    try:
        response = requests.post(f"{LEMONSQUEEZY_API_URL}/checkouts", json=payload, headers=headers)
        if not response.ok:
             return jsonify({"message": "Provider Error"}), 500
        return jsonify({"checkout_url": response.json()['data']['attributes']['url']})
    except Exception as e:
        return jsonify({"message": str(e)}), 500

@api_bp.route('/orders/<int:order_id>/cancel', methods=['POST'])
@jwt_required()
def cancel_order(order_id):
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    order = Order.query.get_or_404(order_id)
    
    # Verify ownership (Order only has email currently, tricky... assumes email matches)
    if order.customer_email != user.email:
         return jsonify({"message": "Unauthorized"}), 403
         
    if order.status == 'paid':
        return jsonify({"message": "Cannot cancel paid order"}), 400
        
    order.status = 'cancelled'
    db.session.commit()
    return jsonify({"message": "Order cancelled"})
