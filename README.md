# Policy Manager - Apps Script Showcase

## Project Origin

<img width="1706" height="894" alt="Screenshot 2026-03-31 at 1 00 36 PM" src="https://github.com/user-attachments/assets/797d1b61-9385-49fc-ab3f-c17e64033d65" />


Policy Manager began as an internal knowledge management system—a comprehensive, searchable portal designed to centralize policy documentation, visual guides, and multimedia resources across an organization. The original implementation used Google Apps Script as the backend runtime, with a Google Sheet as the data source, to leverage existing Google Workspace infrastructure without requiring external hosting or complex server setup.

## Evolution to Portfolio Showcase

This repository represents a **refactored, public-facing version** of that production system. The refactoring had two primary goals:

1. **Preserve the technical architecture** — The Google Apps Script backend and spreadsheet-driven data model remain intact, demonstrating the viability of this approach for real-world applications.

2. **Genericize the content and branding** — All domain-specific language, organizational references, and sensitive material have been replaced with neutral, sample content suitable for public sharing.

The result is a working portfolio project that showcases both the architectural pattern and the implementation techniques without exposing the original business logic or data.

## Security by Design

This system was built with security as a core principle:
- **Defense-in-depth validation** — User identifiers are strictly validated server-side before any API calls
- **No injection vectors** — URL construction is server-side only; static assets contain no dynamic URL generation
- **Minimal scope exposure** — Only necessary Google Workspace APIs are requested; read-only where possible
- **Error-safe responses** — Validation failures return safe errors without system details

See the [Security & Validation](#security--validation) section below for implementation details and production hardening guidance.

## Architecture & Design Decisions

### Backend (Google Apps Script / App Engine)
- **Data source**: Google Sheets as a lightweight, version-controlled database
- **Sheet structure**: Four core tabs
  - `Docs`: Maps policy document keys to Google Drive document IDs
  - `NavLabels`: Defines sidebar navigation structure and document groupings
  - `Policies`: Metadata (taglines, media references) for each policy
  - `Bullets`: Searchable highlights/key points for each policy
  - `BulletDetails`: Rich media and expanded notes linked to individual bullets

- **Runtime**: Google Apps Script (V8 engine) for secure data access and Google API integration
- **Security**: 
  - **Document ID validation**: All document keys are sanitized with regex (`/[^a-zA-Z0-9_]/g`) to reject special characters; doc IDs are validated to allow only alphanumeric characters and hyphens
  - **Input sanitization**: Prevents injection attacks by filtering user-controlled identifiers server-side before generating URLs
  - **Media type validation**: Optional validation of Drive file IDs and YouTube URLs before embedding
  - **URL generation on server**: All Google Docs/Slides/Drive preview URLs are constructed server-side, never client-side, to prevent URL manipulation
  - **Error handling**: Invalid identifiers return safe error messages without exposing system details

### Frontend (Vanilla JavaScript / CSS)
- **Framework**: No dependencies—pure HTML, CSS, and JavaScript
- **State management**: Client-side `APP_STATE` object tracks DOM readiness, metadata, navigation, search index, and viewing history
- **Media handling**: Unified abstraction for multiple media types:
  - Google Docs (embedded preview)
  - Google Slides
  - Google Drive videos
  - YouTube videos
  - Drive-hosted images
  - Audio files
  - Dual-media modals (e.g., slides + video of presenter)

- **Search**: Client-side indexing of all document titles, bullets, and section labels with instant results dropdown
- **Responsive design**: Mobile-first CSS with adaptive layouts for desktop, tablet, and phone screens

### Key Features Retained from Production

✓ **Spreadsheet-driven portal** — Non-technical users can add documents and bullets by editing a shared sheet  
✓ **Google Docs embedding** — Full policy documents load as read-only previews in the portal  
✓ **Mixed media support** — Slides, videos, and images linked directly from Google Drive or YouTube  
✓ **Full-text search** — Instant filtering across all policies, bullets, and section labels  
✓ **Modal details** — Expandable bullet points with rich media, perfect for training or reference highlights  
✓ **Recently viewed history** — Session-based quick links to recently opened policies  
✓ **Responsive interface** — Adapts from large desktop displays to mobile-sized screens  

## How to Use This Project

### Prerequisites
- A Google account
- `clasp` CLI tool installed (for deployment)
- A public Google Sheet containing your data (or the provided sample)

### Data Setup
1. Create or copy a Google Sheet with the four required tabs: `Docs`, `NavLabels`, `Policies`, `Bullets`, `BulletDetails`
2. Update `SHEET_ID` in [Code.gs](Code.gs#L5) with your sheet's ID
3. Populate the sheet with your policies, documents, and media references

### Deployment
```bash
clasp push
```

The script deploys to your Google Apps Script project and creates a web app endpoint.

### Customization
- **Styling**: Edit the CSS variables in [styles.html](styles.html) (colors, typography, layout dimensions)
- **Branding**: Update the header logo/text in [index.html](index.html)
- **Data pipeline**: Modify the data-reading functions in [Code.gs](Code.gs) if your sheet structure differs

## Technical Highlights

### Backward Compatibility
The backend method contracts (function signatures) are preserved from the original system, allowing this refactored frontend to work seamlessly with existing Apps Script deployments without requiring backend changes.

### Performance Considerations
- All metadata is loaded once on app initialization
- Search index is built client-side for instant filtering
- Media files are preloaded asynchronously to minimize load times
- Responsive design uses CSS Grid and Flexbox for efficient layouts

### Security & Validation

**This project prioritizes defense-in-depth security practices:**

- **Server-side identifier validation** — All user-supplied document keys and file IDs are validated immediately in [Code.gs](Code.gs) using strict regex patterns:
  - Document keys: `[^a-zA-Z0-9_]` (alphanumeric + underscore only)
  - Document IDs: `[^a-zA-Z0-9_\-]` (alphanumeric + hyphens + underscore only)
  - Mismatched characters are rejected with a safe error message

- **URL construction on the backend** — Google Docs/Slides/Drive preview URLs are **always** built server-side in [Code.gs](Code.gs#L336-L344), never client-side, preventing URL manipulation or injection attacks

- **No hardcoded sensitive data** — Static configuration (`SHEET_ID`) is in [Code.gs](Code.gs#L5); no secrets are embedded in HTML or JavaScript

- **Google API security** — The backend uses Google Workspace OAuth scopes with granular permissions:
  - `spreadsheets.readonly` — Read-only access to data
  - `documents` — Read access to linked policy documents
  - `drive` — File metadata and media validation only
  - `script.container.ui` — UI rendering

- **XFrame options** — The webapp sets `XFrameOptionsMode.ALLOWALL` to permit controlled embedding; adjust as needed for your deployment context

- **Error isolation** — Invalid requests return descriptive errors without leaking internal system details or file structures

### Recommended Production Hardening

- Add **user authentication** via Google Identity to restrict access to authorized users only
- Implement **audit logging** to track who accessed which policies and when
- Use **Google Workspace security features** (2FA, conditional access) for accounts managing the sheet
- Regularly audit **sheet permissions** to ensure only authorized editors can modify content
- Consider **versioning** of frequently-modified policies for compliance tracking

## Lessons & Takeaways

This project demonstrates:
1. **Google Sheets as a backend** — Effective for low-maintenance, collaborative data management
2. **Google Apps Script for glue logic** — Fast development without external infrastructure
3. **Vanilla JavaScript for UX** — Rich, responsive interfaces without framework overhead
4. **Spreadsheet-driven UX** — Non-developers can manage content through a familiar interface

## Notes

- The sample data is intentionally generic; adapt fields and content to your use case
- For production deployments, consider adding user authentication via Google Identity
- Preload video assets carefully; large files should use streaming rather than base64 encoding
- Test with real Google Workspace accounts to verify API access permissions
