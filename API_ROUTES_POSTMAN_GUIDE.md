# 🚀 AI Career Guide API - Complete Routes & Form Data Guide

## 📋 Base URL
```
http://127.0.0.1:8000/api
```

## 🔐 Authentication Routes

### 1. User Registration
- **Method**: `POST`
- **Endpoint**: `/api/register`
- **Headers**:
  ```
  Content-Type: application/json
  Accept: application/json
  ```
- **Body (JSON)**:
  ```json
  {
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }
  ```
- **Response**: `201 Created`
- **Notes**: Creates new user account and returns access token

### 2. User Login
- **Method**: `POST`
- **Endpoint**: `/api/login`
- **Headers**:
  ```
  Content-Type: application/json
  Accept: application/json
  ```
- **Body (JSON)**:
  ```json
  {
    "email": "test@example.com",
    "password": "password123"
  }
  ```
- **Response**: `200 OK`
- **Notes**: Returns access token and user data

### 3. User Logout
- **Method**: `POST`
- **Endpoint**: `/api/logout`
- **Headers**:
  ```
  Authorization: Bearer {access_token}
  Accept: application/json
  ```
- **Body**: None
- **Response**: `200 OK`
- **Notes**: Requires authentication, invalidates token

## 💬 Chat Messages Routes (Protected)

### 4. Get All Chat Messages
- **Method**: `GET`
- **Endpoint**: `/api/chat-messages`
- **Headers**:
  ```
  Authorization: Bearer {access_token}
  Accept: application/json
  ```
- **Body**: None
- **Response**: `200 OK`
- **Notes**: Returns all messages for authenticated user

### 5. Create Chat Message
- **Method**: `POST`
- **Endpoint**: `/api/chat-messages`
- **Headers**:
  ```
  Authorization: Bearer {access_token}
  Content-Type: application/json
  Accept: application/json
  ```
- **Body (JSON)**:
  ```json
  {
    "message": "Hello, I need career advice!"
  }
  ```
- **Response**: `201 Created`
- **Notes**: Creates new message for authenticated user

### 6. Get Specific Chat Message
- **Method**: `GET`
- **Endpoint**: `/api/chat-messages/{id}`
- **Headers**:
  ```
  Authorization: Bearer {access_token}
  Accept: application/json
  ```
- **Body**: None
- **Response**: `200 OK`
- **Notes**: Returns specific message by ID

### 7. Update Chat Message
- **Method**: `PUT`
- **Endpoint**: `/api/chat-messages/{id}`
- **Headers**:
  ```
  Authorization: Bearer {access_token}
  Content-Type: application/json
  Accept: application/json
  ```
- **Body (JSON)**:
  ```json
  {
    "message": "Updated message content"
  }
  ```
- **Response**: `200 OK`
- **Notes**: Only message owner can update

### 8. Delete Chat Message
- **Method**: `DELETE`
- **Endpoint**: `/api/chat-messages/{id}`
- **Headers**:
  ```
  Authorization: Bearer {access_token}
  Accept: application/json
  ```
- **Body**: None
- **Response**: `200 OK`
- **Notes**: Only message owner can delete

## 🧪 Testing Routes

### 9. Test API Connection
- **Method**: `GET`
- **Endpoint**: `/api/test-api`
- **Headers**:
  ```
  Accept: application/json
  ```
- **Body**: None
- **Response**: `200 OK`
- **Notes**: Public endpoint to test API connectivity

## 📱 Postman Collection Setup

### Step 1: Create Collection
1. Open Postman
2. Click "New" → "Collection"
3. Name: "AI Career Guide API"

### Step 2: Add Environment Variables
Create environment with these variables:
```
base_url: http://127.0.0.1:8000/api
access_token: (leave empty, will be auto-filled)
user_id: (leave empty, will be auto-filled)
```

### Step 3: Add Requests

#### Authentication Folder
1. **Register User**
   - Method: POST
   - URL: `{{base_url}}/register`
   - Body: Raw JSON (see above)

2. **Login User**
   - Method: POST
   - URL: `{{base_url}}/login`
   - Body: Raw JSON (see above)

3. **Logout User**
   - Method: POST
   - URL: `{{base_url}}/logout`
   - Headers: Authorization Bearer {{access_token}}

#### Chat Messages Folder
1. **Get All Messages**
   - Method: GET
   - URL: `{{base_url}}/chat-messages`
   - Headers: Authorization Bearer {{access_token}}

2. **Create Message**
   - Method: POST
   - URL: `{{base_url}}/chat-messages`
   - Headers: Authorization Bearer {{access_token}}
   - Body: Raw JSON (see above)

3. **Get Message by ID**
   - Method: GET
   - URL: `{{base_url}}/chat-messages/1`
   - Headers: Authorization Bearer {{access_token}}

4. **Update Message**
   - Method: PUT
   - URL: `{{base_url}}/chat-messages/1`
   - Headers: Authorization Bearer {{access_token}}
   - Body: Raw JSON (see above)

5. **Delete Message**
   - Method: DELETE
   - URL: `{{base_url}}/chat-messages/1`
   - Headers: Authorization Bearer {{access_token}}

#### Testing Folder
1. **Test API**
   - Method: GET
   - URL: `{{base_url}}/test-api`

## 🔧 Testing Workflow

### 1. Test Connection
- Send "Test API" request
- Expected: `"API works"`

### 2. Register User
- Send "Register User" request
- Expected: `201 Created` with token

### 3. Login User
- Send "Login User" request
- **Important**: Token auto-saves to environment

### 4. Test Protected Endpoints
- Create, read, update, delete chat messages
- All require valid access token

### 5. Logout
- Send "Logout" request
- Token becomes invalid

## 🚨 Common Issues

### Authentication Errors (401)
- Check if token is valid
- Verify Authorization header format
- Try logging in again

### Validation Errors (422)
- Check required fields
- Verify data types
- Ensure email format is valid

### Not Found (404)
- Verify endpoint URL
- Check if Laravel server is running
- Ensure route exists in `api.php`

## 📊 Response Examples

### Successful Registration
```json
{
  "access_token": "1|abc123...",
  "token_type": "Bearer",
  "user": {
    "id": 1,
    "name": "Test User",
    "email": "test@example.com",
    "created_at": "2024-01-01T00:00:00.000000Z",
    "updated_at": "2024-01-01T00:00:00.000000Z"
  }
}
```

### Successful Login
```json
{
  "access_token": "1|abc123...",
  "token_type": "Bearer",
  "user": {
    "id": 1,
    "name": "Test User",
    "email": "test@example.com"
  }
}
```

### Chat Message Response
```json
{
  "id": 1,
  "user_id": 1,
  "message": "Hello, I need career advice!",
  "created_at": "2024-01-01T00:00:00.000000Z",
  "updated_at": "2024-01-01T00:00:00.000000Z"
}
```

## 🎯 Next Steps

1. ✅ Import this guide into Postman
2. ✅ Create environment variables
3. ✅ Test all endpoints
4. ✅ Integrate with Flutter app
5. ✅ Test full user journey

---

**Happy API Testing! 🚀**
