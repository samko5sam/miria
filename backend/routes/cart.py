from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from . import api_bp
from extensions import db
from models import Cart, CartItem, Product, User, Store
from datetime import datetime

@api_bp.route('/cart', methods=['GET'])
@jwt_required()
def get_cart():
    """Get the current user's cart"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({"message": "User not found"}), 404

    # Find or create cart for the user
    cart = Cart.query.filter_by(user_id=current_user_id).first()

    if not cart:
        # Create a new cart if one doesn't exist
        cart = Cart()
        cart.user_id = current_user_id
        db.session.add(cart)
        db.session.commit()

    # Get cart items with product details
    cart_items = []
    total_price = 0.0

    for item in cart.items:
        product = Product.query.get(item.product_id)
        if product:
            item_total = product.price * item.quantity
            cart_items.append({
                'id': item.id,
                'product_id': item.product_id,
                'product_name': product.name,
                'product_price': product.price,
                'quantity': item.quantity,
                'total': item_total,
                'created_at': item.created_at.isoformat() if item.created_at else None,
                'store_name': product.user.store.name if product.user and product.user.store else 'Unknown Store',
                'store_id': product.user.store.id if product.user and product.user.store else None
            })
            total_price += item_total

    return jsonify({
        'cart_id': cart.id,
        'user_id': cart.user_id,
        'items': cart_items,
        'total_items': len(cart_items),
        'total_price': round(total_price, 2),
        'created_at': cart.created_at.isoformat() if cart.created_at else None,
        'updated_at': cart.updated_at.isoformat() if cart.updated_at else None
    })

@api_bp.route('/cart/items', methods=['POST'])
@jwt_required()
def add_to_cart():
    """Add an item to the cart"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({"message": "User not found"}), 404

    data = request.get_json()
    product_id = data.get('product_id')
    quantity = data.get('quantity', 1)

    if not product_id:
        return jsonify({"message": "Product ID is required"}), 400

    # Check if product exists
    product = Product.query.get(product_id)
    if not product:
        return jsonify({"message": "Product not found"}), 404

    # Find or create cart for the user
    cart = Cart.query.filter_by(user_id=current_user_id).first()
    if not cart:
        cart = Cart()
        cart.user_id = current_user_id
        db.session.add(cart)
        db.session.commit()

    # Check if item already exists in cart
    existing_item = CartItem.query.filter_by(cart_id=cart.id, product_id=product_id).first()

    if existing_item:
        # Update quantity if item already exists
        existing_item.quantity += int(quantity)
    else:
        # Add new item to cart
        new_item = CartItem(
            cart_id=cart.id,
            product_id=product_id,
            quantity=int(quantity)
        )
        db.session.add(new_item)

    # Update cart timestamp
    cart.updated_at = datetime.utcnow()
    db.session.commit()

    return jsonify({
        "message": "Item added to cart successfully",
        "cart_item_id": existing_item.id if existing_item else new_item.id
    }), 201

@api_bp.route('/cart/items/<int:item_id>', methods=['PUT'])
@jwt_required()
def update_cart_item(item_id):
    """Update cart item quantity"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({"message": "User not found"}), 404

    data = request.get_json()
    quantity = data.get('quantity')

    if quantity is None:
        return jsonify({"message": "Quantity is required"}), 400

    try:
        quantity = int(quantity)
        if quantity <= 0:
            return jsonify({"message": "Quantity must be positive"}), 400
    except ValueError:
        return jsonify({"message": "Invalid quantity"}), 400

    # Find the cart item
    cart_item = CartItem.query.get(item_id)
    if not cart_item:
        return jsonify({"message": "Cart item not found"}), 404

    # Verify the item belongs to the user's cart
    cart = Cart.query.filter_by(user_id=current_user_id).first()
    if not cart or cart_item.cart_id != cart.id:
        return jsonify({"message": "Unauthorized"}), 403

    # Update quantity
    cart_item.quantity = quantity
    cart.updated_at = datetime.utcnow()
    db.session.commit()

    return jsonify({
        "message": "Cart item updated successfully",
        "item_id": cart_item.id,
        "new_quantity": cart_item.quantity
    })

@api_bp.route('/cart/items/<int:item_id>', methods=['DELETE'])
@jwt_required()
def remove_from_cart(item_id):
    """Remove an item from the cart"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({"message": "User not found"}), 404

    # Find the cart item
    cart_item = CartItem.query.get(item_id)
    if not cart_item:
        return jsonify({"message": "Cart item not found"}), 404

    # Verify the item belongs to the user's cart
    cart = Cart.query.filter_by(user_id=current_user_id).first()
    if not cart or cart_item.cart_id != cart.id:
        return jsonify({"message": "Unauthorized"}), 403

    # Remove the item
    db.session.delete(cart_item)
    cart.updated_at = datetime.utcnow()
    db.session.commit()

    return jsonify({"message": "Item removed from cart successfully"})

@api_bp.route('/cart/clear', methods=['DELETE'])
@jwt_required()
def clear_cart():
    """Clear the entire cart"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({"message": "User not found"}), 404

    # Find the user's cart
    cart = Cart.query.filter_by(user_id=current_user_id).first()
    if not cart:
        return jsonify({"message": "Cart not found"}), 404

    # Clear all items from cart
    CartItem.query.filter_by(cart_id=cart.id).delete()
    cart.updated_at = datetime.utcnow()
    db.session.commit()

    return jsonify({"message": "Cart cleared successfully"})

@api_bp.route('/cart/merge', methods=['POST'])
@jwt_required()
def merge_cart():
    """Merge local cart items into user's cloud cart"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({"message": "User not found"}), 404

    # Find or create cart for the user
    cart = Cart.query.filter_by(user_id=current_user_id).first()
    if not cart:
        cart = Cart()
        cart.user_id = current_user_id
        db.session.add(cart)
        db.session.commit()

    data = request.get_json()
    local_items = data.get('items', [])
    
    if not isinstance(local_items, list):
         return jsonify({"message": "Items must be a list"}), 400

    merged_count = 0
    
    for local_item in local_items:
        product_id = local_item.get('product_id')
        quantity = local_item.get('quantity')
        
        if not product_id or not quantity:
            continue
            
        try:
            quantity = int(quantity)
            if quantity <= 0:
                continue
        except ValueError:
            continue

        # Check if product exists
        product = Product.query.get(product_id)
        if not product:
            continue
            
        # Check if item already exists in cart
        existing_item = CartItem.query.filter_by(cart_id=cart.id, product_id=product_id).first()
        
        if existing_item:
            # For merge, we can decide strategy. 
            # Strategy: Max(cloud, local) or Sum? 
            # Usually users expect "Added locally" + "Added on cloud" = Sum. 
            # But if it's "Sync", maybe max? 
            # Let's go with ADD, but checking if it gets ridiculous?
            # Actually, standard ecommerce merge is often just adding the local qty to cloud qty.
            existing_item.quantity += quantity
        else:
            new_item = CartItem(
                cart_id=cart.id,
                product_id=product_id,
                quantity=quantity
            )
            db.session.add(new_item)
        
        merged_count += 1

    cart.updated_at = datetime.utcnow()
    db.session.commit()
    
    return jsonify({
        "message": "Cart merged successfully",
        "merged_count": merged_count
    })

