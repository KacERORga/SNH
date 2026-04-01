export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  
  const { email, password } = req.body;
  
  const response = await fetch(`${process.env.NEON_API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.NEON_API_KEY}`
    },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  
  if (response.ok) {
    return res.json({
      success: true,
      token: data.token,
      user: { id: data.user.id, email: data.user.email, name: data.user.metadata?.name, avatar: '👤' }
    });
  }
  return res.status(401).json({ error: 'Invalid email or password' });
}
