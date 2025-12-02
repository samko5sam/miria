# Miria - The Creator's Digital Marketplace ✨

<!--[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)-->
[![Vite](https://img.shields.io/badge/Frontend-Vite-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Python](https://img.shields.io/badge/Backend-Python-3776AB?style=for-the-badge&logo=python)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Framework-Flask-000000?style=for-the-badge&logo=flask)](https://flask.palletsprojects.com/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)

**Miria** is an elegant and intuitive web platform that empowers independent creators to sell digital products directly to their audience. From e-books and software to music and online courses, Miria provides the tools to build a business around your passion.

---

## Table of Contents

- [About The Project](#about-the-project)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Database Schema](#database-schema)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)

## About The Project

### Brand Identity & Vision

**Miria** was born from a simple idea: creators should be able to monetize their work without barriers. Our brand identity is built on three pillars:

-   **Simplicity:** We provide a clean, intuitive interface that lets creators focus on creating, not on complex configurations.
-   **Empowerment:** We give creators the tools and financial freedom to grow by offering low fees and direct access to their customers.
-   **Trust:** We ensure every transaction is secure and every digital product is delivered reliably.

### The Problem We Solve

Independent creators often face significant hurdles when trying to sell their digital goods. Existing marketplaces charge high commission fees, while building a personal e-commerce site requires technical expertise. Furthermore, ensuring the secure delivery of digital files is a constant challenge.

**Miria** solves this by offering an all-in-one solution that is affordable, secure, and incredibly easy to use.

## Key Features

### For Creators 🎨
-   **Secure Authentication:** Secure sign-up and login system for creators to manage their accounts.
-   **Intuitive Creator Dashboard:** A central hub to manage products, view sales data, and track earnings.
-   **Easy Product Management:** Effortlessly create, upload, edit, and delete digital products.
-   **Secure File Handling:** Secure storage for digital files, accessible only after a verified purchase.

### For Customers 🛒
-   **Clean Product Showcase:** A simple and beautiful storefront for each creator.
-   **Secure Payment Processing:** Integrated with **TapPay** for fast and secure checkout.
-   **Automated Digital Delivery:** Instantly receive a unique, secure download link via email after a successful purchase.

## Technology Stack

This project is built with a modern, reliable, and scalable tech stack.

### Frontend
-   **[React.js](https://reactjs.org/):** A JavaScript library for building dynamic user interfaces.
-   **[Vite](https://vitejs.dev/):** A lightning-fast frontend build tool that provides an exceptional development experience.
-   **[Axios](https://axios-http.com/):** For making API requests to the backend.

### Backend
-   **[Python](https://www.python.org/):** A versatile and powerful language for server-side logic.
-   **[Flask](https://flask.palletsprojects.com/):** A lightweight and flexible web framework for Python.
-   **[Flask-SQLAlchemy](https://flask-sqlalchemy.palletsprojects.com/):** For elegant and efficient database interactions with PostgreSQL.
-   **[Flask-JWT-Extended](https://flask-jwt-extended.readthedocs.io/):** For secure authentication using JSON Web Tokens (JWT).
-   **[TapPay API](https://www.tappaysdk.com/):** For handling all payment processing securely.

### Database
-   **[PostgreSQL](https://www.postgresql.org/):** A powerful, open-source object-relational database system known for its reliability, feature robustness, and performance.

<!--## Database Schema

Our relational database is designed for data integrity and scalability, centered around three core tables.

![Database ERD](https://via.placeholder.com/600x300.png?text=Miria+Database+Schema+ERD)
*(Optional: Replace with a real diagram of your database schema)*

1.  **`users`**: Stores creator account information.
    -   `id`, `username`, `email`, `password_hash`, `created_at`
2.  **`products`**: Contains details for each digital product.
    -   `id`, `creator_id` (FK), `name`, `description`, `price`, `file_path`
3.  **`orders`**: Logs every successful transaction.
    -   `id`, `product_id` (FK), `customer_email`, `amount_paid`, `tappay_trade_id`-->

## Getting Started

Follow these instructions to get a local copy of the project up and running for development and testing.

### Prerequisites

Make sure you have the following software installed on your machine:
-   Python (3.10 or later) & Pip
-   Node.js (v20 or later) & npm
-   PostgreSQL Server

### Installation

1.  **Clone the repository**
    ```sh
    git clone https://github.com/your-username/miria.git
    cd miria
    ```

2.  **Setup Backend (Flask)**
    ```sh
    cd backend
    # Create and activate a virtual environment
    python -m venv .venv
    source .venv/bin/activate  # On Windows, use: .venv\Scripts\activate

    # Install Python dependencies
    pip install -r requirements.txt

3.  **Setup Frontend (Vite + React)**
    ```sh
    cd ../frontend
    npm install
    ```

4.  **Set up Environment Variables**
    -   **Backend**: In the `backend` directory, create a `.env` file by copying `.env.template`. Add your configuration details:
        ```
        # Flask and database settings
        DATABASE_URL="postgresql://user:password@localhost/miria_db"
        SECRET_KEY="your_flask_secret_key"
        JWT_SECRET_KEY="your_jwt_secret_key"
        FLASK_ENV="development"

        # Frontend URL for CORS configuration in production
        FRONTEND_URL="https://your-frontend-url.com"

        # Payment gateway (TapPay)
        TAPPAY_PARTNER_KEY="your_tappay_partner_key"
        TAPPAY_MERCHANT_ID="your_tappay_merchant_id"

        # File storage (MinIO)
        MINIO_ENDPOINT="your_minio_endpoint" # e.g., localhost:9000
        MINIO_ACCESS_KEY="your_minio_access_key"
        MINIO_SECRET_KEY="your_minio_secret_key"
        MINIO_PUBLIC_BUCKET="your_public_bucket_name"
        MINIO_PRIVATE_BUCKET="your_private_bucket_name"
        ```
    -   **Frontend**: In the `frontend` directory, create a `.env.development` file for local development:
        ```
        VITE_API_URL=http://localhost:5000/api
        ```
        For production deployment, create a `.env.production` file with your production API URL:
        ```
        VITE_API_URL=https://your-backend-api-url.com/api
        ```

5.  **Set up the PostgreSQL Database**
    -   Connect to your PostgreSQL server.
    -   Create a new database: `CREATE DATABASE miria_db;`
    -   Run the database migrations to create the tables:
        ```sh
        # Make sure you are in the backend directory with venv activated
        # Set the FLASK_APP environment variable
        $ENV:FLASK_APP="wsgi.py" # For Windows PowerShell
        # export FLASK_APP=wsgi.py # For Linux/macOS bash

        flask db upgrade
        ```

## Usage

1.  **Start the Backend Server**
    -   Navigate to the `backend` directory and ensure your virtual environment is activated.
    -   Set the `FLASK_APP` environment variable:
        ```sh
        $ENV:FLASK_APP="wsgi.py" # For Windows PowerShell
        # export FLASK_APP=wsgi.py # For Linux/macOS bash
        ```
    -   Run the Flask development server:
        ```sh
        flask run
        ```
    -   The server will start, typically on `http://127.0.0.1:5000`.
    -   *Note: `python wsgi.py` is primarily intended for production deployments with WSGI servers like Gunicorn, not for local development.*

2.  **Start the Frontend Development Server**
    -   Navigate to the `frontend` directory.
    -   Run the Vite development server:
        ```sh
        npm run dev
        ```
    -   The React application will open in your browser, typically at `http://localhost:5173`.

## Deployment

### Environment Configuration

The application uses environment variables to configure the API endpoint, making it easy to deploy to any cloud service.

**Frontend Environment Variables:**
- `VITE_API_URL`: The URL of your backend API (e.g., `https://api.yourdomain.com/api`)

**Backend Environment Variables:**
- `DATABASE_URL`: PostgreSQL connection string
- `SECRET_KEY`: Flask secret key
- `JWT_SECRET_KEY`: JWT secret key for authentication
- `FLASK_ENV`: Set to `production` for deployments
- `FRONTEND_URL`: The URL of your deployed frontend (for CORS)
- `TAPPAY_PARTNER_KEY`: TapPay partner key
- `TAPPAY_MERCHANT_ID`: TapPay merchant ID
- `MINIO_ENDPOINT`: The endpoint URL of your MinIO or S3-compatible storage
- `MINIO_ACCESS_KEY`: Access key for your storage bucket
- `MINIO_SECRET_KEY`: Secret key for your storage bucket
- `MINIO_PUBLIC_BUCKET`: Name of the public bucket (for profile pictures)
- `MINIO_PRIVATE_BUCKET`: Name of the private bucket (for product files)

### Deploying to Cloud Services

#### Backend Deployment (Flask)

Popular options for deploying the Flask backend:

1. **Render / Railway / Fly.io**
   - Connect your GitHub repository
   - Set environment variables in the platform dashboard
   - The platform will automatically detect and deploy your Flask app

2. **Heroku**
   - Create a `Procfile` in the backend directory:
     ```
     web: gunicorn run:app
     ```
   - Install gunicorn: `pip install gunicorn`
   - Deploy using Heroku CLI or GitHub integration

3. **AWS / Google Cloud / Azure**
   - Use container services (ECS, Cloud Run, App Service)
   - Or use platform-specific app services

#### Frontend Deployment (Vite/React)

Popular options for deploying the frontend:

1. **Vercel / Netlify**
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set output directory: `dist`
   - Add environment variable: `VITE_API_URL=https://your-backend-url.com/api`

2. **Cloudflare Pages**
   - Similar to Vercel/Netlify
   - Great for global CDN distribution

3. **Static Hosting (S3, Firebase Hosting, etc.)**
   - Build locally: `npm run build`
   - Upload the `dist` folder to your hosting service
   - Configure environment variables before building

### Important Notes for Production

- Always use HTTPS for production deployments
- Update CORS settings in `backend/app.py` to allow only your frontend domain
- Use strong, unique values for `SECRET_KEY` and `JWT_SECRET_KEY`
- Ensure your PostgreSQL database is properly secured
- Never commit `.env` files to version control

