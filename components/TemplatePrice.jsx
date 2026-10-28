import { templatePrice } from "@/lib/plans";
export default function TemplatePrice({ template, reel = false }) {
    const { tier, amount } = templatePrice(template, reel);
    return <span className="template-price"><span className="template-tier">{tier}</span><span>Starting from <strong>₹{amount.toLocaleString("en-IN")}</strong></span></span>;
}
