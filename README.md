# 21st Birthday Card

A mobile-first, maroon birthday card with animated lilies, a cake built in SVG, microphone blow detection, and a photo gallery.

## Run it

Microphone access normally requires a secure context. For local development, run a small server from this folder:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000` on the same device/browser. For a phone on the same Wi-Fi, use your computer's LAN IP (for example `http://192.168.x.x:8000`) and make sure the firewall allows the port. For production, deploy over HTTPS.

## Add her photos

Put the supplied images in `assets/` as:

- `photo-1.jpg`
- `photo-2.jpg`
- `photo-3.jpg`

You can use PNG/WebP too by changing the filenames in `index.html`.

## Microphone interaction

The site uses the Web Audio API locally in the browser. It measures microphone amplitude rather than recording or uploading audio. A fallback button is included in case the browser denies microphone access or the phone's browser does not expose the mic.
