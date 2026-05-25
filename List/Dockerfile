# Usar imagen oficial de Node.js versión 20 LTS
FROM node:20-alpine

# Instalar Angular CLI e Ionic CLI globalmente
RUN npm install -g @angular/cli @ionic/cli

# Crear directorio de trabajo dentro del contenedor
WORKDIR /List

# Exponer el puerto por defecto de Ionic (8100)
EXPOSE 8100

# Comando por defecto al iniciar el contenedor
CMD ["ionic", "--version"]
