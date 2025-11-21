"""
WSGI entry point for production deployment with gunicorn.
This file is used by Zeabur and other cloud platforms.
"""
import sys
import os

# Add the parent directory to the Python path
# This allows importing 'backend' as a package
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Now we can import from the backend package
from backend.app import create_app

app = create_app()

if __name__ == "__main__":
    app.run()
