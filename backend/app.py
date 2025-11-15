import os
from datetime import datetime
from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize extensions
db = SQLAlchemy()
jwt = JWTManager()
migrate = Migrate()
cors = CORS()

# App factory
def create_app():
    """Create and configure an instance of the Flask application."""
    app = Flask(__name__)

    # Configuration
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # Initialize extensions with app
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    cors.init_app(app, resources={r"/api/*": {"origins": "*"}}) # Allow CORS for /api/ routes

    with app.app_context():
        # Models
        class User(db.Model):
            __tablename__ = 'users'
            id = db.Column(db.Integer, primary_key=True)
            username = db.Column(db.String(80), unique=True, nullable=False)
            email = db.Column(db.String(120), unique=True, nullable=False)
            password_hash = db.Column(db.String(128), nullable=False)
            created_at = db.Column(db.DateTime, default=datetime.utcnow)
            products = db.relationship('Product', backref='user', lazy=True)

        class Product(db.Model):
            __tablename__ = 'products'
            id = db.Column(db.Integer, primary_key=True)
            user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
            name = db.Column(db.String(100), nullable=False)
            description = db.Column(db.Text, nullable=True)
            price = db.Column(db.Float, nullable=False)
            file_path = db.Column(db.String(255), nullable=False)
            orders = db.relationship('Order', backref='product', lazy=True)

        class Order(db.Model):
            __tablename__ = 'orders'
            id = db.Column(db.Integer, primary_key=True)
            product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
            customer_email = db.Column(db.String(120), nullable=False)
            amount_paid = db.Column(db.Float, nullable=False)
            tappay_trade_id = db.Column(db.String(120), nullable=True)
            created_at = db.Column(db.DateTime, default=datetime.utcnow)

        # A simple welcome route
        @app.route('/')
        def index():
            return jsonify({"message": "Welcome to the Miria Backend!"})

        # You would add your API routes here, probably in a separate module
        # For example:
        # from . import routes
        # app.register_blueprint(routes.api_bp)

        return app

# To run the app (for development):
# set FLASK_APP=app.py
# flask run
