# StylistAI Local Prototype Scope

The working baseline is a Pakistani menswear prototype in English and PKR.
It runs on Node.js 24 with Next.js App Router and SQLite. The shared local
test account requires development mode and explicit opt-in. Configured
Google accounts use a separate database and an invite list.

| Requirement | Prototype coverage |
|---|---|
| FR-001–007 | Google sign-up and sign-in for invited accounts, development test sign-in, profile and measurements, timezone-aware age, and account deletion. Live Google credentials and hosted storage still require configuration. |
| FR-009–014 | Profile-prefilled requests, PKR budget, review, request-only constraints, daily quota, and duplicate submission protection. |
| FR-017–024 | Curated styling template and optional local blueprint adapter. Deterministic complete outfit matching enforces the subtotal, dress code, regional delivery, stock and sizes. |
| FR-025 | Persisted saves and ratings, removal, and constraint-aware swaps with cheaper options when available. |
| FR-027 onward | Sample catalog, token-protected CSV preview and transactional upsert, unavailable stock handling, import logs, and local aggregate counts. Partner and live commerce workflows depend on approved catalogs. |
| Request history | Authenticated paginated request history and shopper dashboard. Recommendations reopen against the current sample catalog. Saved looks store their original item and price snapshots. |

## Storage and interfaces

The server owns the SQLite connection. It stores hashed expiring local
session tokens, one shared test profile and its optional measurements,
styling requests, blueprint claims and results, saved looks, ratings,
imported sample SKUs, and import audit entries. Request-owned records cascade
on deletion. The server checks a session before private reads and writes and
requires the configured local administrator token for CSV writes and catalog
activity reads.

Forms use validated Next.js server actions. The optional localhost blueprint
interface is documented in the README. The matcher is a pure TypeScript
function. It assembles a set or upper and lower garments with footwear, then
applies deterministic scoring using occasion, colors, category coherence, and
optional palette hints. Every purchasable product and retailer permission is
a future catalog concern. Local fixtures contain no purchase destinations.

## Launch dependencies

- An approved retailer and its authorized product CSV, image and shopping URLs,
  inventory/size and delivery data, and a named catalog refresh owner.
- An app-owned Google OAuth Web client and a persistent-volume Node.js host,
  or a storage adapter for the selected host. Recheck commercial terms and
  cost controls before selecting services.
- Approved operating entity, jurisdiction, age eligibility, privacy policy,
  terms, retention, and public-pilot access policy.
- Approved retailer link destinations and the policy for aggregate outbound
  click reporting. Live affiliate attribution requires an applicable agreement.

The optional model integration can be evaluated independently. Curated
templates remain available when the model port is unset or the service fails.
