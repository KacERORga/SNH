let posts = [];

export default async function handler(req, res) {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ error: 'Не авторизован' });
    
    const { content } = req.body;
    
    posts.push({
        id: Date.now(),
        content,
        username: 'user',
        created_at: Date.now(),
        likes: 0,
        comments: 0
    });
    
    res.json({ success: true });
}
