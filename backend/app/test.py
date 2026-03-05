import requests

response = requests.post(
    "http://localhost:8000/api/analyze/",
    json={"logs": "Multiple failed login attempts from 192.168.1.10"}
)

print(response.json()) 