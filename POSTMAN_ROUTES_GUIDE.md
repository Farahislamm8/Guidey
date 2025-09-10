# 🚀 AI Career Guide API - Postman Routes Guide

## 📋 Base URL: `http://127.0.0.1:8000/api`

## 🔐 Authentication Routes

### 1. Register User
- **POST** `/api/register`
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "name": "Test User",
  "email": "test@example.com", 
  "password": "password123"
}
```

### 2. Login User
- **POST** `/api/login`
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

### 3. Logout User
- **POST** `/api/logout`
- **Headers**: `Authorization: Bearer {token}`

## 💬 Chat Messages (Protected)

### 4. Get All Messages
- **GET** `/api/chat-messages`
- **Headers**: `Authorization: Bearer {token}`

### 5. Create Message
- **POST** `/api/chat-messages`
- **Headers**: `Authorization: Bearer {token}`, `Content-Type: application/json`
- **Body**:
```json
{
  "message": "Hello, I need career advice!"
}
```

### 6. Get Message by ID
- **GET** `/api/chat-messages/{id}`
- **Headers**: `Authorization: Bearer {token}`

### 7. Update Message
- **PUT** `/api/chat-messages/{id}`
- **Headers**: `Authorization: Bearer {token}`, `Content-Type: application/json`
- **Body**:
```json
{
  "message": "Updated message content"
}
```

### 8. Delete Message
- **DELETE** `/api/chat-messages/{id}`
- **Headers**: `Authorization: Bearer {token}`

## 🧪 Testing

### 9. Test API
- **GET** `/api/test-api`
- **Response**: `"API works"`

## 🔧 Postman Setup

1. **Create Collection**: "AI Career Guide API"
2. **Add Environment Variables**:
   - `base_url`: `http://127.0.0.1:8000/api`
   - `access_token`: (empty, auto-filled after login)
3. **Use URLs**: `{{base_url}}/endpoint`

## 📱 Testing Order

1. Test API Connection
2. Register User
3. Login User (saves token)
4. Test Chat Endpoints
5. Logout

## 🚨 Notes

- All chat endpoints require valid token
- Token format: `Bearer {access_token}`
- Start Laravel server: `php artisan serve --host=127.0.0.1 --port=8000`
