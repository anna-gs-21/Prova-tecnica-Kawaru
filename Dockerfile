FROM node:18-alpine

WORKDIR /app

# Copiamos los archivos de dependencias del proyecto único
COPY package*.json ./
RUN npm install

# Copiamos todo el código fuente (src, public, etc.)
COPY . .

# Exponemos el puerto en el que corre tu servidor Express unificado (ej: 5000)
# (Si tu frontend se compila y sirve desde Express, este único puerto maneja ambos)
EXPOSE 5173

# Comando para arrancar tu app.js principal
CMD ["npm", "start"]
