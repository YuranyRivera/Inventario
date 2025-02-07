# Usa una imagen ligera de Node.js
FROM node:18-alpine

# Configura el directorio de trabajo
WORKDIR /app

# Copia los archivos de dependencias
COPY package.json package-lock.json ./

# Instala TODAS las dependencias (incluyendo devDependencies)
RUN npm install

# Copia el resto del código
COPY . .

# Expone el puerto 5173
EXPOSE 5173

# Comando de inicio
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
