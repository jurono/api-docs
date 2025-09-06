import requests

response = requests.get(
    'http://localhost:3001/v1/health',
    headers={'Authorization': f'Bearer {token}'}
)

print(response.json())