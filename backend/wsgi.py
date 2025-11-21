"""
WSGI entry point for production deployment with gunicorn.
This file is used by Zeabur and other cloud platforms.
"""
from app import create_app

app = create_app()

if __name__ == "__main__":
    app.run()
