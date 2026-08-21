# Origen-Prime security and admin handoff

## Implementation status

The original production-safety implementation is merged on the repository’s `main` branch at commit `4c5a287`. The focused admin upgrade is now implemented locally and is ready for its own commit and push after validation.

The live Origen-Prime Supabase project contains the `is_active` product field, server-authoritative order pricing fields, and the `create_orders_from_cart` routine. Public clients can read active products, but cannot directly read or insert orders.

## Security and checkout changes

Customer checkout sends only product IDs, quantities, customer identity, address, and delivery zone. The server invokes `create_orders_from_cart`, which reads the active product price from Supabase, validates availability and quantity limits, calculates delivery and total values, and inserts order rows atomically. Client-provided price, delivery charge, title, and total fields are not trusted.

The cart drawer routes to `/checkout` rather than `/admin`. Product landing and catalog pages use the hardened public products API instead of direct browser database reads. Admin login requires `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET`, creates a signed eight-hour HttpOnly Secure SameSite cookie, and protects product mutations, order reads/updates/deletes, and statistics.

## Focused admin upgrade

The admin dashboard now includes two focused work areas. Product operations support multiple simultaneously published products, active/inactive publishing control, image URL and upload management through the existing product editor, product preview, pricing, and the product-level inside/outside delivery charges used by the server-side checkout RPC. Every active product is available from the all-products homepage and has its own slug-based landing page for Facebook campaigns. Order operations load protected orders, show customer and delivery information, and allow status transitions among `pending`, `confirmed`, `processing`, `shipped`, `delivered`, and `cancelled`.

A protected `/api/catalog-sync` endpoint has been added. It can trigger the Paikari Hybrid B1 sync function using a separate server-to-server secret, without exposing that secret to the browser. The Paikari sync function source has been updated to accept either its normal authenticated JWT path or the configured `x-origen-sync-secret` path.

## Verification

`npm run build` passes after the admin changes. The TypeScript/Vite production build completes successfully; the existing large-bundle warning remains a deferred P2 concern. The live Origen storefront and product route were previously verified at HTTP 200, and the public product API returns the active product.

The Paikari database currently remains reachable only when its Supabase project is active. During this admin upgrade, redeploying the updated sync function was blocked because the Paikari Supabase project is inactive and the organization has reached its free-plan active-project limit. The source change is complete, but its live deployment and secret configuration must be completed after the project is restored or the organization’s project limit is resolved.

## Required environment variables

Origen-Prime requires `SUPABASE_SERVICE_ROLE_KEY`, `VITE_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_URL`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET` with at least 32 random characters, and `PUBLIC_SITE_ORIGIN=https://origen-prime.vercel.app`.

To enable the new admin `Paikari Sync` button, configure `PAIKARI_SYNC_URL=https://mcapstuvnfyyymievjae.supabase.co/functions/v1/sync-origen-catalog` and a strong random `PAIKARI_SYNC_SECRET` in the Origen-Prime Vercel project. Configure the identical secret as `ORIGEN_SYNC_SECRET` in the Paikari Supabase Edge Function. Do not put either secret in frontend environment variables or source code.

The Paikari sync function also uses `ORIGEN_CATALOG_URL` optionally; if omitted, it defaults to `https://origen-prime.vercel.app/api/products`.

## Remaining operational steps

Restore or reactivate the Paikari Supabase project, deploy the updated `sync-origen-catalog` function, and set the matching server-side sync secret. Then configure the Origen Vercel variables and deploy the admin commit. Finally, sign in to `/admin`, create or edit two products with `is_active=true`, verify that both appear on the all-products homepage, open each slug-based landing page, verify that hiding one product removes only that product from public pages, update a delivery charge, change a test order status, and run the Paikari Sync button.

`npm run lint` still reports the repository’s pre-existing broad TypeScript/ESLint backlog. This remains deferred because the user explicitly prioritized P0 security and focused launch functionality over P2 cleanup.

## References

[1]: https://supabase.com/docs/guides/functions "Supabase Edge Functions documentation"
[2]: https://supabase.com/docs/guides/auth/redirect-urls "Supabase Auth redirect URL configuration"
