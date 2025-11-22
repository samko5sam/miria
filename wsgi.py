"""
WSGI entry point for Zeabur deployment.
This file should be at the same level as the backend directory.
"""
import sys
import os

# Add the current directory to Python path so we can import backend as a package
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from backend.app import create_app

app = create_app()

if __name__ == "__main__":
    app.run()
