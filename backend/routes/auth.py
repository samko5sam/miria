from flask import request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from . import api_bp
from ..extensions import db
from ..models import User


@api_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        print(f"Received registration request with data: {data}")
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        role = 'buyer'

        if not username or not email or not password:
            return jsonify({"message": "Username, email, and password are required"}), 400

        # Validate role
        valid_roles = ['admin', 'seller', 'buyer']
        if role not in valid_roles:
            return jsonify({"message": f"Invalid role. Must be one of: {', '.join(valid_roles)}"}), 400

        if User.query.filter_by(username=username).first() or User.query.filter_by(email=email).first():
            return jsonify({"message": "User already exists"}), 400

        hashed_password = generate_password_hash(password)
        new_user = User(username=username, email=email, password_hash=hashed_password, role=role)
        print(f"Creating new user: {new_user}")
        db.session.add(new_user)
        db.session.commit()
        print("User created successfully")

        return jsonify({"message": "User created successfully"}), 201
    except Exception as e:
        print(f"An error occurred during registration: {e}")
        db.session.rollback()
        return jsonify({"message": "An internal error occurred"}), 500

@api_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"message": "Username and password are required"}), 400

    user = User.query.filter_by(username=username).first()

    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"message": "Invalid credentials"}), 401

    access_token = create_access_token(identity=user.id)
    return jsonify(access_token=access_token)

@api_bp.route('/profile')
@jwt_required()
def profile():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    return jsonify(username=user.username, email=user.email, role=user.role)

