import "server-only";
import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
export function generateApiKey(){return `mcp_${randomBytes(24).toString("hex")}`;}
export function hashApiKey(key:string){const salt=randomBytes(16);const hash=scryptSync(key,salt,64);return `${salt.toString("hex")}:${hash.toString("hex")}`;}
export function compareApiKey(key:string,stored:string){const [saltHex,hashHex]=stored.split(":");const expected=Buffer.from(hashHex,"hex");const actual=scryptSync(key,Buffer.from(saltHex,"hex"),64);return timingSafeEqual(expected,actual);}
