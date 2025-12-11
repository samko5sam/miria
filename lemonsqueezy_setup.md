# Lemon Squeezy Setup Guide for Miria

This guide details the steps required to configure Lemon Squeezy for the Miria Marketplace payment integration.

## 1. Create a Lemon Squeezy Account & Store

1.  Go to [lemonsqueezy.com](https://www.lemonsqueezy.com/) and sign up.
2.  Once logged in, follow the prompts to create your **Store**.
    *   You can start in **Test Mode** (highly recommended for development).

## 2. Create the "General" Product

Since our platform sells various dynamic products, we use a single "generic" product on Lemon Squeezy that allows for custom pricing ("Pay what you want"). We then pass the actual cart total as the custom price.

1.  Navigate to **Products** in your dashboard.
2.  Click **New product**.
3.  Fill in the details:
    *   **Name**: "Miria Marketplace Purchase" (or similar).
    *   **Description**: "Purchase from Miria".
4.  **Pricing**:
    *   Select **"Pay what you want"**.
    *   Set **Minimum price** to `$0` (or a low amount like `$0.50` if you want to enforce a minimum).
    *   *Important*: The backend will override this price with the user's cart total.
5.  **Files**: You don't need to upload files here since our app handles delivery.
6.  **Confirmation Modal / Email**: You can customize these to link back to the user's profile on Miria.
7.  Click **Publish product**.
8.  **Get the Variant ID**:
    *   Go to the product page you just created.
    *   The URL usually contains the product ID.
    *   However, we need the **Variant ID**.
    *   Easiest way: Click "Share" -> "Checkout link".
    *   The URL will look like `.../checkout/buy/variant_id`. Copy that last number. That is your `LEMONSQUEEZY_VARIANT_ID`.

## 3. Generate API Keys

1.  Go to **Settings** -> **API**.
2.  Click **New API key**.
3.  Give it a name (e.g., "Miria Backend").
4.  Copy the key immediately. This is your `LEMONSQUEEZY_API_KEY`.

## 4. Get Your Store ID

1.  Go to **Settings** -> **General**.
2.  Your **Store ID** is listed there. That is your `LEMONSQUEEZY_STORE_ID`.

## 5. Setup Webhooks (Critical for Order Fulfillment)

Webhooks allow Lemon Squeezy to notify your backend when a payment is successful, so you can record the order.

1.  Go to **Settings** -> **Webhooks**.
2.  Click **New webhook**.
3.  **URL**: This must be a publicly accessible URL for your backend.
    *   **Production**: `https://your-miria-app.zeabur.app/api/webhook`
    *   **Local Development**: You need a tool like `ngrok` to expose your localhost.
        *   Run: `ngrok http 5000` (assuming flask runs on 5000).
        *   Use the generated https URL: `https://abcd-123.ngrok-free.app/api/webhook`.
4.  **Signing Secret**: Generate a secret (or let it generate one). Copy this. This is your `LEMONSQUEEZY_WEBHOOK_SECRET`.
5.  **Events**: Check **"Order created"**. You might also want "Order refunded" for future handling.
6.  Click **Save webhook**.

## 6. Configure Environment Variables

Update your `backend/.env` file with the gathered credentials:

```bash
# Lemon Squeezy Payment
LEMONSQUEEZY_API_KEY=your_api_key_here
LEMONSQUEEZY_STORE_ID=your_store_id_here
LEMONSQUEEZY_VARIANT_ID=your_variant_id_here
LEMONSQUEEZY_WEBHOOK_SECRET=your_webhook_secret_here

# App URL (Used for redirecting back after checkout)
FRONTEND_URL=http://localhost:5173
```

## 7. Testing

1.  Make sure your Store is in **Test Mode**.
2.  Restart your backend to load the new `.env` variables.
3.  Go to your app, add items to cart, and click Pay.
4.  You should be redirected to a Lemon Squeezy checkout with the correct total amount.
5.  Use a test card (e.g., `4242...`) to pay.
6.  Verify the order appears in your app's database.
