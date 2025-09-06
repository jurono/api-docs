curl -X POST "http://localhost:3001/v1/leads" \
 -H "Authorization: Bearer $TOKEN" \
 -H "Content-Type: application/json" \
 -d '{"email":"client@example.com","message":"Hello"}'