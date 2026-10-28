# BlockMag Official Public MCP Server (`2024-11-05`)

[![MCP Protocol](https://img.shields.io/badge/MCP-2024--11--05-06b6d4?style=flat-square)](https://blockmag.com/.well-known/mcp.json)
[![Free Public Tier](https://img.shields.io/badge/Authentication-None%20(Free%20Public%20Tools)-10b981?style=flat-square)](https://blockmag.com/api/mcp/public)
[![Platform](https://img.shields.io/badge/Platform-BlockMag.com-6366f1?style=flat-square)](https://blockmag.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

Official **Model Context Protocol (MCP)** server for **[BlockMag.com](https://blockmag.com)** — the global multi-tenant business operating platform uniting A4 invoicing, multi-warehouse inventory, automated bank reconciliation, freelancer timesheets, biometric staff attendance, and 0%-commission E-Shop & In-Store Scan & Go commerce.

This repository provides **instant, zero-authentication access** to BlockMag's **6 free public AI tools** over both **Remote MCP (Streamable HTTP & SSE)** and **Local Stdio Bridge** for Claude Desktop, Cursor, Windsurf, VS Code, ChatGPT, and custom AI agents.

---

## 🌐 Live Endpoints & Discovery Manifests

| Resource | Canonical Production URL | Auth Required |
|---|---|---|
| **Public Remote MCP Endpoint (SSE + HTTP POST)** | `https://blockmag.com/api/mcp/public` | **None (100% Free)** |
| **MCP Discovery Manifest** | `https://blockmag.com/.well-known/mcp.json` | None |
| **OpenAPI 3.1 Schema (ChatGPT Actions)** | `https://blockmag.com/api/v1/openai/public-schema.json` | None |
| **LLM Documentation Index** | `https://blockmag.com/llms.txt` / `https://blockmag.com/llms-full.txt` | None |
| **Free Online A4 Invoice Generator** | [https://blockmag.com/tools/invoice-generator](https://blockmag.com/tools/invoice-generator) | None |
| **Free Timesheet & Overtime Calculator** | [https://blockmag.com/tools/timesheet-calculator](https://blockmag.com/tools/timesheet-calculator) | None |
| **Merchant Cloud POS & E-Shop OS** | [https://blockmag.com/sellers](https://blockmag.com/sellers) | Free Plan Available |

---

## 🛠️ Included Free Public MCP Tools (Zero API Key Required)

### 1. `search_public_stores`
Searches verified public E-Shop storefronts and merchants on [BlockMag Marketplace](https://blockmag.com) by store name, industry keyword, country, or city.
- **Parameters**:
  - `query` *(string, optional)*: Store name, industry keyword, or city.
  - `country` *(string, optional)*: Country filter (e.g., `"United Kingdom"`, `"United States"`, `"Romania"`).
  - `limit` *(integer, optional, default `15`)*: Maximum number of stores to return.

### 2. `search_public_catalog`
Searches live products and shelf barcodes (`EAN-13` / `UPC`) across verified public store catalogs on BlockMag, with optional store subdomain and maximum price filters.
- **Parameters**:
  - `query` *(string, required)*: Product name, EAN-13 barcode, or keyword.
  - `subdomain` *(string, optional)*: Filter within a specific merchant (`{subdomain}.blockmag.com`).
  - `max_price` *(number, optional)*: Maximum unit price filter.
  - `limit` *(integer, optional, default `20`)*: Maximum number of products to return.

### 3. `get_public_store_details`
Retrieves public storefront details, contact information, currency, and featured catalog items for a specific BlockMag store subdomain.
- **Parameters**:
  - `subdomain` *(string, required)*: Store subdomain (e.g. `"freshbakery"` for `https://freshbakery.blockmag.com`).

### 4. `generate_free_invoice`
Stateless public calculation engine: computes multi-VAT invoice totals (`Net`, `VAT`, `Gross` across global VAT rates `0%–27%`) and generates a direct printable **A4 PDF preview URL** via [BlockMag Free Invoice Generator](https://blockmag.com/tools/invoice-generator).
- **Parameters**:
  - `currency` *(string, default `"EUR"`)*: ISO currency code (`GBP`, `USD`, `EUR`, `RON`, `CHF`, etc.).
  - `invoice_number` *(string, optional)*: Document series and number (e.g. `"INV-2026-001"`).
  - `issuer` *(object, required)*: `{ name, tax_id, address }`
  - `client` *(object, required)*: `{ name, tax_id, address }`
  - `items` *(array, required)*: Array of `{ description, quantity, unit_price, vat_percent }`

### 5. `calculate_timesheet`
Stateless public calculation engine: calculates freelancer/contractor billable shift hours, hourly rates, tax deductions, and returns a direct printable **A4 Timesheet PDF preview URL** via [BlockMag Free Timesheet Calculator](https://blockmag.com/tools/timesheet-calculator).
- **Parameters**:
  - `contractor_name` *(string, required)*
  - `client_name` *(string, optional)*
  - `hourly_rate` *(number, required)*
  - `currency` *(string, default `"EUR"`)*
  - `tax_rate` *(number, default `0`)*
  - `entries` *(array, required)*: Array of `{ date, hours, task_description }`

### 6. `verify_invoice_qr`
Validates a cryptographic BlockMag invoice verification hash or B2B partner Goods Reception QR code.
- **Parameters**:
  - `verification_code` *(string, required)*: Verification hash or QR token from a BlockMag document.

---

## ⚡ Quick Start Configuration

### Option A: Direct Remote MCP Connection (Recommended — Zero Install)
For MCP clients that support remote SSE or Streamable HTTP servers (Cursor, Windsurf, Claude Desktop Remote MCP, Antigravity):

```json
{
  "mcpServers": {
    "blockmag-public": {
      "url": "https://blockmag.com/api/mcp/public"
    }
  }
}
```

### Option B: Local Node.js Stdio Bridge (Zero Dependencies, Node >= 18)
For MCP clients configured via `command` / `stdio`:

```bash
git clone https://github.com/AddrianC/blockmag-mcp-server.git
cd blockmag-mcp-server
```

Add to your `claude_desktop_config.json` or `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "blockmag-public": {
      "command": "node",
      "args": ["/absolute/path/to/blockmag-mcp-server/index.mjs"]
    }
  }
}
```

---

## 🔐 Optional: Authenticated Tenant Hands-Free ERP Mode (24 Additional Tools)

Active merchants on [BlockMag.com/sellers](https://blockmag.com/sellers) can generate a Sanctum MCP Token from **Billing → MCP & AI Autonomous** to unlock 24 voice-first operational tools on `https://blockmag.com/api/mcp/tenant` (issuing live invoices, recording payments, autonomous VAT expense categorization, stock & warehouse reception notes, BOM manufacturing recipes, and staff attendance).

---

## 🔗 Official Links
- **Marketplace & In-Store Scan & Go**: [https://blockmag.com](https://blockmag.com)
- **Merchant Cloud POS, Invoicing & ERP**: [https://blockmag.com/sellers](https://blockmag.com/sellers)
- **Technology Radar & AI Architecture**: [https://blockmag.com/tech-radar](https://blockmag.com/tech-radar)
- **Free Online Invoice Generator**: [https://blockmag.com/tools/invoice-generator](https://blockmag.com/tools/invoice-generator)
- **Free Timesheet & Hours Calculator**: [https://blockmag.com/tools/timesheet-calculator](https://blockmag.com/tools/timesheet-calculator)

