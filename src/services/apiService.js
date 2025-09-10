const API_BASE = 'http://127.0.0.1:8000/api';

export async function registerUser(data) {
 
  return { user: { name: data.name || data.username, email: data.email } }
}

export async function loginUser(data) {
  
  return { user: { name: data.email.split('@')[0], email: data.email } }
}


export async function chatApi(data, token) {
  const response = await fetch(`${API_BASE}/chat-messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Send message failed');
  }
  return response.json();
}


export async function getChatMessages(token) {
  const response = await fetch(`${API_BASE}/chat-messages`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Fetch messages failed');
  }
  return response.json();
}
