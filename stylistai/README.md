# StylistAI

A local Pakistani menswear prototype for planning eastern, western, and mixed
looks around a styling request and item budget in PKR.

## Getting Started

### Google sign-up and sign-in

Create a Google OAuth **Web application** client and register
`<origin>/auth/google/callback` as an authorized redirect URI. For local
testing, use the same origin in the browser and app configuration, such as
`http://localhost:3000`. Use HTTPS for a hosted origin. If the Google
consent screen is in testing mode, configure its test users in Google Cloud.

Set these server-only variables in `.env.local` for development or in the
hosting environment's secret settings.

| Variable | Example or purpose |
|---|---|
| `GOOGLE_CLIENT_ID` | OAuth Web application client ID |
| `GOOGLE_CLIENT_SECRET` | OAuth client secret |
| `STYLIST_AUTH_ORIGIN` | `http://localhost:3000` with no trailing slash |
| `STYLIST_GOOGLE_ALLOWED_EMAILS` | Comma-separated invited Google email addresses |
| `STYLIST_HOSTED_DB_FILE` | Absolute path to a persistent writable SQLite file, or `.stylist-hosted.sqlite` locally |

Open `/login` or `/signup` and choose **Continue with Google**. The first
completed sign-in creates the account and starts profile onboarding. The
Google subject identifies return visits, and only a digest of the session
token is stored. The SQLite migration is applied on first use of a fresh
database. Use a Node.js 24 host with a persistent writable volume for this
implementation. Workers/D1 integration requires a separate storage adapter.

### Local style profile

Use Node.js 24 or later and install dependencies with `npm ci`. Start the local
prototype from PowerShell:

```powershell
$env:STYLIST_LOCAL_ACCOUNT = "1"
npm run dev -- --hostname 127.0.0.1
```

Open `http://127.0.0.1:3000/profile` and select **Open local test account**.
The shared test profile and session records are stored in the ignored
`.stylist-local.sqlite` file. Use sample information. This sign-in path requires
the opt-in environment setting and is available only in development mode.

To validate and import a demonstration CSV, set `STYLIST_LOCAL_ADMIN_TOKEN` to a
private value of at least 24 characters before starting the development server.
Sign in locally and open `/catalog-admin` to see the template. Imports update by
SKU. Use an empty stock size list to remove an imported item from matching.
Imported items are displayed as samples and have no external purchase URLs.

### Styling blueprint adapter

Curated templates rank outfits by default. To try a model service you run on
your own computer, set `STYLIST_BLUEPRINT_PORT` to its loopback HTTP port in
development. The service must accept `POST /blueprint` with JSON fields
`occasion`, `category`, and `dressCode`. Return an object such as
`{"preferredColors":["ivory","navy"]}` with up to four supported palette
colors. The supported values are ivory, olive, charcoal, cream, tan, black,
blue, white, sand, navy, and brown.

The adapter makes at most one attempt per stored request, times out after two
seconds, and reads up to 2 KiB. Invalid or unavailable responses fall back to
the curated template. The blueprint only affects ranking and has no authority
over catalog items, prices, budget, size or exclusions. The prototype does
not provide or activate a model service.

### Verification

Run `npm run lint`, `npm test`, and `npm run build`. The test suite covers
budget and outfit constraints, deterministic ranking, CSV parsing, and
validation of local blueprint responses.

The optional [browser acceptance script](tests/prototype-browser.mjs) uses an
installed Chrome or compatible Chromium browser and the `playwright-core`
module. Start a **separate development server with a fresh disposable
SQLite file** for this test. The script deletes the local test account and its
data at the end.

```powershell
$env:STYLIST_LOCAL_ACCOUNT = "1"
$env:STYLIST_LOCAL_ADMIN_TOKEN = [guid]::NewGuid().ToString("N")
$env:STYLIST_LOCAL_DB_FILE = Join-Path $env:TEMP ("stylistai-acceptance-" + [guid]::NewGuid().ToString("N") + ".sqlite")
Remove-Item Env:STYLIST_BLUEPRINT_PORT -ErrorAction SilentlyContinue
npm run dev -- --hostname 127.0.0.1 --port 3131
```

In another terminal, set the same disposable administrator token, then run
`node tests/prototype-browser.mjs` with `STYLIST_ACCEPTANCE_URL` set to
`http://127.0.0.1:3131` and `BROWSER_EXECUTABLE` set to the Chrome executable.
If `playwright-core` was installed externally, set `PLAYWRIGHT_MODULE` to
its absolute package directory.

See the [prototype scope and launch dependencies](docs/prototype-scope.md)
and the [sample CSV template](docs/sample-products.csv).
