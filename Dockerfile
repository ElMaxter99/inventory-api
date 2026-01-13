FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./

FROM base AS development
ENV NODE_ENV=development
RUN npm install --no-package-lock
COPY . .
EXPOSE 4000
CMD ["npm","start"]

FROM base AS production
ENV NODE_ENV=production
RUN npm install --omit=dev --no-package-lock
COPY . .
EXPOSE 4000
CMD ["npm","start"]
