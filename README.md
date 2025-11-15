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
    ```
    *Note: Create a `requirements.txt` file using `pip freeze > requirements.txt` after installing your packages (e.g., `pip install Flask Flask-SQLAlchemy ...`).*

3.  **Setup Frontend (Vite + React)**
    ```sh
    cd ../frontend
    npm install
    ```

4.  **Set up Environment Variables**
    -   In the `backend` directory, create a `.env` file. Add your configuration details:
        ```
        DATABASE_URL="postgresql://user:password@localhost/miria_db"
        SECRET_KEY="your_flask_secret_key"
        JWT_SECRET_KEY="your_jwt_secret_key"
        TAPPAY_PARTNER_KEY="your_tappay_partner_key"
        TAPPAY_MERCHANT_ID="your_tappay_merchant_id"
        ```

5.  **Set up the PostgreSQL Database**
    -   Connect to your PostgreSQL server.
    -   Create a new database: `CREATE DATABASE miria_db;`
    -   Run the database migrations to create the tables:
        ```sh
        # Make sure you are in the server directory with venv activated
        flask db upgrade
        ```

## Usage

1.  **Start the Backend Server**
    -   Navigate to the `backend` directory and ensure your virtual environment is activated.
    -   Run the Flask application:
        ```sh
        flask run
        ```
    -   The server will start, typically on `http://127.0.0.1:5000`.

2.  **Start the Frontend Development Server**
    -   Navigate to the `frontend` directory.
    -   Run the Vite development server:
        ```sh
        npm run dev
        ```
    -   The React application will open in your browser, typically at `http://localhost:5173`.
