# Scraping adapters

A source adapter may only be added after confirming that the source allows automated access and reuse of images. Keep source-specific extraction in separate modules and preserve the original URL and rights evidence. Respect robots.txt, terms, and rate limits. Never bypass login, bot controls, or network restrictions. Stage metadata and rights state; do not publish automatically. The current API accepts only public HTTPS source URLs and creates a queued job record; it deliberately does not fetch content until a reviewed adapter exists.
