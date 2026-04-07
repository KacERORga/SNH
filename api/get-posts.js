let posts = [];

export default async function handler(req, res) {
    res.json(posts.sort((a,b) => b.created_at - a.created_at));
}
