import os
import hashlib
import hmac
import requests
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

    # For this MVP, we will treat the cart as a single checkout
    # In a real multi-vendor scenario, we might need separate checkouts or a platform split.
    # Here we assume a simple "Pay what you want" or standard product checkout.
    
    # NOTE: Lemon Squeezy Checkout API works best with specific Variants.
    # If we are selling dynamic products from our DB, we either:
    # 1. Have mapped our DB products to Lemon Squeezy Variants beforehand.
    # 2. Use a generic "Custom Amount" product/variant on Lemon Squeezy and pass the total amount.
    
    # We will assume the User has configured a "Generic Product" in Lemon Squeezy
    # that has "Pay what you want" enabled, or we are just creating a checkout for a specific configured variant.
    
    store_id = os.getenv('LEMONSQUEEZY_STORE_ID')
    variant_id = os.getenv('LEMONSQUEEZY_VARIANT_ID')
    api_key = os.getenv('LEMONSQUEEZY_API_KEY')

    if not all([store_id, variant_id, api_key]):
        return jsonify({"message": "Server misconfiguration: Lemon Squeezy keys missing"}), 500

    print(f"DEBUG: creating checkout for user {user.id}, cart {cart.id}")
    print(f"DEBUG: store_id={store_id}, variant_id={variant_id}")

    # Calculate total amount
    total_amount = 0
    description = []
    for item in cart.items:
        product = Product.query.get(item.product_id)
        if product:
            total_amount += product.price * item.quantity
            description.append(f"{item.quantity}x {product.name}")
    
    # Calculate tax if needed, or let Lemon Squeezy handle it if configured
    # For this implementation, we'll pass the calculated total as a custom price if supported by the variant
    # Note: 'custom_price' needs the variant to be set to 'pay_what_you_want' enabled.
    # The price should be in CENTS.
    
    
    total_price_cents = int(total_amount * 100) # No tax
    
    payload = {
        "data": {
            "type": "checkouts",
            "attributes": {
                "custom_price": total_price_cents,
                "checkout_data": {
                    "custom": {
                        "user_id": str(user.id),
                        "cart_id": str(cart.id)
                    }
                },
                 "product_options": {
                    "name": ", ".join(description)[:100], # Description truncated
                    "description": "Purchase from Miria Marketplace",
                    "receipt_button_text": "Return to Store",
                    "receipt_link_url": os.getenv("FRONTEND_URL", "http://localhost:5173") + "/profile" # Redirect after success
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
        if hasattr(e, 'response') and e.response:
             print(f"Response details: {e.response.text}")
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
        custom_data = attributes.get('test_mode') # Check if test mode but real data is in 'meta' usually?
        # Actually custom data passes through in 'meta' -> 'custom_data' or attributes -> 'checkout_data' -> 'custom'
        # The structure is data -> attributes -> custom_data (deprecated) or attributes -> first_order_item...
        # Let's check the meta.custom payload storage.
        # Lemon Squeezy passes 'custom' data inside 'meta' object of the payload usually or in attributes.
        # Let's look at `attributes['first_order_item']['product_name']` etc.
        
        # NOTE: In recent API, custom data passed during checkout creation is reflected in 
        # `meta` -> `custom_data` of the webhook payload.
        
        meta = event.get('meta', {})
        custom_data = meta.get('custom_data', {})
        
        user_id = custom_data.get('user_id')
        cart_id = custom_data.get('cart_id')
        
        if user_id and cart_id:
            # Payment successful, create Order and clear Cart
            try:
                print(f"DEBUG: Processing webhook for user_id={user_id}, cart_id={cart_id}")
                user = User.query.get(int(user_id))
                print(f"DEBUG: Found user: {user}")
                cart = Cart.query.get(int(cart_id))
                print(f"DEBUG: Found cart: {cart}")
                
                if cart and cart.items:
                    print(f"DEBUG: Cart items count: {len(cart.items)}")
                    for item in cart.items:
                        print(f"DEBUG: Processing item: {item.product_id}")
                        new_order = Order(
                            product_id=item.product_id,
                            customer_email=user.email,
                            amount_paid=item.product.price * item.quantity,
                            lemon_squeezy_order_id=str(data.get('id')),
                            tappay_trade_id="LEMON_SQUEEZY" 
                        )
                        db.session.add(new_order)
                    
                    print("DEBUG: Orders created in session")
                    for item in cart.items:
                        db.session.delete(item)
                    
                    db.session.commit()
                    print(f"Order created successfully for User {user_id}")
                    
            except Exception as e:
                import traceback
                print(f"Error processing webhook: {str(e)}")
                print(traceback.format_exc())
                return jsonify({"message": "Error processing order"}), 500

    return jsonify({"received": True})
