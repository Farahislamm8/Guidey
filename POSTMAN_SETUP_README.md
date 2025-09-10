# 🚀 AI Career Guide API - Postman Collection Setup

## 📋 Overview
This Postman collection provides comprehensive testing for all API endpoints in the AI Career Guide system, including authentication, chat messages, and system testing.

## 📁 Files Included
- `AI_Career_Guide_API.postman_collection.json` - Main Postman collection
- `AI_Career_Guide_Environment.postman_environment.json` - Environment variables
- `POSTMAN_SETUP_README.md` - This setup guide

## 🛠️ Setup Instructions

### 1. Import Collection
1. Open Postman
2. Click **Import** button
3. Drag and drop `AI_Career_Guide_API.postman_collection.json` or click to browse and select the file
4. Click **Import**

### 2. Import Environment
1. In Postman, click **Import** again
2. Select `AI_Career_Guide_Environment.postman_environment.json`
3. Click **Import**
4. Select the imported environment from the environment dropdown (top-right corner)

### 3. Start Backend Server
```bash
cd top-web
php artisan serve --host=127.0.0.1 --port=8000
```

## 🔐 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/register` | Register new user |
| `POST` | `/api/login` | User login |
| `POST` | `/api/logout` | User logout |

### Chat Messages (Protected Routes)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/chat-messages` | Get all chat messages |
| `POST` | `/api/chat-messages` | Create new chat message |
| `GET` | `/api/chat-messages/{id}` | Get specific message |
| `PUT` | `/api/chat-messages/{id}` | Update message |
| `DELETE` | `/api/chat-messages/{id}` | Delete message |

### Testing
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/test-api` | Test API connection |

## 🧪 Testing Workflow

### Step 1: Test API Connection
1. Select **"Test API Connection"** request
2. Click **Send**
3. Expected response: `"API works"`

### Step 2: Register User
1. Select **"Register User"** request
2. Click **Send**
3. Check response for success (201 status)

### Step 3: Login User
1. Select **"Login User"** request
2. Click **Send**
3. **Important**: The access token will be automatically saved to environment variables
4. Check response for `access_token` and `user` data

### Step 4: Test Protected Endpoints
1. **Create Chat Message**: Send a message to test chat functionality
2. **Get All Messages**: Retrieve all chat messages
3. **Update Message**: Modify an existing message
4. **Delete Message**: Remove a message

### Step 5: Logout
1. Select **"Logout User"** request
2. Click **Send**
3. Token will be invalidated

## 🔧 Environment Variables

The collection automatically manages these variables:

- `{{base_url}}` - API base URL (http://127.0.0.1:8000)
- `{{access_token}}` - Bearer token (auto-filled after login)
- `{{user_id}}` - Current user ID (auto-filled after login)

## 📝 Request Examples

### Register User
```json
{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
}
```

### Login User
```json
{
    "email": "test@example.com",
    "password": "password123"
}
```

### Create Chat Message
```json
{
    "message": "Hello, I need career advice!"
}
```

### Update Chat Message
```json
{
    "message": "Updated message content"
}
```

## 🚨 Common Issues & Solutions

### Issue: "Connection refused"
**Solution**: Ensure Laravel server is running on port 8000

### Issue: "Unauthorized" (401)
**Solution**: 
1. Check if you're logged in
2. Verify access token is set in environment
3. Try logging in again

### Issue: "Validation failed"
**Solution**: Check request body format and required fields

### Issue: "Token not found"
**Solution**: 
1. Login again to get new token
2. Check if token is properly saved in environment

## 🔍 Response Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Server Error

## 📱 Testing Mobile/Web Frontend

After testing the API endpoints, you can test the full system:

1. **Frontend**: http://localhost:3000 (React app)
2. **Backend**: http://127.0.0.1:8000 (Laravel API)
3. **Database**: Ensure MySQL is running in XAMPP

## 🎯 Next Steps

1. ✅ Test all API endpoints
2. ✅ Verify authentication flow
3. ✅ Test chat functionality
4. ✅ Integrate with frontend
5. ✅ Test full user journey

## 📞 Support

If you encounter issues:
1. Check server logs in Laravel
2. Verify database connection
3. Check XAMPP services (Apache + MySQL)
4. Review Postman console for detailed error messages

---

**Happy Testing! 🚀**
