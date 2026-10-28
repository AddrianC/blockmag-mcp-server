FROM node:22-alpine

LABEL org.opencontainers.image.title="BlockMag MCP Server"
LABEL org.opencontainers.image.description="Official BlockMag Model Context Protocol (MCP) Server — 6 Free Public Tools + 24 Authenticated ERP & Cloud POS Tools"
LABEL org.opencontainers.image.url="https://blockmag.com"
LABEL org.opencontainers.image.source="https://github.com/AddrianC/blockmag-mcp-server"
LABEL org.opencontainers.image.licenses="MIT"

WORKDIR /app

COPY package.json ./
COPY index.mjs ./

RUN chmod +x /app/index.mjs

ENTRYPOINT ["node", "/app/index.mjs"]
