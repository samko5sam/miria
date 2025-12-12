from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from . import api_bp
from extensions import db
from models import Product, ProductFile, User, Order
from services.storage import StorageService
import uuid

storage_service = StorageService()

@api_bp.route('/products', methods=['GET'])
def get_products():
    """Get all products"""
    products = Product.query.all()
    return jsonify([{
        'id': p.id,
        'name': p.name,
        'description': p.description,
        'price': p.price,
        'user_id': p.user_id,
        'image_url': p.image_url,
        'is_active': p.is_active,
        'created_at': p.created_at.isoformat() if p.created_at else None,
        'updated_at': p.updated_at.isoformat() if p.updated_at else None,
        'store_name': p.user.store.name if p.user and p.user.store else 'Unknown Store',
        'store_id': p.user.store.id if p.user and p.user.store else None,
        'files': [{
            'id': f.id,
            'filename': f.filename,
            'file_size': f.file_size,
            'content_type': f.content_type
        } for f in p.files]
    } for p in products])

@api_bp.route('/products/my', methods=['GET'])
@jwt_required()
def get_my_products():
    """Get all products for the current authenticated seller"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({"message": "User not found"}), 404
    
    if user.role not in ['seller', 'admin']:
        return jsonify({"message": "Only sellers can view their products"}), 403
    
    products = Product.query.filter_by(user_id=current_user_id).all()
    return jsonify([{
        'id': p.id,
        'name': p.name,
        'description': p.description,
        'price': p.price,
        'user_id': p.user_id,
        'image_url': p.image_url,
        'is_active': p.is_active,
        'created_at': p.created_at.isoformat() if p.created_at else None,
        'updated_at': p.updated_at.isoformat() if p.updated_at else None,
        'store_name': p.user.store.name if p.user and p.user.store else 'Unknown Store',
        'store_id': p.user.store.id if p.user and p.user.store else None,
        'files': [{
            'id': f.id,
            'filename': f.filename,
            'file_size': f.file_size,
            'content_type': f.content_type
        } for f in p.files]
    } for p in products])

@api_bp.route('/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    """Get a specific product"""
    product = Product.query.get(product_id)
    if not product:
        return jsonify({"message": "Product not found"}), 404
    
    return jsonify({
        'id': product.id,
        'name': product.name,
        'description': product.description,
        'price': product.price,
        'user_id': product.user_id,
        'image_url': product.image_url,
        'is_active': product.is_active,
        'created_at': product.created_at.isoformat() if product.created_at else None,
        'updated_at': product.updated_at.isoformat() if product.updated_at else None,
        'store_name': product.user.store.name if product.user and product.user.store else 'Unknown Store',
        'store_id': product.user.store.id if product.user and product.user.store else None,
        'files': [{
            'id': f.id,
            'filename': f.filename,
            'file_size': f.file_size,
            'content_type': f.content_type
        } for f in product.files]
    })

@api_bp.route('/products', methods=['POST'])
@jwt_required()
def create_product():
    """Create a new product"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user or user.role not in ['seller', 'admin']:
        return jsonify({"message": "Only sellers can create products"}), 403
    
    data = request.get_json()
    name = data.get('name')
    description = data.get('description')
    price = data.get('price')
    
    if not name or not price:
        return jsonify({"message": "Name and price are required"}), 400
    
    try:
        price = float(price)
        if price < 0:
            return jsonify({"message": "Price must be positive"}), 400
    except ValueError:
        return jsonify({"message": "Invalid price"}), 400
    
    product = Product(
        user_id=current_user_id,
        name=name,
        description=description,
        price=price
    )
    
    db.session.add(product)
    db.session.commit()
    
    return jsonify({
        "message": "Product created successfully",
        "product_id": product.id
    }), 201

@api_bp.route('/products/<int:product_id>', methods=['DELETE'])
@jwt_required()
def delete_product(product_id):
    """Delete a product and all its associated files"""
    current_user_id = get_jwt_identity()
    product = Product.query.get(product_id)
    
    if not product:
        return jsonify({"message": "Product not found"}), 404
    
    # Check if the current user owns this product
    if product.user_id != int(current_user_id):
        return jsonify({"message": "Unauthorized"}), 403
    
    try:
        # Delete all associated files from MinIO storage
        for product_file in product.files:
            # Extract object name from URL
            object_name = product_file.file_url.split(f"{storage_service.private_bucket}/")[-1]
            storage_service.delete_file(object_name, storage_service.private_bucket)
        
        # Delete product from database (cascade will delete ProductFile records)
        db.session.delete(product)
        db.session.commit()
        
        return jsonify({"message": "Product deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Failed to delete product", "error": str(e)}), 500

@api_bp.route('/products/<int:product_id>', methods=['PUT'])
@jwt_required()
def update_product(product_id):
    """Update a product's basic information"""
    current_user_id = get_jwt_identity()
    product = Product.query.get(product_id)
    
    if not product:
        return jsonify({"message": "Product not found"}), 404
    
    # Check if the current user owns this product
    if product.user_id != int(current_user_id):
        return jsonify({"message": "Unauthorized"}), 403
    
    data = request.get_json()
    name = data.get('name')
    description = data.get('description')
    price = data.get('price')
    
    # Update fields if provided
    if name is not None:
        if not name.strip():
            return jsonify({"message": "Name cannot be empty"}), 400
        product.name = name.strip()
    
    if description is not None:
        product.description = description.strip()
    
    if price is not None:
        try:
            price_float = float(price)
            if price_float < 0:
                return jsonify({"message": "Price must be positive"}), 400
            product.price = price_float
        except ValueError:
            return jsonify({"message": "Invalid price"}), 400
    
    try:
        db.session.commit()
        return jsonify({
            "message": "Product updated successfully",
            "product": {
                "id": product.id,
                "name": product.name,
                "description": product.description,
                "price": product.price,
                "image_url": product.image_url,
                "is_active": product.is_active
            }
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Failed to update product", "error": str(e)}), 500

@api_bp.route('/products/<int:product_id>/image', methods=['POST'])
@jwt_required()
def upload_product_image(product_id):
    """Upload a product image"""
    current_user_id = get_jwt_identity()
    product = Product.query.get(product_id)
    
    if not product:
        return jsonify({"message": "Product not found"}), 404
    
    if product.user_id != int(current_user_id):
        return jsonify({"message": "Unauthorized"}), 403
    
    if 'image' not in request.files:
        return jsonify({"message": "No image file provided"}), 400
    
    image = request.files['image']
    
    if image.filename == '':
        return jsonify({"message": "No selected file"}), 400
    
    # Validate image type
    allowed_extensions = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
    if '.' not in image.filename or \
       image.filename.rsplit('.', 1)[1].lower() not in allowed_extensions:
        return jsonify({"message": "Invalid file type. Allowed: png, jpg, jpeg, gif, webp"}), 400
    
    # Check file size (max 5MB for images)
    image.seek(0, 2)  # Seek to end
    file_size = image.tell()
    image.seek(0)  # Reset to beginning
    
    max_size = 5 * 1024 * 1024  # 5MB
    if file_size > max_size:
        return jsonify({"message": "Image size exceeds maximum of 5MB"}), 400
    
    try:
        # Delete old image if exists
        if product.image_url:
            old_object_name = product.image_url.split(f"{storage_service.public_bucket}/")[-1]
            storage_service.delete_file(old_object_name, storage_service.public_bucket)
        
        # Generate a unique filename for the image
        # Structure: product_images/{product_id}/{uuid}_{filename}
        filename = f"product_images/{product_id}/{uuid.uuid4()}_{image.filename}"
        
        # Upload to MinIO public bucket
        object_name = storage_service.upload_file(
            image, 
            filename, 
            storage_service.public_bucket,
            image.content_type
        )
        
        if object_name:
            # Get public URL
            full_url = storage_service.get_public_url(object_name)
            
            # Update product image_url
            product.image_url = full_url
            db.session.commit()
            
            return jsonify({
                "message": "Image uploaded successfully",
                "image_url": full_url
            }), 200
        else:
            return jsonify({"message": "Failed to upload image"}), 500
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Failed to upload image", "error": str(e)}), 500

@api_bp.route('/products/<int:product_id>/image', methods=['DELETE'])
@jwt_required()
def delete_product_image(product_id):
    """Delete a product image"""
    current_user_id = get_jwt_identity()
    product = Product.query.get(product_id)
    
    if not product:
        return jsonify({"message": "Product not found"}), 404
    
    if product.user_id != int(current_user_id):
        return jsonify({"message": "Unauthorized"}), 403
    
    if not product.image_url:
        return jsonify({"message": "Product has no image"}), 404
    
    try:
        # Delete from MinIO public bucket
        object_name = product.image_url.split(f"{storage_service.public_bucket}/")[-1]
        storage_service.delete_file(object_name, storage_service.public_bucket)
        
        # Update product
        product.image_url = None
        db.session.commit()
        
        return jsonify({"message": "Image deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Failed to delete image", "error": str(e)}), 500

@api_bp.route('/products/<int:product_id>/toggle-status', methods=['PATCH'])
@jwt_required()
def toggle_product_status(product_id):
    """Toggle product active status (publish/unpublish)"""
    current_user_id = get_jwt_identity()
    product = Product.query.get(product_id)
    
    if not product:
        return jsonify({"message": "Product not found"}), 404
    
    if product.user_id != int(current_user_id):
        return jsonify({"message": "Unauthorized"}), 403
    
    try:
        product.is_active = not product.is_active
        db.session.commit()
        
        return jsonify({
            "message": f"Product {'published' if product.is_active else 'unpublished'} successfully",
            "is_active": product.is_active
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Failed to update product status", "error": str(e)}), 500


@api_bp.route('/products/<int:product_id>/files', methods=['POST'])
@jwt_required()
def upload_product_file(product_id):
    """Upload a file for a product"""
    current_user_id = get_jwt_identity()
    product = Product.query.get(product_id)
    
    if not product:
        return jsonify({"message": "Product not found"}), 404
    
    if product.user_id != int(current_user_id):
        return jsonify({"message": "Unauthorized"}), 403
    
    if 'file' not in request.files:
        return jsonify({"message": "No file part"}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"message": "No selected file"}), 400
    
    # Check file size
    file.seek(0, 2)  # Seek to end
    file_size = file.tell()
    file.seek(0)  # Reset to beginning
    
    if file_size > storage_service.MAX_PRODUCT_FILE_SIZE:
        max_mb = storage_service.MAX_PRODUCT_FILE_SIZE / (1024 * 1024)
        return jsonify({"message": f"File size exceeds maximum of {max_mb}MB"}), 400
    
    # Generate a unique filename
    # Structure: products/{product_id}/{uuid}_{filename}
    filename = f"products/{product_id}/{uuid.uuid4()}_{file.filename}"
    
    # Upload to MinIO private bucket
    object_name = storage_service.upload_file(
        file, 
        filename, 
        storage_service.private_bucket,
        file.content_type
    )
    
    if object_name:
        # Get private URL (for reference, actual downloads use presigned URLs)
        full_url = storage_service.get_private_url(object_name)
        
        # Create ProductFile record
        product_file = ProductFile(
            product_id=product_id,
            file_url=full_url,
            filename=file.filename,
            file_size=file_size,
            content_type=file.content_type
        )
        
        db.session.add(product_file)
        db.session.commit()
        
        return jsonify({
            "message": "File uploaded successfully",
            "file": {
                "id": product_file.id,
                "filename": product_file.filename,
                "file_size": product_file.file_size,
                "content_type": product_file.content_type
            }
        }), 200
    else:
        return jsonify({"message": "Failed to upload file"}), 500

@api_bp.route('/products/<int:product_id>/files/<int:file_id>', methods=['DELETE'])
@jwt_required()
def delete_product_file(product_id, file_id):
    """Delete a product file"""
    current_user_id = get_jwt_identity()
    product = Product.query.get(product_id)
    
    if not product:
        return jsonify({"message": "Product not found"}), 404
    
    if product.user_id != int(current_user_id):
        return jsonify({"message": "Unauthorized"}), 403
    
    product_file = ProductFile.query.get(file_id)
    
    if not product_file or product_file.product_id != product_id:
        return jsonify({"message": "File not found"}), 404
    
    # Delete from MinIO private bucket
    # Extract object name from URL
    object_name = product_file.file_url.split(f"{storage_service.private_bucket}/")[-1]
    storage_service.delete_file(object_name, storage_service.private_bucket)
    
    # Delete from database
    db.session.delete(product_file)
    db.session.commit()
    
    return jsonify({"message": "File deleted successfully"}), 200

@api_bp.route('/products/<int:product_id>/files/<int:file_id>/download', methods=['GET'])
@jwt_required()
def get_product_file_download_url(product_id, file_id):
    """Get a presigned URL to download a product file"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({"message": "User not found"}), 404
        
    product = Product.query.get(product_id)
    if not product:
        return jsonify({"message": "Product not found"}), 404
    
    # Check if the user is the seller or has bought the product
    is_seller = product.user_id == user.id
    # Check if a paid order exists for this user and product
    has_bought = Order.query.filter_by(
        customer_email=user.email, 
        product_id=product_id
    ).first() is not None
    
    if not is_seller and not has_bought:
        return jsonify({"message": "Unauthorized"}), 403

    product_file = ProductFile.query.get(file_id)
    
    if not product_file or product_file.product_id != product_id:
        return jsonify({"message": "File not found"}), 404
    
    # Extract object name from URL
    object_name = product_file.file_url.split(f"{storage_service.private_bucket}/")[-1]
    
    # Extract original filename (remove timestamp prefix if present)
    filename = product_file.filename
    
    # Generate presigned URL (valid for 1 hour) with proper filename
    presigned_url = storage_service.generate_presigned_url(
        object_name, 
        storage_service.private_bucket,
        expiration=3600,
        filename=filename
    )
    
    if presigned_url:
        return jsonify({"download_url": presigned_url}), 200
    else:
        return jsonify({"message": "Failed to generate download URL"}), 500
