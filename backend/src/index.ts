import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from 'node:path';
import { BggApiError, isBggConfigured } from './services/bgg-client';
import { getBggDetails } from './services/bgg-details';
import {
    BggSearchPendingError,
    getBggCollection,
    searchBggGames,
    type BggSearchResponse,
} from "./services/bgg.service";

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const PORT = process.env.PORT || 3000;

export function createApp() {
    const app = express();

    app.use(cors());
    app.use(express.json());

    app.get('/api/bgg/status', (_req, res) => {
        res.json({ configured: isBggConfigured() });
    });
    app.get('/api/bgg/games/:id', async (req, res) => {
        const raw = req.params.id;
        if (!/^[1-9]\d{0,8}$/.test(raw)) { res.status(400).json({ error: 'Identifiant BGG invalide.' }); return; }
        try { res.json(await getBggDetails(Number(raw))); }
        catch (error) {
            if (error instanceof BggApiError) { res.status(error.status).json({ error: error.message, code: error.code }); return; }
            res.status(502).json({ error: 'La fiche BoardGameGeek est temporairement indisponible.' });
        }
    });

    app.get("/api/health", (_req, res) => {
        res.json({
            status: "ok",
            service: "reeple-backend",
        });
    });

    app.get("/api/games", (_req, res) => {
        res.json([
            {
                id: 1,
                title: "Azul",
                players: "2–4",
                duration: 45,
                age: 8,
            },
            {
                id: 2,
                title: "7 Wonders",
                players: "3–7",
                duration: 30,
                age: 10,
            },
        ]);
    });

    app.get("/api/bgg/search", async (req, res) => {
        const query = typeof req.query.query === "string" ? req.query.query.trim() : "";

        if (!query) {
            res.status(400).json({ error: "Le paramètre query est requis." });
            return;
        }

        if (query.length > 150) { res.status(400).json({ error: 'La recherche est limitée à 150 caractères.' }); return; }

        try {
            const games = await searchBggGames(query);
            const result: BggSearchResponse = {
                query,
                total: games.length,
                games,
            };

            res.json(result);
        } catch (error) {
            if (error instanceof BggApiError) { res.status(error.status).json({ error: error.message, code: error.code }); return; }
            if (error instanceof BggSearchPendingError) {
                res.status(503).json({ error: error.message });
                return;
            }

            res.status(502).json({
                error: "La recherche BoardGameGeek est temporairement indisponible.",
            });
        }
    });

    app.get("/api/bgg/collection/:username", async (req, res) => {
        const { username } = req.params;

        if (!username.trim()) {
            res.status(400).json({
                error: "Un pseudo BoardGameGeek est requis.",
            });
            return;
        }

        try {
            const games = await getBggCollection(username);

            res.json({
                username,
                total: games.length,
                games,
            });
        } catch (error) {
            if (error instanceof BggApiError) { res.status(error.status).json({ error: error.message, code: error.code }); return; }
            const message =
                error instanceof Error
                    ? error.message
                    : "Erreur inconnue lors de la récupération de la collection.";

            res.status(502).json({ error: message });
        }
    });

    return app;
}

if (require.main === module) {
    createApp().listen(Number(PORT), '127.0.0.1', () => {
        console.log(`Reeple backend running on http://localhost:${PORT}`);
    });
}
