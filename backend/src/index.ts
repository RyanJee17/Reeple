import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
    res.json({
        status: 'ok',
        service: 'reeple-backend',
    });
});

app.get('/api/games', (_req, res) => {
    res.json([
        {
            id: 1,
            title: 'Azul',
            players: '2–4',
            duration: 45,
            age: 8,
        },
        {
            id: 2,
            title: '7 Wonders',
            players: '3–7',
            duration: 30,
            age: 10,
        },
    ]);
});

app.listen(PORT, () => {
    console.log(`Reeple backend running on http://localhost:${PORT}`);
});
