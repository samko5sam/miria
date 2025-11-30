from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from . import api_bp
from extensions import db
from models import User
from services.storage import StorageService
import uuid

storage_service = StorageService()

@api_bp.route('/profile/picture', methods=['POST'])
@jwt_required()
def upload_profile_picture():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({"message": "User not found"}), 404
        
    if 'file' not in request.files:
        return jsonify({"message": "No file part"}), 400
        
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"message": "No selected file"}), 400
    
    # Check file size
    file.seek(0, 2)  # Seek to end
    file_size = file.tell()
    file.seek(0)  # Reset to beginning
    
    if file_size > storage_service.MAX_PROFILE_PICTURE_SIZE:
        max_mb = storage_service.MAX_PROFILE_PICTURE_SIZE / (1024 * 1024)
        return jsonify({"message": f"File size exceeds maximum of {max_mb}MB"}), 400
    
    # Validate file type
    if not file.content_type or not file.content_type.startswith('image/'):
        return jsonify({"message": "Only image files are allowed"}), 400
        
    if file:
        # Generate a unique filename
        # Structure: profile_pictures/{user_id}/{uuid}_{filename}
        filename = f"profile_pictures/{user.id}/{uuid.uuid4()}_{file.filename}"
        
        # Upload to MinIO public bucket
        object_name = storage_service.upload_file(
            file, 
            filename, 
            storage_service.public_bucket,
            file.content_type
        )
        
        if object_name:
            # Get public URL
            full_url = storage_service.get_public_url(object_name)
            
            user.profile_picture = full_url
            db.session.commit()
            
            return jsonify({
                "message": "Profile picture uploaded successfully", 
                "profile_picture_url": full_url
            }), 200
        else:
            return jsonify({"message": "Failed to upload file"}), 500

    return jsonify({"message": "Unknown error"}), 500
