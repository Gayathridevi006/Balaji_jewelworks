# Manufacturer and supplier page imports

`backend/app/scraper.py` provides a generic single-product-page adapter for manufacturer/supplier sites administered by the business. It checks robots.txt for product and image URLs, rejects non-public IP destinations and non-HTTPS URLs, follows only a few revalidated redirects, limits page/image sizes, extracts Open Graph, common HTML, and Product JSON-LD fields, and stages results for admin review. Image copying is gated by the explicit image reuse confirmation in the admin UI. Copied images are quality checked, converted to WebP, and kept unpublished.

The scraper does not crawl whole sites, evade access controls, or infer reuse rights. Confirm applicable supplier agreements and site terms before allowing image reuse. Add site-specific adapters only when the source permits the requested access and extraction.
