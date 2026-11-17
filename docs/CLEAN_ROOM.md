# Clean-room record

## Boundary

CarCare AI Field Assistant is a new, standalone contest project. Its public repository must not contain commercial source code, private service contracts, customer data, operational URLs, deployment credentials, or production Firebase/Geoapify configuration.

## What was reviewed

Before implementation, an existing private automotive platform and its project history were reviewed only to understand general engineering evidence around external providers. The reusable lessons were provider-agnostic:

- validate coordinates and provider payloads before use;
- enforce timeouts and bounded result sizes;
- fail safely when configuration is absent;
- never include keys or upstream request objects in logs;
- keep optional location assistance separate from core business actions;
- test missing configuration, malformed data, and provider failure.

No commercial implementation, domain writer, database shape, customer record, prompt, UI asset, API response, or secret was copied into this project.

## Public release gate

Before every public push:

1. Run `node scripts/verify-public-safety.mjs`.
2. Review `git diff --cached` for names, URLs, identifiers, and credentials.
3. Confirm that Firebase and Geoapify values exist only in ignored local files or hosting environment variables.
4. Confirm that every demo case is synthetic.
5. Confirm that screenshots and video show no personal account data or debug tokens.
