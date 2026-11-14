# BlockMag Official Dual-Tier MCP Server (`v2.0.0` • Protocol `2024-11-05`)

[![MCP Protocol](https://img.shields.io/badge/MCP-2024--11--05-06b6d4?style=flat-square)](https://blockmag.com/.well-known/mcp.json)
[![Version](https://img.shields.io/badge/Version-2.0.0-38bdf8?style=flat-square)](https://github.com/AddrianC/blockmag-mcp-server)
[![Tier 1 Public](https://img.shields.io/badge/Tier%201-6%20Free%20Public%20Tools%20(Zero%20Auth)-10b981?style=flat-square)](https://blockmag.com/api/mcp/public)
[![Tier 2 Tenant ERP](https://img.shields.io/badge/Tier%202-25%20Hands--Free%20ERP%20Tools-6366f1?style=flat-square)](https://blockmag.com/sellers)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

Official **Model Context Protocol (MCP `2024-11-05`)** server for **[BlockMag.com](https://blockmag.com)** — the global multi-tenant business operating platform uniting A4 invoicing, double-entry accounting & P&L, smart bank & autonomous VAT expense reconciliation, multi-warehouse inventory, BOM manufacturing recipes, Goods Reception Notes (GRN), freelancer timesheets, biometric staff attendance, and 0%-commission E-Shop & In-Store Mobile Scan & Go commerce.

BlockMag's MCP architecture is cleanly separated into **two isolated tiers (`31 Official Tools` total)** over **Streamable HTTP, Server-Sent Events (SSE), and Local Stdio Bridge**:

1. **Tier 1 — Platform Public MCP (`6 Free Tools`, Zero Authentication)**: Instant discovery across verified global E-Shop storefronts, EAN-13/UPC product catalogs, stateless A4 multi-VAT invoice & freelancer timesheet/overtime calculators, and cryptographic QR document verification.
2. **Tier 2 — Tenant Hands-Free Voice & Operations MCP (`25 Authenticated Tools` with Dynamic Module Fractionation)**: Dedicated multi-tenant ERP & accounting execution with strict per-tenant isolation (`userID`), conversational `voice_summary` responses optimized for hands-free driving, and automatic tool filtering based on the workspace's enabled modules.

---

## 🌐 Canonical Production Endpoints & AI Discovery

| Resource | Canonical Production URL | Authentication |
|---|---|---|
| **MCP Discovery Manifest** | `https://blockmag.com/.well-known/mcp.json` | None |
| **Tier 1 — Platform Public MCP (HTTP POST + SSE)** | `https://blockmag.com/api/mcp/public` | **None (100% Free)** |
| **Tier 2 — Tenant Hands-Free MCP (HTTP POST + SSE)** | `https://blockmag.com/api/mcp/tenant?token={SANCTUM_TOKEN}` | Sanctum Token (`Bearer` or `?token=`) |
| **Unified SSE / Auto-Tier Stream** | `https://blockmag.com/api/mcp/sse?token={SANCTUM_TOKEN}` | Optional (`public` without token, `tenant` with token) |
| **JSON-RPC 2.0 Session Message Endpoint** | `https://blockmag.com/api/mcp/message?sessionId={SESSION_ID}` | Session / Sanctum Token |
| **OpenAPI 3.0 Schema — Public Tools (ChatGPT Actions)** | `https://blockmag.com/api/v1/openai/public-schema.json` | None |
| **OpenAPI 3.0 Schema — Tenant Hands-Free Voice ERP** | `https://blockmag.com/api/v1/openai/schema.json?token={SANCTUM_TOKEN}` | Pre-authenticated via `?token=` |
| **LLM Documentation Index (`llmstxt.org`)** | [https://blockmag.com/llms.txt](https://blockmag.com/llms.txt) / [https://blockmag.com/llms-full.txt](https://blockmag.com/llms-full.txt) | None |
| **Free Online A4 Invoice Generator** | [https://blockmag.com/tools/invoice-generator](https://blockmag.com/tools/invoice-generator) | None |
| **Free Timesheet & Overtime Calculator** | [https://blockmag.com/tools/timesheet-calculator](https://blockmag.com/tools/timesheet-calculator) | None |

---

## ⚡ Quick Start Configuration

### 1. Direct Remote MCP (Recommended — Zero Local Install)

#### Tier 1: Free Public Mode (Claude Desktop, Cursor, Windsurf, Antigravity)
```json
{
  "mcpServers": {
    "blockmag-public": {
      "url": "https://blockmag.com/api/mcp/public"
    }
  }
}
```

#### Tier 2: Authenticated Tenant Hands-Free ERP Mode
Generate your scoped token (`mcp:access`) inside your BlockMag workspace under **Sales & Billing → AI & MCP Integration**:

```json
{
  "mcpServers": {
    "blockmag": {
      "url": "https://blockmag.com/api/mcp/tenant?token=YOUR_SANCTUM_MCP_TOKEN"
    }
  }
}
```
*(For Windsurf `~/.codeium/windsurf/mcp_config.json`, use `"serverUrl"` instead of `"url"`, pointing to `https://blockmag.com/api/mcp/sse?token=YOUR_SANCTUM_MCP_TOKEN`.)*

---

### 2. ChatGPT Custom MCP Connector & Voice Mode Actions

- **ChatGPT Custom MCP Server**:
  1. In ChatGPT **Connect MCP Server**, paste `https://blockmag.com/api/mcp/tenant?token=YOUR_SANCTUM_MCP_TOKEN` (or `https://blockmag.com/api/mcp/public` for free public tools) into **Server URL**.
  2. Set **Authentication** to **`No authentication`** *(ChatGPT defaults to OAuth discovery otherwise; your scoped Sanctum token is carried securely in the `?token=` query parameter)*.
- **ChatGPT Custom GPT Actions (Hands-Free Driving Voice Mode)**:
  - Import schema from URL: `https://blockmag.com/api/v1/openai/schema.json?token=YOUR_SANCTUM_MCP_TOKEN` (set Authentication to `None`). Every tool response includes a concise `voice_summary` field tailored for spoken audio playback while driving.

---

### 3. Local Node.js Stdio Bridge (`index.mjs` — Zero Dependencies, Node >= 18)

```bash
git clone https://github.com/AddrianC/blockmag-mcp-server.git
cd blockmag-mcp-server
```

#### Public Tier (Zero Auth — connects automatically to `https://blockmag.com/api/mcp/public`):
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

#### Authenticated Tenant ERP Tier (automatically switches to `https://blockmag.com/api/mcp/tenant` when `BLOCKMAG_MCP_TOKEN` or `--token=` is set):
```json
{
  "mcpServers": {
    "blockmag-tenant": {
      "command": "node",
      "args": ["/absolute/path/to/blockmag-mcp-server/index.mjs"],
      "env": {
        "BLOCKMAG_MCP_TOKEN": "YOUR_SANCTUM_MCP_TOKEN"
      }
    }
  }
}
```

#### Docker Container (Stdio):
```bash
docker build -t blockmag-mcp-server .
docker run -i --rm -e BLOCKMAG_MCP_TOKEN="YOUR_SANCTUM_MCP_TOKEN" blockmag-mcp-server
```

---

## 🛠️ Complete Tool Reference (`31 Official Tools`)

### 🌐 Tier 1: Platform Public Tools (`6 Tools` — Free, Zero API Key)

Exposed on `https://blockmag.com/api/mcp/public`.

| # | Tool Name | Description & Key Parameters |
|---|---|---|
| 1 | `search_public_stores` | Searches verified public E-Shop storefronts on [BlockMag Marketplace](https://blockmag.com/buyers) by `query` (name, industry, city), `country`, and `limit` (default `15`), returning canonical `https://{subdomain}.blockmag.com` URLs, currency, and active product counts. |
| 2 | `search_public_catalog` | Searches live products and shelf barcodes (`EAN-13` / `UPC`) across verified public store catalogs with `query` *(required)*, optional `subdomain`, `max_price`, and `limit` (default `20`). |
| 3 | `get_public_store_details` | Retrieves public storefront metadata, contact links, currency, and featured catalog products for a given `subdomain` *(required)*. |
| 4 | `generate_free_invoice` | Stateless calculation engine: computes multi-VAT invoice totals (`Net`, `VAT`, `Gross` across global VAT rates `0%–27%`) for `issuer`, `client`, `items`, `currency`, and `invoice_number`, returning a printable **A4 PDF preview URL** on [Free Invoice Generator](https://blockmag.com/tools/invoice-generator). |
| 5 | `calculate_timesheet` | Stateless calculation engine: computes contractor/freelancer billable shift hours, hourly rates, tax deductions (`contractor_name`, `hourly_rate`, `entries`, `currency`, `tax_rate`), and returns a printable **A4 Timesheet PDF URL** on [Free Timesheet Calculator](https://blockmag.com/tools/timesheet-calculator). |
| 6 | `verify_invoice_qr` | Validates a cryptographic BlockMag invoice verification hash or B2B partner Goods Reception QR code (`verification_code`). |

---

### 🔒 Tier 2: Tenant Hands-Free Voice & ERP Tools (`25 Tools` — Dynamic Module Fractionation)

Exposed on `https://blockmag.com/api/mcp/tenant?token=...` (and `/api/mcp/sse?token=...`).
When authenticated, **public stateless tools are intentionally excluded** so voice assistants never confuse free demo calculators with live tenant ledger operations, and tools are **dynamically fractionated** according to the tenant's active Workspace Modules (`Core 15/15` + optional `Inventory 5/5`, `Purchases 1/1`, `Timesheets 1/1`, `HR 1/1`, `E-Shop 2/2`).

#### A. Core • Invoicing, Banking, Autonomous Expenses & P&L (`15 Tools` — Always Active)

| # | Tool Name | Description |
|---|---|---|
| 1 | `tenant_get_profile` | Fetches the authenticated tenant's company profile, currency, VAT registration status, tax settings, and active workspace modules. |
| 2 | `tenant_get_financial_summary` | Retrieves consolidated P&L profit, sales revenue, operating expenses (excluding tax liability settlements), and unpaid customer receivables for `last_month`, `current_month`, `last_30_days`, `year_to_date`, or `YYYY-MM`. |
| 3 | `tenant_list_invoices` | Lists recent tenant sales invoices with customer details, currency, due dates, remaining balances, and status filter. |
| 4 | `tenant_create_invoice` | Atomically creates a real sales invoice inside `DB::transaction` with customer lookup/creation, catalog price resolution, multi-VAT calculation, and automatic bank reconciliation check. |
| 5 | `tenant_mark_invoice_paid` | Records full or partial payment by `invoice_id`, `invoice_number`, or `customer_name`, automatically issuing the official payment receipt and updating ledger balances. |
| 6 | `tenant_send_invoice_email` | Dispatches an official sales invoice email with its printable A4 document link to the customer or an override `recipient_email`. |
| 7 | `tenant_search_customers` | Searches the tenant's B2B/B2C customer directory (`query`, `only_with_debt`) with real-time unpaid receivable balances. |
| 8 | `tenant_create_quick_expense` | Records an instant operating expense, supplier receipt, or unit-rate deductible allowance (`units_quantity * unit_price`, e.g. mileage `0.55/mile` or overnight subsistence `26.20/night` with `route_notes`) directly into P&L and the A4 Expense Justification Statement. |
| 9 | `tenant_get_unreconciled_expenses` | Lists all pending unreconciled card purchases, bank debits (`EXPENSE`), and incoming refunds or card cashback credits (`REFUND`), alongside available operating categories and VAT status. |
| 10 | `tenant_get_expense_history` | Searches paginated history of allocated expenses and refunds across all categories with filters for `amount`, `min_amount`, `max_amount`, `date`, `start_date`/`end_date`, `category`, `beneficiary`, `keyword`, and `type`, returning Net/VAT splits and matched rules. |
| 11 | `tenant_smart_categorize_expenses` | Runs autonomous semantic merchant categorization with automatic deductible VAT splitting, auto-creation of missing groups/rules, and **Zero-Blind-Guessing** (`unresolved_questions` with `suggested_options` for ambiguous transactions). |
| 12 | `tenant_list_expense_categories` | Lists all operating expense groups (`EXPENSE`) and cashback/rebate groups (`INCOME`), preset unit tariffs (`unit_price`, `unit_name`, `default_notes`), `total_units_logged`, printable A4 `statement_url`, and active keyword matching rules. |
| 13 | `tenant_create_expense_category` | Creates or updates an `EXPENSE` or `INCOME` (cashback) category, configures optional unit-rate tariffs and default justification notes, and optionally attaches an initial keyword rule. |
| 14 | `tenant_create_expense_rule` | Creates an automated keyword matching rule (`contains`, `exact`, `starts_with`) with direct numerical `vat_rate` (`0–100%`), optional unit-rate breakdown, `auto_approve`, and retroactive matching across pending items. |
| 15 | `tenant_reconcile_expense` | Reconciles a single transaction or batch (`allocations` array) into an existing or new category, reassigns already-allocated expenses between groups, computes deductible VAT & unit breakdowns, and learns permanent matching rules. |

#### B. Inventory, Multi-Warehouse Stock & BOM Manufacturing (`5 Tools` — Module: `inventory`)

| # | Tool Name | Description |
|---|---|---|
| 16 | `tenant_search_products` | Searches private warehouse inventory by `query` (name, SKU, barcode) or `low_stock_only`, returning live stock, purchase cost, and selling price. |
| 17 | `tenant_update_product_stock` | Adjusts (`stock_delta`) or sets (`exact_stock`) warehouse stock and/or updates `buy_price` and `selling_price` (auto-creating the product if needed). |
| 18 | `tenant_calculate_production_bom` | Simulates raw material requirements for a `target_quantity` batch of a `recipe` (BOM), identifying warehouse shortages and bottleneck producible units. |
| 19 | `tenant_ai_suggest_recipe_bom` | Generates a Bill of Materials (BOM) recipe (supporting diameter scaling via `diameter_cm` or `diameter_inch`), saves missing raw materials, checks live warehouse stock for `target_production_qty`, and outputs an exact shortage shopping list. |
| 20 | `tenant_create_recipe_bom` | Registers a custom manufacturing `Recipe` (BOM) with `ingredients` (`quantity`, `unit`, `scrap_rate`, `estimated_unit_cost`) and computes batch stock deficits. |

#### C. Purchases & Goods Reception (`1 Tool` — Module: `purchases`)

| # | Tool Name | Description |
|---|---|---|
| 21 | `tenant_procure_recipe_shortages` | Analyzes raw material shortages for `batch_quantity` of a `recipe` and automatically drafts a supplier Purchase Order (PO) for the missing quantities. |

#### D. Freelancer Projects & Time Tracking (`1 Tool` — Module: `timesheets`)

| # | Tool Name | Description |
|---|---|---|
| 22 | `tenant_log_timesheet_and_mileage` | Logs billable regular `hours`, `overtime_hours`, and/or driving `distance_km` (`mileage_rate`) against a client `project_name`. |

#### E. HR & Staff Biometrics (`1 Tool` — Module: `hr`)

| # | Tool Name | Description |
|---|---|---|
| 23 | `tenant_get_staff_attendance` | Returns real-time staff clock-in status and total shift hours logged for `date` (defaults to today). |

#### F. E-Shop, Storefront & Smart POS (`2 Tools` — Module: `eshop`)

| # | Tool Name | Description |
|---|---|---|
| 24 | `tenant_list_eshop_orders` | Lists incoming E-Shop and In-Store Scan & Go customer orders filtered by `status` (`pending`, `processing`, `confirmed`, `dispatched`, `shipped`, `completed`, `cancelled`, `refunded`). |
| 25 | `tenant_update_eshop_order_status` | Updates order fulfillment `status`, `carrier_name`, and `tracking_number`, atomically releasing or reallocating reserved warehouse stock when cancelled/refunded or reactivated. |

---

## 💼 Canonical BlockMag Workspace Plans

- **Freelancer (`$0 / forever`)**: Unlimited A4 invoicing, quotes, customer CRM, freelancer timesheets, and public tools.
- **Standard Workspace (`$29 / month`)**: All 6 Core Modules (Invoicing & P&L, Multi-Warehouse Inventory & BOM, Purchases & Autonomous Expenses, Timesheets, HR & Staff Biometrics, 0%-Commission E-Shop & Scan & Go POS) + Tenant Hands-Free MCP Server.
- **Enterprise Hub (`$79 / month`)**: Everything in Standard + Multi-Tenant Workspace Switcher (up to 3 independent company workspaces), External Accountant Portal & REST API Gateway, and priority operations.

---

## 🔗 Official Platform Links

- **Global Marketplace & Scan & Go**: [https://blockmag.com](https://blockmag.com) / [https://blockmag.com/buyers](https://blockmag.com/buyers)
- **Merchant Onboarding & Pricing**: [https://blockmag.com/sellers](https://blockmag.com/sellers)
- **Technology Radar & AI/MCP Architecture**: [https://blockmag.com/tech-radar](https://blockmag.com/tech-radar)
- **External Accountant Gateway**: [https://blockmag.com/accountant](https://blockmag.com/accountant)
- **Free Online A4 Invoice Generator**: [https://blockmag.com/tools/invoice-generator](https://blockmag.com/tools/invoice-generator)
- **Free Timesheet & Overtime Calculator**: [https://blockmag.com/tools/timesheet-calculator](https://blockmag.com/tools/timesheet-calculator)
- **Capabilities**:
  - [Invoicing, Accounting & Reports](https://blockmag.com/modules/invoicing-accounting)
  - [Inventory & Multi-Warehouse Stock](https://blockmag.com/modules/inventory-warehouses)
  - [Purchases & Goods Reception (GRN)](https://blockmag.com/modules/purchases-goods-reception)
  - [Freelancer Projects & Time Tracking](https://blockmag.com/modules/freelancer-projects)
  - [HR & Biometric Staff Management](https://blockmag.com/modules/hr-staff-management)
  - [E-Shop, Storefront & Smart POS](https://blockmag.com/modules/eshop-storefront-pos)

## 📄 License

Released under the [MIT License](LICENSE). © BlockMag LTD.
