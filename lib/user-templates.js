export const USER_TEMPLATES_KEY = "krushna53-user-templates-v1";
export function readUserTemplateRecords() {
    if (typeof window === "undefined")
        return [];
    try {
        const value = JSON.parse(localStorage.getItem(USER_TEMPLATES_KEY) ?? "[]");
        return Array.isArray(value) ? value.filter((item) => !!item && typeof item.id === "string" && typeof item.name === "string" && !!item.design?.palette) : [];
    }
    catch {
        return [];
    }
}
export function saveUserTemplateRecord(record) {
    if (typeof window === "undefined")
        return false;
    try {
        const normalizedName = record.name.trim().toLocaleLowerCase();
        const existing = readUserTemplateRecords().filter((item) => item.id !== record.id && !(item.event === record.event && item.name.trim().toLocaleLowerCase() === normalizedName));
        localStorage.setItem(USER_TEMPLATES_KEY, JSON.stringify([record, ...existing].slice(0, 30)));
        return true;
    }
    catch {
        return false;
    }
}
export function removeUserTemplateRecord(id) {
    if (typeof window === "undefined")
        return;
    try {
        localStorage.setItem(USER_TEMPLATES_KEY, JSON.stringify(readUserTemplateRecords().filter((item) => item.id !== id)));
    }
    catch { /* storage may be unavailable */ }
}
