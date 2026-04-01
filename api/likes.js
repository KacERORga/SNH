import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  const sql = neon(process.env.DATABASE_URL);
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  
  try {
    const { postId, userId } = req.body;
    
    const [post] = await sql`SELECT likes, liked_by FROM posts WHERE id = ${postId}`;
    const isLiked = post.liked_by?.includes(userId);
    const newLikes = isLiked ? post.likes - 1 : post.likes + 1;
    const newLikedBy = isLiked 
      ? post.liked_by.filter(id => id !== userId)
      : [...(post.liked_by || []), userId];
    
    const [updated] = await sql`
      UPDATE posts SET likes = ${newLikes}, liked_by = ${newLikedBy}::text[]
      WHERE id = ${postId} RETURNING *
    `;
    
    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
