export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  
  const { email, password, name } = req.body;
  
  const response = await fetch(`${process.env.NEON_API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.NEON_API_KEY}`
    },
    body: JSON.stringify({ email, password, data: { name } })
  });
  
  const data = await response.json();
  if (response.ok) return res.json({ success: true, user: data });
  return res.status(400).json({ error: data.message });
}
