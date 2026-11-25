import "@fontsource/great-vibes/400.css";
import "@fontsource/pinyon-script/400.css";
import "@fontsource/parisienne/400.css";
import "@fontsource/cinzel/500.css";
import "@fontsource/cinzel/600.css";
import "@fontsource/marcellus/400.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/cormorant-garamond/500-italic.css";
import "@fontsource/playfair-display/500.css";
import "@fontsource/playfair-display/600.css";
import "@fontsource/playfair-display/400-italic.css";
import "@fontsource/alex-brush/400.css";
import "@fontsource/allura/400.css";
import "@fontsource/cinzel-decorative/700.css";
import "@fontsource/italiana/400.css";
import "@fontsource/yatra-one/400.css";
import "@fontsource/rozha-one/400.css";
import "@fontsource/tiro-devanagari-hindi/400.css";
import "@fontsource/amiri/400.css";
import "@fontsource/noto-sans-gurmukhi/500.css";
import "@fontsource/noto-serif-bengali/500.css";
import "./globals.css";
import SupportChat from "@/components/SupportChat";
// Absolute base for link-preview images (WhatsApp, Facebook, X). Netlify sets URL to the site's
// live address at build time; NEXT_PUBLIC_SITE_URL can override it.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.URL || "https://everymoment.in";
export const metadata = {
    metadataBase: new URL(SITE_URL),
    title: "EveryMoment Wedding — Wedding invitations & video reels",
    description: "Create and share wedding invitations and video reels with EveryMoment Wedding.",
};
export const viewport = { width: "device-width", initialScale: 1, themeColor: "#1e1b4b" };
export default function RootLayout({ children }) {
    return <html lang="en"><body>{children}<SupportChat /></body></html>;
}
