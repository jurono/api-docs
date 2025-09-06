# Code Examples

This section provides code examples for the Jurono API in various programming languages.

## cURL Examples

### Health Check
```bash
curl -H "Authorization: Bearer $TOKEN" http://localhost:3001/v1/health
```

### Create Lead
```bash
curl -X POST "http://localhost:3001/v1/leads" \
 -H "Authorization: Bearer $TOKEN" \
 -H "Content-Type: application/json" \
 -d '{"email":"client@example.com","message":"Hello"}'
```

## JavaScript Examples

### Health Check
```javascript
const response = await fetch('http://localhost:3001/v1/health', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const data = await response.json();
console.log(data);
```

## Python Examples

### Health Check
```python
import requests

response = requests.get(
    'http://localhost:3001/v1/health',
    headers={'Authorization': f'Bearer {token}'}
)

print(response.json())
```

## Postman Collection

We provide a comprehensive Postman collection with all API endpoints. You can import it from:

- [Jurono.postman_collection.json](/postman/Jurono.postman_collection.json)

The collection includes:
- Pre-configured environment variables
- Authentication examples
- All major endpoints
- Response examples