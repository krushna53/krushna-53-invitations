// Set the business number in international format, including country code.
const number = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919987982969").replace(/\D/g, "");
export const WHATSAPP_MESSAGE = "Hi Krushna Web Works! I'd like help setting up an invitation for my event.";
export const WHATSAPP_URL = `https://wa.me/${number}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
