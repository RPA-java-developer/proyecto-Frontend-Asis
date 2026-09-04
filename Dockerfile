FROM node:20-alpine 

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

EXPOSE 5173

# El CMD para desarrollo con Vite requiere --host
CMD ["npm", "run", "dev", "--", "--host",  "0.0.0.0"]
