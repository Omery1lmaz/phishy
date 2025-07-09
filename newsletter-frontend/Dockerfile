FROM node:18

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Portu açıkla
EXPOSE 5173 

# Ortam değişkenini belirt
ENV HOST 0.0.0.0
ENV PORT 5173 

CMD ["npm", "start"]
