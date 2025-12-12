import os
from flask import Flask, jsonify
from dotenv import load_dotenv
from extensions import db, jwt, migrate, cors

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

    # Determine CORS origins based on environment
    flask_env = os.getenv("FLASK_ENV", "production")
    if flask_env == "development":
        # Allow all origins in development
        allowed_origins = "*"
    else:
        # Only allow specific origins in production
        frontend_url = os.getenv("FRONTEND_URL", "https://miria.zeabur.app")
        allowed_origins = [frontend_url]

    # Initialize extensions with app
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    cors.init_app(app, resources={
        r"/api/*": {
            "origins": allowed_origins,
            "methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "supports_credentials": False
        }
    })

    with app.app_context():
        import models
        from routes import api_bp
        from routes.store import store_bp

        # A simple welcome route
        @app.route('/')
        def index():
            return jsonify({"message": "Welcome to the Miria Backend!"})

        app.register_blueprint(api_bp, url_prefix='/api')
        app.register_blueprint(store_bp, url_prefix='/api/stores')

        return app
