export default async function handler(req, res) {
  // Разрешаем запросы с любого сайта (CORS)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Если это предварительный запрос OPTIONS - просто отвечаем OK
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Разрешаем только POST запросы
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Метод не разрешен' });
  }
  
  // Получаем данные из запроса
  const { email, password, name } = req.body;
  
  // Проверяем, что email и пароль переданы
  if (!email || !password) {
    return res.status(400).json({ error: 'Email и пароль обязательны' });
  }
  
  try {
    // Отправляем запрос в Neon Auth API
    const response = await fetch(`${process.env.NEON_API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEON_API_KEY}`
      },
      body: JSON.stringify({ 
        email: email,
        password: password,
        data: { 
          name: name || email  // если имя не указано, используем email
        }
      })
    });
    
    const data = await response.json();
    
    // Если регистрация успешна
    if (response.ok) {
      return res.status(200).json({
        success: true,
        message: 'Регистрация успешна!',
        user: {
          id: data.id,
          email: data.email,
          name: data.metadata?.name || email,
          avatar: '👤'
        }
      });
    } 
    // Если ошибка от Neon
    else {
      return res.status(400).json({ 
        error: data.message || 'Ошибка регистрации. Возможно, такой пользователь уже существует.' 
      });
    }
    
  } catch (error) {
    // Ошибка соединения или другая ошибка
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Ошибка сервера. Попробуйте позже.' });
  }
}
