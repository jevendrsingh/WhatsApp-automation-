import crypto from "crypto";

export function randomId(prefix: string) {
  return `${prefix}_${crypto.randomBytes(8).toString("hex")}`;
}

export function randomApiKey() {
  return `ac_${crypto.randomBytes(24).toString("hex")}`;
}
