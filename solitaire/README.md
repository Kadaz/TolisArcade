# Classic Solitaire

A classic Klondike solitaire game built as a static website with HTML, CSS, and JavaScript. It has no external dependencies and can be hosted from any static web server.

## Run locally

Open `index.html` directly in a browser.

To serve it locally like a static website:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## How it works

- `index.html` defines the board: stock, waste, four foundations, seven tableau columns, and the win dialog.
- `styles.css` draws the table and cards with stable responsive sizing.
- `game.js` contains the Klondike rules: shuffle, deal, draw, validate moves, flip cards, undo moves, move to foundations, and detect wins.
- `assets/card-back.svg` is the local card-back artwork. No third-party assets are loaded.

The game state lives in browser memory. There are no accounts, forms, cookies, databases, or network requests.

## License

MIT License. See `LICENSE` for details.

## Secure static hosting

Because this is a static website, serve only these files from a directory that is not writable by public users.

Example Nginx configuration:

```nginx
server {
    listen 443 ssl http2;
    server_name example.com;
    root /var/www/classic-solitaire;
    index index.html;

    add_header Content-Security-Policy "default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'; object-src 'none'" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=()" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

Tips:

- Use HTTPS with automatically renewed certificates.
- Do not mix this site with admin panels or private routes.
- Avoid third-party scripts unless you control and review them, and update the CSP accordingly.
- Serve the files with an unprivileged user from a clean deployment directory.
- Keeping the project backend-free greatly reduces the attack surface.
