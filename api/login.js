let users = [];

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Метод не разрешен' });
    }
    
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    
    if (!user) {
        return res.status(401).json({ error: 'Неверный логин или пароль' });
    }
    
    const token = btoa(`${user.id}:${Date.now()}`);
    
    res.json({
        token,
        user: { id: user.id, username: user.username, name: user.name }
    });
}
