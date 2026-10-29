import http from "node:http";
import path from "node:path";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import next from "next";
import { serveInvitation } from "../lib/invitation-service.mjs";

const port = Number(process.env.PORT || 3000);
const app = next({ dev: true, port, hostname: "localhost" });
await app.prepare();
const handle = app.getRequestHandler();
const directory = path.resolve(".local-invitations");
const store = {
    async set(id, value) { await mkdir(directory, { recursive: true }); await writeFile(path.join(directory, `${id}.json`), value); },
    async get(id) { try { return await readFile(path.join(directory, `${id}.json`), "utf8"); } catch (error) { if (error.code === "ENOENT") return null; throw error; } },
};
http.createServer(async (req, res) => {
    if (!/^\/(api\/invitation(?:\/|$)|i\/)/.test(req.url)) return handle(req, res);
    try {
        const chunks = []; let length = 0;
        for await (const chunk of req) { length += chunk.length; if (length > 4_000_000) { res.writeHead(413); res.end("Invitation is too large"); return; } chunks.push(chunk); }
        const request = new Request(`http://${req.headers.host}${req.url}`, { method: req.method, headers: req.headers, ...(chunks.length ? { body: Buffer.concat(chunks) } : {}) });
        const response = await serveInvitation(request, store);
        res.writeHead(response.status, Object.fromEntries(response.headers));
        res.end(Buffer.from(await response.arrayBuffer()));
    } catch { res.writeHead(503, { "content-type": "application/json" }); res.end(JSON.stringify({ error: "Could not save or load the invitation." })); }
}).listen(port, () => console.log(`Invitation studio: http://localhost:${port}`));
