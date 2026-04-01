export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Метод не разрешен' });
  }
  
  const { email, password, name } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email и пароль обязательны' });
  }
  
  try {
    const response = await fetch(`${process.env.NEON_API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEON_API_KEY}`
      },
      body: JSON.stringify({ 
        email, 
        password,
        data: { name: name || email }
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      return res.status(200).json({
        success: true,
        user: {
          id: data.id,
          email: data.email,
          name: data.metadata?.name || email,
          avatar: '👤'
        }
      });
    } else {
      return res.status(400).json({ 
        error: data.message || 'Ошибка регистрации. Возможно, такой пользователь уже существует.' 
      });
    }
    
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Ошибка сервера. Попробуйте позже.' });
  }
}
