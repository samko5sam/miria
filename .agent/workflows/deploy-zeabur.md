---
description: Deploy the Flask backend server to Zeabur
---

# Deploy Flask Backend to Zeabur

This workflow guides you through deploying the Miria Flask backend to Zeabur, a modern cloud platform that supports Python applications.

## Prerequisites

1. A [Zeabur account](https://zeabur.com/) (sign up with GitHub for easiest integration)
2. Your code pushed to a GitHub repository
3. A PostgreSQL database (Zeabur provides one-click PostgreSQL service)

## Step 1: Prepare Your Backend for Deployment

### 1.1 Create a `zbpack.json` file in the `backend` directory

This file tells Zeabur how to build and run your Flask application:

```json
{
  "build_command": "pip install -r requirements.txt",
  "start_command": "gunicorn --bind 0.0.0.0:$PORT run:app"
}
```

### 1.2 Add `gunicorn` to your requirements.txt

Gunicorn is a production-grade WSGI server for Python applications:

```
Flask
Flask-SQLAlchemy
Flask-Migrate
python-dotenv
Flask-JWT-Extended
psycopg2-binary
Flask-Cors
gunicorn
```

### 1.3 Update `run.py` for production

Ensure your `run.py` can work with gunicorn:

```python
from .app import create_app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True)
```

The `app` variable at module level is what gunicorn will use.

## Step 2: Create a New Project on Zeabur

1. Go to [Zeabur Dashboard](https://dash.zeabur.com/)
2. Click **"Create Project"**
3. Give your project a name (e.g., "miria-backend")
4. Select a region closest to your target users

## Step 3: Add PostgreSQL Database Service

1. In your Zeabur project, click **"Add Service"**
2. Select **"Prebuilt"** tab
3. Choose **"PostgreSQL"**
4. Wait for the database to be provisioned
5. Zeabur will automatically create a `DATABASE_URL` environment variable

## Step 4: Deploy Your Flask Backend

1. In your Zeabur project, click **"Add Service"** again
2. Select **"Git"** tab
3. Connect your GitHub account if not already connected
4. Select your repository (e.g., `samko5sam/miria`)
5. Zeabur will auto-detect it's a Python project
6. Set the **Root Directory** to `backend` (important!)
7. Click **"Deploy"**

## Step 5: Configure Environment Variables

In the Zeabur dashboard for your Flask service:

1. Go to the **"Variables"** tab
2. Add the following environment variables:

```
SECRET_KEY=your_flask_secret_key_here
JWT_SECRET_KEY=your_jwt_secret_key_here
TAPPAY_PARTNER_KEY=your_tappay_partner_key
TAPPAY_MERCHANT_ID=your_tappay_merchant_id
```

**Note:** The `DATABASE_URL` should already be automatically set by Zeabur when you added PostgreSQL.

To generate secure secret keys, you can use:
```python
import secrets
print(secrets.token_hex(32))
```

## Step 6: Run Database Migrations

After deployment, you need to initialize your database:

1. In Zeabur dashboard, go to your Flask service
2. Click on the **"Logs"** tab to monitor
3. Go to the **"Console"** or **"Terminal"** tab
4. Run the migration commands:

```bash
flask db upgrade
```

If you don't have migrations set up yet, you may need to:
```bash
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
```

## Step 7: Enable Public Access

1. In your Flask service settings, go to **"Networking"** or **"Domains"**
2. Zeabur will provide a default domain like `your-service.zeabur.app`
3. You can also add a custom domain if you have one

## Step 8: Test Your Deployment

1. Copy your Zeabur deployment URL (e.g., `https://miria-backend.zeabur.app`)
2. Test the root endpoint:
   ```
   https://your-service.zeabur.app/
   ```
   Should return: `{"message": "Welcome to the Miria Backend!"}`

3. Test the API endpoints:
   ```
   https://your-service.zeabur.app/api/auth/register
   ```

## Step 9: Update Frontend Configuration

Update your frontend's environment variables to point to the new Zeabur backend:

**In `frontend/.env.production`:**
```
VITE_API_URL=https://your-service.zeabur.app/api
```

## Troubleshooting

### Issue: Application won't start
- Check the **Logs** tab in Zeabur dashboard
- Verify all environment variables are set correctly
- Ensure `gunicorn` is in `requirements.txt`
- Verify the root directory is set to `backend`

### Issue: Database connection errors
- Check that `DATABASE_URL` environment variable is set
- Verify PostgreSQL service is running
- Check if migrations have been run

### Issue: CORS errors from frontend
- Update CORS settings in `backend/app.py` to allow your frontend domain
- Example:
  ```python
  cors.init_app(app, resources={
      r"/api/*": {
          "origins": ["https://your-frontend.vercel.app", "http://localhost:5173"]
      }
  })
  ```

### Issue: 502 Bad Gateway
- Check if the application is binding to the correct port
- Zeabur provides `$PORT` environment variable
- Ensure gunicorn command uses: `--bind 0.0.0.0:$PORT`

## Monitoring and Maintenance

- **Logs**: Monitor application logs in Zeabur dashboard
- **Metrics**: Check CPU, memory usage in the Metrics tab
- **Scaling**: Zeabur can auto-scale based on traffic
- **Updates**: Push to your GitHub repo to trigger automatic redeployment

## Cost Considerations

- Zeabur offers a free tier for hobby projects
- PostgreSQL database and Flask service both consume resources
- Check [Zeabur pricing](https://zeabur.com/pricing) for details

## Alternative: Using Docker (Optional)

If you prefer Docker deployment, create a `Dockerfile` in the `backend` directory:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["gunicorn", "--bind", "0.0.0.0:$PORT", "run:app"]
```

Then Zeabur will automatically detect and use Docker for deployment.
