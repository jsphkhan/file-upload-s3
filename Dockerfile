#Install Node10
FROM node:10

#Create app directory
WORKDIR /app

#copy package.json
COPY package*.json ./

#Install dependencies
RUN npm install

#Copy source
COPY . ./

#Generate Production build
RUN npm run build

#Expose Node server port
EXPOSE 8081

#start Node server
CMD ["node", "server.js"]