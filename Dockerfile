FROM node:22-alpine

LABEL org.opencontainers.image.title="BlockMag Official Dual-Tier MCP Server"
LABEL org.opencontainers.image.version="2.0.0"
LABEL org.opencontainers.image.description="Official BlockMag Model Context Protocol (MCP 2024-11-05) Server — 6 Free Zero-Auth Public Tools + 25 Authenticated Tenant Hands-Free Voice ERP, Autonomous Expense & Smart POS Tools"
LABEL org.opencontainers.image.url="https://blockmag.com/tech-radar"
LABEL org.opencontainers.image.source="https://github.com/AddrianC/blockmag-mcp-server"
LABEL org.opencontainers.image.licenses="MIT"

WORKDIR /app

COPY package.json ./
COPY index.mjs ./

RUN chmod +x /app/index.mjs

USER node

ENTRYPOINT ["node", "/app/index.mjs"]
