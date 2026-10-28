#!/usr/bin/env node
/**
 * BlockMag Official Public MCP Server (Model Context Protocol 2024-11-05)
 *
 * Bridges local stdio MCP clients (Claude Desktop, Cursor, Windsurf, VS Code)
 * directly to the BlockMag Remote Public MCP Server (https://blockmag.com/api/mcp/public).
 *
 * Free Public Tools (Zero API Key Required):
 *  1. search_public_stores      - Discover verified E-Shop merchants by keyword, country, or city
 *  2. search_public_catalog     - Search products & EAN-13 barcodes across verified store catalogs
 *  3. get_public_store_details  - Retrieve storefront metadata, contact info, and featured items
 *  4. generate_free_invoice     - Calculate multi-VAT invoices and generate a printable A4 PDF URL
 *  5. calculate_timesheet       - Calculate billable shift hours, overtime, tax, and A4 PDF URL
 *  6. verify_invoice_qr         - Verify cryptographic invoice & receipt QR codes
 *
 * Website: https://blockmag.com
 * Merchant OS & Cloud POS: https://blockmag.com/sellers
 */

import readline from 'node:readline';

const ENDPOINT = process.env.BLOCKMAG_MCP_URL || 'https://blockmag.com/api/mcp/public';
const TOKEN = process.env.BLOCKMAG_MCP_TOKEN || '';

const rl = readline.createInterface({
    input: process.stdin,
    terminal: false,
});

async function forwardRpcMessage(line) {
    const trimmed = line.trim();
    if (!trimmed) {
        return;
    }

    let parsed;
    try {
        parsed = JSON.parse(trimmed);
    } catch {
        return;
    }

    // Notifications (no id) do not require a JSON-RPC response in stdio mode
    const isNotification = parsed && typeof parsed === 'object' && !('id' in parsed);

    try {
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'User-Agent': 'blockmag-mcp-server/1.0.0 (+https://blockmag.com)',
        };

        if (TOKEN) {
            headers['Authorization'] = `Bearer ${TOKEN}`;
        }

        const response = await fetch(ENDPOINT, {
            method: 'POST',
            headers,
            body: JSON.stringify(parsed),
        });

        if (isNotification) {
            return;
        }

        const text = await response.text();
        if (text && text.trim()) {
            process.stdout.write(text.trim() + '\n');
        }
    } catch (error) {
        if (!isNotification && parsed && 'id' in parsed) {
            const errorPayload = {
                jsonrpc: '2.0',
                id: parsed.id,
                error: {
                    code: -32603,
                    message: `Failed to reach BlockMag MCP endpoint (${ENDPOINT}): ${error.message}`,
                },
            };
            process.stdout.write(JSON.stringify(errorPayload) + '\n');
        }
    }
}

(async () => {
    for await (const line of rl) {
        await forwardRpcMessage(line);
    }
})();


