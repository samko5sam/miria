from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import Store, User

store_bp = Blueprint('store', __name__)

@store_bp.route('/', methods=['POST'])
@jwt_required()
def register_store():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({"message": "User not found"}), 404

    if user.store:
        return jsonify({"message": "User already has a store"}), 400

    data = request.get_json()
    name = data.get('name')
    description = data.get('description')

    if not name:
        return jsonify({"message": "Store name is required"}), 400
        
    if len(name) > 50:
        return jsonify({"message": "Store name must be less than 50 characters"}), 400
        
    if description and len(description) > 500:
        return jsonify({"message": "Description must be less than 500 characters"}), 400

    new_store = Store(user_id=user.id, name=name, description=description)
    
    # Update user role to seller if they are a buyer
    if user.role == 'buyer':
        user.role = 'seller'

    try:
        db.session.add(new_store)
        db.session.commit()
        return jsonify({
            "message": "Store created successfully",
            "store": {
                "id": new_store.id,
                "name": new_store.name,
                "description": new_store.description
            },
            "user_role": user.role
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Failed to create store", "error": str(e)}), 500

@store_bp.route('/my', methods=['GET'])
@jwt_required()
def get_my_store():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({"message": "User not found"}), 404

    if not user.store:
        return jsonify({"message": "Store not found"}), 404

    return jsonify({
        "id": user.store.id,
        "name": user.store.name,
        "description": user.store.description,
        "created_at": user.store.created_at.isoformat()
    })

@store_bp.route('/<int:store_id>', methods=['GET'])
def get_store(store_id):
    """Get public store information"""
    store = Store.query.get(store_id)
    
    if not store:
        return jsonify({"message": "Store not found"}), 404
    
    return jsonify({
        "id": store.id,
        "name": store.name,
        "description": store.description,
        "user_id": store.user_id,
        "created_at": store.created_at.isoformat()
    })

@store_bp.route('/<int:store_id>/products', methods=['GET'])
def get_store_products(store_id):
    """Get all active products for a store (public)"""
    from models import Product
    
    store = Store.query.get(store_id)
    if not store:
        return jsonify({"message": "Store not found"}), 404
    
    # Only return active products for public view
    products = Product.query.filter_by(user_id=store.user_id, is_active=True).all()
    
    return jsonify([{
        'id': p.id,
        'name': p.name,
        'description': p.description,
        'price': p.price,
        'image_url': p.image_url,
        'created_at': p.created_at.isoformat() if p.created_at else None,
        'store_name': store.name,
        'store_id': store.id,
        'files_count': len(p.files)
    } for p in products])

@store_bp.route('/my', methods=['PUT'])
@jwt_required()
def update_my_store():
    """Update my store information"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({"message": "User not found"}), 404
    
    if not user.store:
        return jsonify({"message": "Store not found"}), 404
    
    data = request.get_json()
    name = data.get('name')
    description = data.get('description')
    
    if name is not None:
        if not name.strip():
            return jsonify({"message": "Store name cannot be empty"}), 400
        if len(name) > 50:
            return jsonify({"message": "Store name must be less than 50 characters"}), 400
        user.store.name = name.strip()
    
    if description is not None:
        if len(description) > 500:
            return jsonify({"message": "Description must be less than 500 characters"}), 400
        user.store.description = description.strip()
    
    try:
        db.session.commit()
        return jsonify({
            "message": "Store updated successfully",
            "store": {
                "id": user.store.id,
                "name": user.store.name,
                "description": user.store.description
            }
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Failed to update store", "error": str(e)}), 500
