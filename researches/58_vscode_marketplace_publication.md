# Research 58 — Visual Studio Marketplace publication for KIMI KRINIK

> **Created:** 2026-11-26 · **Parent:** owner's marketplace-feasibility request during the 1.0.0 release gate · **Status:** published and publicly verified on 2026-11-27; build-62 universal VSIX available as Marketplace version 1.0.0 · **Outbound:** future-version polish of the packaged short description and Marketplace README; do not replace published version 1.0.0

## Goal vector

**Achieve.** Determine whether KIMI KRINIK can plausibly appear in the built-in VS Code extension marketplace and identify the smallest compliant publication path.

**Avoid.** An unapproved outward publication, exposed credentials, a misleading extension identity, an unsupported package shape, or a claim that Microsoft has accepted an extension before it is actually published.

## Sources read

1. [VS Code — Publishing Extensions](https://code.visualstudio.com/api/working-with-extensions/publishing-extension): publisher registration, `vsce publish`, manual VSIX upload, GitHub OIDC Trusted Publishing, PAT fallback, SVG restrictions, manifest/package presentation, platform-specific packages and publisher verification.
2. [VS Code — Extension Manifest](https://code.visualstudio.com/api/references/extension-manifest): required manifest fields, presentation fields, categories, icon and Marketplace links.
3. [Microsoft Marketplace general listing and offer policies](https://learn.microsoft.com/en-us/legal/marketplace/certification-policies), document 1.67 dated 2024-08-26: accurate title/description, value, prerequisites, localization, active support, graphics, dependencies, privacy, third-party rights, security, functionality and supporting documents.
4. Live read-only `vsce show` control: `moonshot-ai.kimi-code` returns current marketplace JSON and lists `Programming Languages`, `AI`, `Chat`, confirming that the categories already present in our manifest are used by the official extension. The same query for `mikalai-kryvusha.kimi-code-kaif` returned no listing payload (`undefined`); this is not proof that either identifier can be registered.

## What Microsoft requires

### Identity and access

- The manifest requires `name`, `version`, `publisher` and `engines.vscode`. All are already present in `apps/vscode/package.json`.
- A Marketplace publisher must be created through the publisher-management page with a Microsoft account. Publisher ID is unique and cannot be changed after creation.
- Publication is self-service through `vsce publish` or by uploading a VSIX through the publisher page. I found no documented mandatory human certification step for an ordinary unverified VS Code extension.
- The documented recommendation for GitHub Actions is Trusted Publishing with OIDC, not a stored PAT. A policy names the repository owner, repository and workflow; the job needs `id-token: write`, and `vsce publish --oidc` exchanges the GitHub token for a short-lived Marketplace credential.
- A verified-publisher badge is optional. The documented prerequisites include extensions on the Marketplace for at least six months and an eligible domain registered for at least six months; verification can include a manual review. This badge is not a prerequisite for publishing.

### Package and presentation

- The Marketplace icon must be a PNG of at least 128×128 pixels. `apps/vscode/resources/kimi-icon-storefront.png` was measured with `magick identify`: exactly 128×128.
- `README.md`, `CHANGELOG.md`, `LICENSE`, repository and support information form the public extension page. Image URLs in README/CHANGELOG must use HTTPS; SVG images are restricted to trusted providers. The manifest icon cannot be SVG.
- A package without a target platform acts as a fallback for platforms without a specific package. Our universal VSIX therefore fits the documented model. Platform-specific VSIX publication is also supported.
- `engines.vscode` controls which VS Code versions can install the extension. Ours is `^1.100.0`, matching the tested lower-bound contract.
- The extension name and display name must be unique in the Marketplace. Actual availability remains unverified until registration/publication.

### Content, legal and operational obligations

- The listing must accurately explain the distinct value, intended audience, prerequisites, limitations and dependencies. The current comparison-heavy README should not simply become the Marketplace page without a policy review; a focused product description is simpler.
- Third-party content must be owned, appropriately licensed or otherwise permitted. This project already carries Apache-2.0/MIT attribution and `apps/vscode/THIRD_PARTY_NOTICES.md`.
- The listing needs a functional privacy-policy link when applicable and must disclose account/service dependencies. KIMI KRINIK uses the configured Kimi/provider account and shared session/config state; the exact privacy/terms links need a conscious publication decision rather than invented text.
- The published extension must deliver the listed behavior, avoid unexpected executable behavior and expose no credentials. The current independent full-diff review is therefore directly relevant to Marketplace readiness.
- Active support and functional documentation are ongoing obligations, not a one-time upload property.

## Current local readiness

| Area | Observed state | Publication effect |
|---|---|---|
| Required manifest identity | `name`, `version`, `publisher`, `engines` present; version 1.0.0, build 62 | published as `mikalai-kryvusha.kimi-code-kaif` |
| Storefront icon | owner-approved pink robot, 256×256 PNG | accepted after build 61's black K icon was rejected |
| Package integrity | build 62, six targets plus universal, all statically audited; universal fresh-host smoke passed | Marketplace VSIX SHA-256 matches the GitHub universal asset |
| Marketplace README | independent KIMI KRINIK README with EN/RU/ZH, privacy, support and Known issues | publicly rendered; future-version priority polish remains |
| Public image/link rule | packaged PNG icon and HTTPS README image; privacy, support and image URLs returned HTTP 200 | technically satisfied |
| Existing publish command | verifies `universal` and supports `--oidc` through `@vscode/vsce` 4.1.1 | reusable without a stored PAT |
| Universal publication | `publish:vsix -- universal --oidc` supported and observed in GitHub Actions | successful in run 46017994560 |
| Existing GitHub workflow | `.github/workflows/vscode-marketplace-publish.yml` downloads the release asset, checks SHA-256, audits and publishes | owner-configured Trusted Publishing policy verified by the successful run |
| Privacy/support metadata | Kimi privacy link and GitHub Issues support route included | publicly rendered |

## Verdict and recommendation

**Technically feasible and worth preparing.** The documented entry path is closer to a self-service package registry than to a heavily gated app-store certification: create the publisher, satisfy manifest/content rules, run `vsce` validation and publish. Policy compliance and account ownership remain real obligations, and the documentation does not guarantee acceptance.

Recommended order:

1. Finish and publish the already authorized GitHub Release 1.0.0 only after its existing gates pass.
2. Treat Marketplace publication as a separate task and a separate outward authorization.
3. Rewrite `apps/vscode/README.md` for KIMI KRINIK, finalize privacy/support links and check SVG/link constraints on the actual package.
4. Add a tested universal-publish path and prefer GitHub OIDC Trusted Publishing over a PAT. Keep the existing MoonshotAI workflow unchanged.
5. Have the owner create or select the permanent publisher identity. Perform a final dry-run and publish only after the owner's explicit `AUTH:` for Marketplace; then open and read the live Marketplace page.

No account, workflow, manifest, README or Marketplace state was changed by this recon.

## Publication receipt — 2026-11-27 17:55 +03:00

The implementation followed the recommended GitHub OIDC route. The first run, 46016559851, authenticated and uploaded but Microsoft rejected the black K icon as too similar to an existing icon. The owner explicitly approved the existing pink robot as the KIMI KRINIK logo. Build 62 replaced all seven GitHub `v1.0.0` assets after red-first icon regression coverage, 18/18 targeted tests, lint, typecheck, package audits and a fresh VS Code 1.123.0 Extension Host smoke.

The second run, [46017994560](https://github.com/MikalaiKryvusha/KIMI-KRINIK-VSCODE-EXTENSION/actions/runs/46017994560), downloaded the build-62 universal asset, matched its SHA-256, repeated the audit and published through Trusted Publishing. The Marketplace reports version `1.0.0` and VSIX SHA-256 `5cf8731783d417d60b4ed611cc29f4d85582d4fd7e3180ba5e25b0711a51ccd8`, identical to GitHub and the local file.

The [public Marketplace item](https://marketplace.visualstudio.com/items?itemName=mikalai-kryvusha.kimi-code-kaif) returned HTTP 200 at 17:54 +03:00 and its EN/RU/ZH README and Known issues were read. A clean temporary VS Code profile then installed `mikalai-kryvusha.kimi-code-kaif` 1.0.0 by extension ID. The installed manifest reports build 62 and its icon SHA-256 matches the approved source. No PAT or Azure CLI was used.

Changing the already published short description or packaged README requires a subsequent Marketplace version. Version 1.0.0 was not overwritten after public verification.
