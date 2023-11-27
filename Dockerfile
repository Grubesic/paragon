# Stage 1: Build the Angular app
FROM node:latest as build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build --prod

# Stage 2: Serve the app with nginx
FROM nginx:alpine
# Remove the default nginx index page
RUN rm -rf /usr/share/nginx/html/*
# Copy from the 'dist/angular-shop/browser' directory to the nginx html directory
COPY --from=build /app/dist/paragon/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
