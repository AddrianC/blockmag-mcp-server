#!/usr/bin/env node
/**
 * BlockMag Official Dual-Tier MCP Server Bridge (Model Context Protocol 2024-11-05) — v2.0.0
 *
 * Bridges local stdio MCP clients (Claude Desktop, Cursor, Windsurf, VS Code, Docker, Smithery, Glama)
 * directly to the BlockMag Remote MCP Server:
 *   - Tier 1 (Default / Zero Auth): https://blockmag.com/api/mcp/public  (6 Free Public Tools)
 *   - Tier 2 (When Token Provided): https://blockmag.com/api/mcp/tenant  (25 Tenant Hands-Free ERP Tools)
 *
 * Configuration (Environment Variables or CLI Flags):
 *   - BLOCKMAG_MCP_TOKEN / --token=<SANCTUM_TOKEN> : Optional Sanctum MCP token for Tier 2 Tenant ERP mode
 *   - BLOCKMAG_MCP_URL   / --url=<ENDPOINT_URL>    : Optional explicit endpoint override
 *   - BLOCKMAG_MCP_TIMEOUT_MS                      : Request timeout in milliseconds (default: 30000)
 *
 * Website: https://blockmag.com
 * Merchant OS & Cloud POS: https://blockmag.com/sellers
 * AI & MCP Architecture: https://blockmag.com/tech-radar
 */

import readline from 'node:readline';

const VERSION = '2.0.0';
const PUBLIC_ENDPOINT = 'https://blockmag.com/api/mcp/public';
const TENANT_ENDPOINT = 'https://blockmag.com/api/mcp/tenant';

let cliToken = '';
let cliUrl = '';

for (const arg of process.argv.slice(2)) {
    if (arg === '--version' || arg === '-v') {
        process.stdout.write(`blockmag-mcp-server v${VERSION}\n`);
        process.exit(0);
    }
    if (arg === '--help' || arg === '-h') {
        process.stdout.write(
            [
                `BlockMag Official Dual-Tier MCP Server Bridge v${VERSION} (Protocol 2024-11-05)`,
                '',
                'Usage:',
                '  blockmag-mcp-server [--token=<SANCTUM_MCP_TOKEN>] [--url=<ENDPOINT_URL>]',
                '',
                'Environment Variables:',
                '  BLOCKMAG_MCP_TOKEN       Optional Sanctum token (switches automatically to Tier 2 Tenant ERP mode)',
                '  BLOCKMAG_MCP_URL         Optional explicit Remote MCP endpoint override',
                '  BLOCKMAG_MCP_TIMEOUT_MS  HTTP request timeout in ms (default: 30000)',
                '',
                `Default Public Endpoint (6 Free Tools):  ${PUBLIC_ENDPOINT}`,
                `Authenticated Tenant Endpoint (25 Tools): ${TENANT_ENDPOINT}`,
                '',
            ].join('\n')
        );
        process.exit(0);
    }
    if (arg.startsWith('--token=')) {
        cliToken = arg.slice('--token='.length).trim();
    } else if (arg.startsWith('--url=')) {
        cliUrl = arg.slice('--url='.length).trim();
    }
}

const TOKEN = (cliToken || process.env.BLOCKMAG_MCP_TOKEN || '').trim();
const EXPLICIT_URL = (cliUrl || process.env.BLOCKMAG_MCP_URL || '').trim();
const ENDPOINT = EXPLICIT_URL || (TOKEN ? TENANT_ENDPOINT : PUBLIC_ENDPOINT);
const TIMEOUT_MS = Math.max(3000, Number.parseInt(process.env.BLOCKMAG_MCP_TIMEOUT_MS || '30000', 10) || 30000);

const rl = readline.createInterface({
    input: process.stdin,
    terminal: false,
});

function writeJsonRpcError(id, code, message) {
    const errorPayload = {
        jsonrpc: '2.0',
        id: id ?? null,
        error: {
            code,
            message,
        },
    };
    process.stdout.write(JSON.stringify(errorPayload) + '\n');
}

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

    // JSON-RPC notifications (no "id" property) do not expect a response on stdout
    const isNotification = Boolean(parsed && typeof parsed === 'object' && !Array.isArray(parsed) && !('id' in parsed));

    try {
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'User-Agent': `blockmag-mcp-server/${VERSION} (+https://blockmag.com)`,
        };

        if (TOKEN) {
            headers['Authorization'] = `Bearer ${TOKEN}`;
        }

        const signal = typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function'
            ? AbortSignal.timeout(TIMEOUT_MS)
            : undefined;

        const response = await fetch(ENDPOINT, {
            method: 'POST',
            headers,
            body: JSON.stringify(parsed),
            signal,
        });

        if (isNotification) {
            return;
        }

        const rawText = (await response.text()).trim();
        if (!rawText) {
            if (!response.ok) {
                writeJsonRpcError(parsed.id, -32000, `BlockMag MCP HTTP ${response.status} (${response.statusText || 'Error'}) from ${ENDPOINT}`);
            }
            return;
        }

        try {
            const jsonResp = JSON.parse(rawText);
            if (jsonResp && (jsonResp.jsonrpc === '2.0' || Array.isArray(jsonResp))) {
                process.stdout.write(JSON.stringify(jsonResp) + '\n');
                return;
            }
            const errDetail = jsonResp && (jsonResp.error || jsonResp.message)
                ? (typeof jsonResp.error === 'string' ? jsonResp.error : JSON.stringify(jsonResp.error || jsonResp.message))
                : `HTTP ${response.status}`;
            writeJsonRpcError(parsed.id, response.status === 401 ? -32001 : -32000, `BlockMag MCP error (${response.status}): ${errDetail}`);
        } catch {
            writeJsonRpcError(parsed.id, -32603, `Unexpected non-JSON response (HTTP ${response.status}) from ${ENDPOINT}`);
        }
    } catch (error) {
        if (!isNotification && parsed && typeof parsed === 'object' && 'id' in parsed) {
            const reason = error && error.message ? error.message : String(error);
            writeJsonRpcError(parsed.id, -32603, `Failed to reach BlockMag MCP endpoint (${ENDPOINT}): ${reason}`);
        }
    }
}

(async () => {
    for await (const line of rl) {
        await forwardRpcMessage(line);
    }
})();
