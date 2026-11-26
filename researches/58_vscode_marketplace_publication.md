# Research 58 — Visual Studio Marketplace publication for KIMI KRINIK

> **Created:** 2026-11-26 · **Parent:** owner's marketplace-feasibility request during the 1.0.0 release gate · **Status:** external recon complete; owner authorized preparation and subsequent publication after green gates on 2026-11-26 · **Outbound:** implement the KIMI KRINIK Marketplace/GitHub presentation and prepare the separate publication path

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
| Required manifest identity | `name`, `version`, `publisher`, `engines` present | technically satisfied; Marketplace uniqueness not proven |
| Storefront icon | `kimi-icon-storefront.png`, 128×128 | meets the documented minimum |
| Package integrity | build 45, six targets plus universal, all statically audited | strong local prerequisite, not Microsoft acceptance |
| Marketplace README | `apps/vscode/README.md` still starts with `# Kimi Code` and points to the official extension | must be rewritten for KIMI KRINIK before publication |
| Public SVG rule | root README uses project SVG buttons; the packaged short README currently has no embedded images | check the actual packaged README after rewriting; do not assume root content is used |
| Existing publish command | `publish:vsix` verifies target packages and uses `vsce publish --packagePath …` | reusable for target packages; requires `VSCE_PAT` |
| Universal publication | `publish-args.mjs` rejects `universal` because it normalizes only the six targets | needs a tested universal argument or a deliberate direct `vsce publish --packagePath <universal>` path |
| Existing GitHub workflow | `.github/workflows/vscode-publish.yml` is restricted to `github.repository_owner == 'MoonshotAI'`, queries `moonshot-ai.kimi-code`, and expects repository secrets | not usable for this fork as-is; create a separate owner-approved OIDC workflow |
| Privacy/support metadata | repository exists; dedicated Marketplace privacy/support presentation not prepared | resolve links and support route before publication |

## Verdict and recommendation

**Technically feasible and worth preparing.** The documented entry path is closer to a self-service package registry than to a heavily gated app-store certification: create the publisher, satisfy manifest/content rules, run `vsce` validation and publish. Policy compliance and account ownership remain real obligations, and the documentation does not guarantee acceptance.

Recommended order:

1. Finish and publish the already authorized GitHub Release 1.0.0 only after its existing gates pass.
2. Treat Marketplace publication as a separate task and a separate outward authorization.
3. Rewrite `apps/vscode/README.md` for KIMI KRINIK, finalize privacy/support links and check SVG/link constraints on the actual package.
4. Add a tested universal-publish path and prefer GitHub OIDC Trusted Publishing over a PAT. Keep the existing MoonshotAI workflow unchanged.
5. Have the owner create or select the permanent publisher identity. Perform a final dry-run and publish only after the owner's explicit `AUTH:` for Marketplace; then open and read the live Marketplace page.

No account, workflow, manifest, README or Marketplace state was changed by this recon.
