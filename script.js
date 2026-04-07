// Текущий пользователь
let currentUser = null;

// Показать вкладку
function showTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.form-container').forEach(form => form.classList.remove('active'));
    
    if (tab === 'login') {
        document.querySelector('.tab-btn:first-child').classList.add('active');
        document.getElementById('login-form').classList.add('active');
    } else {
        document.querySelector('.tab-btn:last-child').classList.add('active');
        document.getElementById('register-form').classList.add('active');
    }
}

// Регистрация
async function register() {
    const username = document.getElementById('reg-username').value;
    const name = document.getElementById('reg-name').value;
    const password = document.getElementById('reg-password').value;
    
    const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, name, password })
    });
    
    const data = await res.json();
    if (data.error) {
        document.getElementById('reg-error').textContent = data.error;
    } else {
        showTab('login');
        alert('Регистрация успешна! Теперь войдите.');
    }
}

// Вход
async function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    
    const data = await res.json();
    if (data.error) {
        document.getElementById('login-error').textContent = data.error;
    } else {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.href = '/feed.html';
    }
}

// Выход
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
}

// Добавить пост
async function addPost() {
    const content = document.getElementById('post-content').value;
    const token = localStorage.getItem('token');
    
    const res = await fetch('/api/add-post', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content })
    });
    
    if (res.ok) {
        document.getElementById('post-content').value = '';
        loadPosts();
    }
}

// Загрузить посты
async function loadPosts() {
    const token = localStorage.getItem('token');
    const res = await fetch('/api/get-posts', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const posts = await res.json();
    
    const container = document.getElementById('posts-list');
    if (!container) return;
    
    container.innerHTML = posts.map(post => `
        <div class="post-card">
            <div class="post-header">
                <span>${post.username}</span>
                <span>${new Date(post.created_at).toLocaleDateString()}</span>
            </div>
            <div class="post-content">${post.content}</div>
            <div class="post-actions">
                <span>❤️ ${post.likes || 0}</span>
                <span>💬 ${post.comments || 0}</span>
            </div>
        </div>
    `).join('');
}

// Отправить сообщение
async function sendMessage() {
    const content = document.getElementById('message-input').value;
    const token = localStorage.getItem('token');
    
    const res = await fetch('/api/send-message', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ to: 'all', content })
    });
    
    if (res.ok) {
        document.getElementById('message-input').value = '';
        loadMessages();
    }
}

// Загрузить сообщения
async function loadMessages() {
    const token = localStorage.getItem('token');
    const res = await fetch('/api/get-messages', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const messages = await res.json();
    
    const container = document.getElementById('chat-messages');
    if (!container) return;
    
    container.innerHTML = messages.map(msg => `
        <div class="message">
            <strong>${msg.username}:</strong> ${msg.content}
            <small>${new Date(msg.created_at).toLocaleTimeString()}</small>
        </div>
    `).join('');
    
    container.scrollTop = container.scrollHeight;
}

// Загрузить пользователей
async function loadUsers() {
    const res = await fetch('/api/users');
    const users = await res.json();
    
    const container = document.getElementById('suggestions-list');
    if (container) {
        container.innerHTML = users.map(user => `
            <div style="padding: 0.5rem; border-bottom: 1px solid #ddd;">
                <strong>${user.username}</strong>
                <button onclick="follow('${user.username}')" style="float: right;">+</button>
            </div>
        `).join('');
    }
}

// Загрузка при открытии страниц
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    
    if (user && document.querySelector('.user-name')) {
        document.querySelector('.user-name').textContent = user.username;
    }
    
    if (window.location.pathname.includes('feed.html')) {
        loadPosts();
        loadUsers();
    }
    
    if (window.location.pathname.includes('chat.html')) {
        loadMessages();
        setInterval(loadMessages, 3000);
    }
});
