# Client Preview

A password-protected static preview hosted on GitHub Pages.

The page content is encrypted (AES-256-GCM, key derived with PBKDF2-SHA256 at 600k iterations) in `payload.enc.json`. `index.html` is a small gate that decrypts it in the browser once the right password is entered. The password is not stored in this repo.

## Rebuild

1. Put the updated page at `source.html` (gitignored, never commit it).
2. `node encrypt.mjs source.html '<password>'`
3. Commit and push `payload.enc.json`.
