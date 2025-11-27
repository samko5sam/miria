"""
WSGI entry point for production deployment with gunicorn.
This file is used by Zeabur and other cloud platforms.
"""

import sys
import os

# Add the directory containing this file to the Python path
sys.path.append(os.path.dirname(__file__))

from app import create_app

app = create_app()

if __name__ == "__main__":
    app.run()
