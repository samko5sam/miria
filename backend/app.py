import os
from flask import Flask, jsonify
from dotenv import load_dotenv
from .extensions import db, jwt, migrate, cors

# Load environment variables
load_dotenv()


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
        from . import models
        from .routes import api_bp

        # A simple welcome route
        @app.route('/')
        def index():
            return jsonify({"message": "Welcome to the Miria Backend!"})

        app.register_blueprint(api_bp, url_prefix='/api')

        return app
