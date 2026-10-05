#!/usr/bin/env node
// node encrypt.mjs <source.html> <password> [out=payload.enc.json]
// PBKDF2-SHA256 (600k) -> AES-256-GCM. Mirrored in index.html — change both or neither.
import { readFile, writeFile } from "node:fs/promises";
import { webcrypto as crypto } from "node:crypto";
const ITERATIONS = 600000;
const [, , src, password, out = "payload.enc.json"] = process.argv;
if (!src || !password) { console.error("usage: node encrypt.mjs <source.html> <password> [out]"); process.exit(1); }
const plain = await readFile(src);
const salt = crypto.getRandomValues(new Uint8Array(16));
const iv = crypto.getRandomValues(new Uint8Array(12));
const base = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveKey"]);
const key = await crypto.subtle.deriveKey({ name: "PBKDF2", salt, iterations: ITERATIONS, hash: "SHA-256" }, base, { name: "AES-GCM", length: 256 }, false, ["encrypt"]);
const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, plain);
const b64 = (b) => Buffer.from(b).toString("base64");
await writeFile(out, JSON.stringify({ v: 1, iterations: ITERATIONS, salt: b64(salt), iv: b64(iv), ct: b64(ct), builtAt: new Date().toISOString() }) + "\n");
console.log(`encrypted ${plain.length} bytes -> ${out}`);
