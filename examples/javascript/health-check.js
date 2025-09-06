const response = await fetch('http://localhost:3001/v1/health', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const data = await response.json();
console.log(data);