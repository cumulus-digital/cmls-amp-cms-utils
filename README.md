# Cumulus Scripts for AMP FSE Sites

A collection of front-end scripts which handle custom advertising, analytics, and added functionality specific to AMP CMS FSE websites. At this time, the built code is served from github via the jsdelivr.net CDN using Google Tag Manager.

# Development

This project is entirely javascript, using npm to install dependencies and webpack to compile the distribution code.

## First steps

```
git clone https://github.com/cumulus-digital/cmls-amp-cms-utils
cd cmls-amp-cms-utils
npm install
```

## Development server

`npm start` will launch a local http server at `http://localhost:3000` serving the contents of the `dist` folder.

Be aware the deve server will allow communication from ANYWHERE. This helps with interception and redirection of the live scripts on a production site. The Chrome extension [Requestly](https://chrome.google.com/webstore/detail/requestly-open-source-htt/mdnleldcmiljblolnjhpnblkcekpdkpa) is useful for testing local changes on the fly by intercepting the live script includes from the CDN and redirecting them to the local node server.

# Deployment

`npm run build` will compile all scripts into the `dist` dir.

# Upgrading

`npm run full-upgrade`