import { getStore } from "@netlify/blobs";
import { serveInvitation } from "../../lib/invitation-service.mjs";

export default async (request) => {
    try { return await serveInvitation(request, getStore({ name: "guest-invitations", consistency: "strong" })); }
    catch { return Response.json({ error: "Could not save or load the invitation. Please try again." }, { status: 503 }); }
};
export const config = { path: ["/api/invitation", "/api/invitation/*", "/i/*"] };
