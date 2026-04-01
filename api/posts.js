import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  const sql = neon(process.env.DATABASE_URL);
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  
  try {
    if (req.method === 'GET') {
      const posts = await sql`SELECT * FROM posts ORDER BY created_at DESC`;
      return res.json(posts);
    }
    
    if (req.method === 'POST') {
      const { userId, username, userAvatar, text, mediaType, mediaUrl } = req.body;
      const [post] = await sql`
        INSERT INTO posts (user_id, username, user_avatar, text, media_type, media_url)
        VALUES (${userId}, ${username}, ${userAvatar}, ${text}, ${mediaType}, ${mediaUrl})
        RETURNING *
      `;
      return res.json(post);
    }
    
    if (req.method === 'DELETE') {
      const { id, userId } = req.body;
      await sql`DELETE FROM posts WHERE id = ${id} AND user_id = ${userId}`;
      return res.json({ success: true });
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
