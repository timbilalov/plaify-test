// Include external
// js error logger
Raven.config("https://4b8183ec9ad54b2791b63192ce1bc854@sentry.io/286501", {
    whitelistUrls: [
        /\/assets\//
    ]
}).install();