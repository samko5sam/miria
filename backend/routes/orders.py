from flask import jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from . import api_bp
from extensions import db
from models import Order, User, Product, ProductFile

@api_bp.route('/my-orders', methods=['GET'])
@jwt_required()
def get_my_orders():
    """Get all paid orders for the current user"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({"message": "User not found"}), 404

    # Fetch orders by email
    orders = Order.query.filter_by(customer_email=user.email).order_by(Order.created_at.desc()).all()
    
    orders_data = []
    for order in orders:
        product = order.product
        # Only include if product still exists
        if product:
            orders_data.append({
                'id': order.id,
                'order_id': order.lemon_squeezy_order_id,
                'amount_paid': order.amount_paid,
                'created_at': order.created_at.isoformat(),
                'product': {
                    'id': product.id,
                    'name': product.name,
                    'description': product.description,
                    'price': product.price,
                    'files': [{
                        'id': f.id,
                        'filename': f.filename,
                        'file_size': f.file_size,
                        'content_type': f.content_type
                    } for f in product.files]
                }
            })
            
    return jsonify(orders_data), 200
