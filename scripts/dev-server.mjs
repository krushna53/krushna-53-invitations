import http from "node:http";
import path from "node:path";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import next from "next";
import { serveInvitation } from "../lib/invitation-service.mjs";
import { serveAiVideo } from "../lib/ai-video-service.mjs";

const port = Number(process.env.PORT || 3000);
const app = next({ dev: true, port, hostname: "localhost" });
await app.prepare();
const handle = app.getRequestHandler();
const directory = path.resolve(".local-invitations");
const store = {
    async set(id, value) { await mkdir(directory, { recursive: true }); await writeFile(path.join(directory, `${id}.json`), value); },
    async get(id) { try { return await readFile(path.join(directory, `${id}.json`), "utf8"); } catch (error) { if (error.code === "ENOENT") return null; throw error; } },
};
const aiDirectory = path.resolve(".local-ai-video");
const aiStore = {
    async get(key) { try { return JSON.parse(await readFile(path.join(aiDirectory, `${key}.json`), "utf8")); } catch (error) { if (error.code === "ENOENT") return null; throw error; } },
    async set(key, value) { await mkdir(aiDirectory, { recursive: true }); await writeFile(path.join(aiDirectory, `${key}.json`), JSON.stringify(value)); },
    async claim(key, value) { await mkdir(aiDirectory, { recursive: true }); try { await writeFile(path.join(aiDirectory, `${key}.json`), JSON.stringify(value), { flag: "wx" }); return true; } catch (error) { if (error.code === "EEXIST") return false; throw error; } },
};
http.createServer(async (req, res) => {
    const ai = /^\/api\/ai-video\//.test(req.url);
    if (!ai && !/^\/(api\/invitation(?:\/|$)|i\/)/.test(req.url)) return handle(req, res);
    try {
        const chunks = []; let length = 0;
        for await (const chunk of req) { length += chunk.length; if (length > (ai ? 4_100_000 : 4_000_000)) { res.writeHead(413); res.end("Upload is too large"); return; } chunks.push(chunk); }
        const request = new Request(`http://${req.headers.host}${req.url}`, { method: req.method, headers: req.headers, ...(chunks.length ? { body: Buffer.concat(chunks) } : {}) });
        const response = ai ? await serveAiVideo(request, { store: aiStore, apiKey: process.env.XAI_API_KEY, accessCode: process.env.AI_VIDEO_ACCESS_CODE, allowLocalAccess: ["127.0.0.1", "::1", "::ffff:127.0.0.1"].includes(req.socket.remoteAddress) }) : await serveInvitation(request, store);
        res.writeHead(response.status, Object.fromEntries(response.headers));
        res.end(Buffer.from(await response.arrayBuffer()));
    } catch { res.writeHead(503, { "content-type": "application/json" }); res.end(JSON.stringify({ error: "Could not save or load the invitation." })); }
}).listen(port, () => console.log(`Invitation studio: http://localhost:${port}`));
