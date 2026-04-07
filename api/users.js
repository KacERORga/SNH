let users = [];

export default async function handler(req, res) {
    res.json(users.map(u => ({ username: u.username, name: u.name })));
}
