import requests

# Test the toggle-status endpoint
url = "http://localhost:5000/api/products/1/toggle-status"

# Get token from your frontend localStorage - replace this with your actual token
token = "YOUR_TOKEN_HERE"  # You need to get this from browser's localStorage

headers = {
    "Authorization": f"Bearer {token}",
    "Content-Type": "application/json"
}

print(f"Testing URL: {url}")
print(f"Method: PATCH")
print(f"Headers: {headers}")

try:
    response = requests.patch(url, headers=headers)
    print(f"\nStatus Code: {response.status_code}")
    print(f"Response: {response.json()}")
except Exception as e:
    print(f"\nError: {e}")
    print(f"Response text: {response.text if 'response' in locals() else 'No response'}")
