# Balaji Jewelry Works

A mobile-first jewellery catalogue and enquiry site. This is a custom-order catalogue: there are no prices, cart, checkout, payment, or customer accounts. Customers browse designs and speak directly with the goldsmith.

## Stack

- Next.js 14, TypeScript, Tailwind CSS, Lucide icons
- FastAPI, Pydantic, MongoDB (Motor), JWT admin bearer tokens
- Pillow-validated image uploads stored on a Docker volume (WebP conversion)
- Staging-first import-job API and supplier CSV validation helper

## Run locally

1. Copy `.env.example` to `.env`. Set a unique long `JWT_SECRET`, admin email and a 12+ character admin password, the WhatsApp number in international digits (no `+`), and the public site/API URLs.
2. Start Docker Desktop, then run `docker compose up --build`.
3. Visit `http://localhost:3000` and the API docs at `http://localhost:8000/docs`.
4. Sign in at `/admin`. Startup creates the initial admin only when bootstrap credentials are configured. It also initializes the standard categories and business settings.

The MongoDB data and uploaded images persist in Docker volumes. To initialize or bootstrap manually, run inside the API container: `python scripts/bootstrap_admin.py`.

## Main routes

- `/` homepage and latest designs
- `/catalogue` filters and search; `/catalogue/{slug}` shareable design page
- `/contact` contact details from the business settings API
- `/admin` catalogue creation, image upload and soft deletion
- `/admin/imports` manufacturer/supplier product-page extraction and staged review
- `/docs` interactive FastAPI API documentation

## API and data

Public routes: `GET /api/catalogue`, `/api/catalogue/featured`, `/api/catalogue/{slug}`, `/api/categories`, `/api/business`.
Admin routes cover login, catalogue CRUD, image upload/deletion, category CRUD, business settings, scrape job records, staged-import approval/deletion, and overview statistics. Admin endpoints require `Authorization: Bearer <token>`. Configure CORS with `CORS_ORIGINS`.

Design uploads accept valid JPEG, PNG, and WebP images up to 8 MB each and store normalized WebP files. Public pages return published, non-deleted designs only. Deletion is soft for catalogue records. Design codes and slugs have unique database indexes.

## Imports and content rights

The importer fetches one HTTPS manufacturer/supplier product page at a time, checks robots.txt, extracts page and Product JSON-LD details, estimates metal/category for review, and stages the result. If the admin confirms rights to reuse images, it downloads robots-permitted images, rejects low-resolution/oversized files, strips metadata through WebP conversion, and stores them in staging; otherwise it records source image URLs without copying. It never crawls site-wide, bypasses restrictions, or publishes automatically. Source-specific selectors may be added for supplier sites with unusual markup. The CSV helper validates supplier folder metadata and image paths: `python backend/scripts/import_csv.py path/to/designs.csv`. Supplier bulk transfer into MongoDB is not yet automated. Never publish third-party content before confirming reuse rights. Scraped records are not automatically published.

## Production deployment

Use a TLS reverse proxy (Caddy or Nginx) in front of the web and API containers. Set `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_API_URL`, `CORS_ORIGINS`, `NEXT_PUBLIC_WHATSAPP`, admin bootstrap credentials, and a strong `JWT_SECRET` to production values. Restrict MongoDB to the internal Docker network; do not expose port 27017. Back up MongoDB and the `uploads` volume together. For a multi-instance deployment, use S3/Cloudinary rather than local upload volumes and configure an object-store adapter before horizontal scaling.

## Current scope notes

The frontend and API are connected and the catalogue/admin design and image flows are implemented. This first increment is a runnable foundation, not every item in the extensive brief: the admin UI currently supports login, adding designs, uploading photos, listing and soft-deleting designs; edit, per-image delete, category/business management screens, automated supplier CSV ingestion, importing approved staged results directly into the catalogue, native secure-cookie sessions, and a production reverse proxy configuration remain to be completed. The API has category/business CRUD and import-review endpoints where applicable. Set real contact details in MongoDB through the authenticated business API before launch; WhatsApp has a development placeholder. Docker uses an internal API URL for server-rendered page fetches and the public URL for browser requests.


## Cloudflare Workers deployment

The Next.js app is configured for Cloudflare Workers with the OpenNext adapter. In the connected Workers Builds project, use repository root directory `/frontend`, build command `npm run cf:build`, and deploy command `npm run cf:publish`. The Wrangler worker name is `balaji-jewelworks`. Configure `NEXT_PUBLIC_API_URL` and `API_URL` in Worker Build variables to a separately hosted FastAPI backend before expecting catalogue, admin, upload, and import APIs to work. Configure `NEXT_PUBLIC_SITE_URL` to the production Worker URL and `NEXT_PUBLIC_WHATSAPP` to the business WhatsApp number. Do not set MongoDB credentials in public `NEXT_PUBLIC_` variables. The FastAPI/MongoDB backend and durable upload storage are not deployed by this Worker configuration.
