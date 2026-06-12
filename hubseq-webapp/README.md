# HubSeq Web App — Local Demo

HubSeq is a platform for managing lab sequencing data: browse your data in a
cloud bucket, attach metadata, and run bioinformatics pipelines (RNA-seq,
ChIP-seq, single-cell, …) without managing any infrastructure.

This branch is a **fully self-contained demo**. The original app depended on AWS
(Cognito for auth, API Gateway + Lambda for the backend, S3 for storage, AWS
Batch for compute) hosted behind Vercel. None of that is running anymore, so the
backend has been replaced with an **in-app mock** that runs entirely on
`localhost`. No AWS account, credentials, or network access required.

## Getting started

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. Click **Get Started** (or **Login** — there is no
real authentication in the demo) to enter the app.

## What works

- **Landing page** — the marketing site.
- **File Explorer** (`/files`) — browses a mock S3 bucket. Navigate folders,
  search, select files, upload, and download (files stream real mock contents).
- **Runs** (`/runs`) — lists pipeline runs with status; open a run for its jobs
  and result files.
- **Run a pipeline / module** — select FASTQ/data files in the explorer and
  launch a pipeline. Each module "executes" and produces output files that then
  appear in the explorer under `runs/<run-id>/...`.

## How the mock backend works

Everything that used to call AWS now calls local Next.js API routes:

| Concern | Production (old) | Demo (now) |
|---|---|---|
| Auth | AWS Cognito | [`src/utils/mock-auth.js`](src/utils/mock-auth.js) — a static demo session, no login |
| Backend API | API Gateway + Lambda | [`src/pages/api/pipeline.js`](src/pages/api/pipeline.js) → [`src/server/mock-backend.js`](src/server/mock-backend.js) |
| Storage (S3) | S3 buckets | [`src/pages/api/file.js`](src/pages/api/file.js) + an in-memory store ([`src/server/mock-store.js`](src/server/mock-store.js)) |
| Compute | AWS Batch | shell scripts in [`mock-modules/`](mock-modules/) invoked by the mock backend |

The frontend data layer ([`src/utils/aws-session.js`](src/utils/aws-session.js)
and the `*-api-call.js` helpers) kept its original function signatures, so only
the transport changed — the UI is untouched.

Mock state (uploaded files, new pipeline runs) lives for the lifetime of the dev
server process. Restart `npm run dev` to reset to the seed data.

### Mock pipeline modules

Each pipeline module (fastqc, bwa/rnastar, deseq2, david_go, …) is mocked by
[`mock-modules/run-module.sh`](mock-modules/run-module.sh), which takes a module
name + input + output and emits a small mock result. The backend captures that
output as a virtual S3 object, so pipeline outputs are browsable in the explorer.

## Tests

```bash
npm test
```

- `tests/mock-backend.test.js` — backend: S3 listing, tables, metadata, and
  running modules/pipelines (Node environment).
- `tests/file-list-results.test.js` — the File Explorer table renders mock data.
- `tests/mock-auth.test.js` — the demo session shim.

## Notable fix

The app previously rendered a **blank white screen**. Root cause: `_app.js`
wrapped the whole tree in `LocalizationProvider` imported from `@mui/lab`, whose
installed version is a deprecation stub that renders `null` — silently swallowing
the entire application. No date pickers were used, so it was removed.
