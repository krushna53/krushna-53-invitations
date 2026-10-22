// Minimal one-page PDF writer: puts a JPEG on a page the exact shape of the card.
// No dependency, so a PDF is always a single page and never has blank sheets.
/** Build a one-page PDF containing the JPEG. Page is 6 inches wide, height follows the image. */
export function jpegToPdf(jpeg, widthPx, heightPx) {
    const enc = new TextEncoder();
    const pageW = 432; // 6 inches in PDF points
    const pageH = Math.round((pageW * heightPx) / widthPx);
    const content = `q ${pageW} 0 0 ${pageH} 0 0 cm /Im0 Do Q`;
    const parts = [];
    const offsets = [];
    let size = 0;
    const push = (chunk) => { const b = typeof chunk === "string" ? enc.encode(chunk) : chunk; parts.push(b); size += b.length; };
    const obj = (n, body) => { offsets[n] = size; push(`${n} 0 obj\n`); body(); push("\nendobj\n"); };
    push("%PDF-1.4\n%\xE2\xE3\xCF\xD3\n");
    obj(1, () => push("<< /Type /Catalog /Pages 2 0 R >>"));
    obj(2, () => push("<< /Type /Pages /Kids [3 0 R] /Count 1 >>"));
    obj(3, () => push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageW} ${pageH}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>`));
    obj(4, () => {
        push(`<< /Type /XObject /Subtype /Image /Width ${widthPx} /Height ${heightPx} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`);
        push(jpeg);
        push("\nendstream");
    });
    obj(5, () => push(`<< /Length ${content.length} >>\nstream\n${content}\nendstream`));
    const xref = size;
    push(`xref\n0 6\n0000000000 65535 f \n${[1, 2, 3, 4, 5].map((n) => `${String(offsets[n]).padStart(10, "0")} 00000 n \n`).join("")}`);
    push(`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`);
    return new Blob(parts, { type: "application/pdf" });
}
/** Turn a rendered card canvas into a one-page PDF. */
export async function canvasToPdf(canvas) {
    const blob = await new Promise((res) => canvas.toBlob(res, "image/jpeg", 0.95));
    if (!blob)
        throw new Error("Could not create the PDF");
    return jpegToPdf(new Uint8Array(await blob.arrayBuffer()), canvas.width, canvas.height);
}
