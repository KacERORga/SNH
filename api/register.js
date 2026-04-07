let users = [];

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Метод не разрешен' });
    }
    
    const { username, name, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ error: 'Заполните все поля' });
    }
    
    if (users.find(u => u.username === username)) {
        return res.status(400).json({ error: 'Пользователь уже существует' });
    }
    
    const newUser = {
        id: Date.now(),
        username,
        name: name || username,
        password,
        followers: [],
        following: []
    };
    
    users.push(newUser);
    res.json({ success: true });
}
