let messages = [];

export default async function handler(req, res) {
    const { content } = req.body;
    
    messages.push({
        id: Date.now(),
        content,
        username: 'user',
        created_at: Date.now()
    });
    
    res.json({ success: true });
}
