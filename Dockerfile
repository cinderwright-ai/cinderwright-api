FROM node:20-slim

WORKDIR /app

# Install dependencies
COPY package.json ./
RUN npm install --production

# Copy server
COPY server.js ./
COPY .env.example ./

# Discovery files and data
RUN mkdir -p /app/data

# Environment
ENV PORT=3402
ENV NODE_ENV=production

EXPOSE 3402

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3402/stats', r => r.statusCode === 200 ? process.exit(0) : process.exit(1)).on('error', () => process.exit(1))"

CMD ["node", "server.js"]
