import type { InviteDesign } from "./invite-design";
import type { Wording } from "./designs";

export const USER_TEMPLATES_KEY = "krushna53-user-templates-v1";

export type UserTemplateRecord = {
  id: string;
  name: string;
  event: InviteDesign["event"];
  design: InviteDesign;
  wording: Wording;
  savedAt: number;
};

export function readUserTemplateRecords(): UserTemplateRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const value = JSON.parse(localStorage.getItem(USER_TEMPLATES_KEY) ?? "[]") as unknown;
    return Array.isArray(value) ? value.filter((item): item is UserTemplateRecord => !!item && typeof item.id === "string" && typeof item.name === "string" && !!item.design?.palette) : [];
  } catch {
    return [];
  }
}

export function saveUserTemplateRecord(record: UserTemplateRecord) {
  if (typeof window === "undefined") return false;
  try {
    const existing = readUserTemplateRecords().filter((item) => item.id !== record.id);
    localStorage.setItem(USER_TEMPLATES_KEY, JSON.stringify([record, ...existing].slice(0, 30)));
    return true;
  } catch {
    return false;
  }
}

export function removeUserTemplateRecord(id: string) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(USER_TEMPLATES_KEY, JSON.stringify(readUserTemplateRecords().filter((item) => item.id !== id))); } catch { /* storage may be unavailable */ }
}
