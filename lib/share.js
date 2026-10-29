const toB64Url = (bytes) => {
    let s = "";
    for (let i = 0; i < bytes.length; i += 0x8000)
        s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
    return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};
const fromB64Url = (s) => Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0));
async function pipe(bytes, stream) {
    const out = new Blob([bytes]).stream().pipeThrough(stream);
    return new Uint8Array(await new Response(out).arrayBuffer());
}
export async function publishInvitation(payload, image) {
    const response = await fetch("/api/invitation", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ payload, image }) });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.url) throw new Error(result.error || "Guest links need the invitation server. Start the site with npm run dev, or use the deployed site.");
    return result.url;
}
export function invitationPoster(source) {
    const canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = Math.round(source.height * 600 / source.width);
    canvas.getContext("2d").drawImage(source, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.82);
}
export async function encodeShare(payload) {
    const raw = new TextEncoder().encode(JSON.stringify(payload));
    if (typeof CompressionStream !== "undefined")
        return "z" + toB64Url(await pipe(raw, new CompressionStream("deflate-raw")));
    return "j" + toB64Url(raw);
}
export async function decodeShare(token) {
    try {
        const kind = token[0];
        let bytes = fromB64Url(token.slice(1));
        if (kind === "z")
            bytes = await pipe(bytes, new DecompressionStream("deflate-raw"));
        const parsed = JSON.parse(new TextDecoder().decode(bytes));
        return parsed?.v === 2 && parsed.design && parsed.details ? parsed : null;
    }
    catch {
        return null;
    }
}
/** Store an image on the site (Netlify Blobs) so the guest link stays short. Returns null when unavailable. */
export async function uploadImage(dataUrl) {
    try {
        const blob = await (await fetch(dataUrl)).blob();
        const res = await fetch("/api/scene", { method: "POST", headers: { "content-type": blob.type }, body: blob });
        if (!res.ok)
            return null;
        const { url } = (await res.json());
        return url;
    }
    catch {
        return null;
    }
}
/** Downscale an image file in the browser and return a JPEG data URL. */
export async function fileToDataUrl(file, maxW, maxH, quality = 0.82) {
    const isHeic = /\.(heic|heif)$/i.test(file.name) || /image\/(heic|heif)/i.test(file.type);
    let source = file;
    if (isHeic) {
        const heic2any = (await import("heic2any")).default;
        const converted = await heic2any({ blob: file, toType: "image/jpeg", quality });
        source = Array.isArray(converted) ? converted[0] : converted;
    }
    const url = URL.createObjectURL(source);
    try {
        const img = new Image();
        img.src = url;
        await img.decode();
        const s = Math.min(1, maxW / img.naturalWidth, maxH / img.naturalHeight);
        const c = document.createElement("canvas");
        c.width = Math.round(img.naturalWidth * s);
        c.height = Math.round(img.naturalHeight * s);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        return c.toDataURL("image/jpeg", quality);
    }
    finally {
        URL.revokeObjectURL(url);
    }
}
