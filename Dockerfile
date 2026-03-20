# Stage 1: Build the React Frontend
FROM node:22 AS frontend-builder
WORKDIR /app/frontend

# Copy package files and install dependencies
COPY lexi-frontend/package*.json ./
RUN npm install

# Copy source and build
COPY lexi-frontend/ ./
RUN npm run build

# Stage 2: Build the FastAPI Backend
FROM python:3.11-slim
WORKDIR /app

# Install python dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source
COPY backend/ .

# Copy the built React UI from Stage 1 into the "static" folder
COPY --from=frontend-builder /app/frontend/dist ./static

# Expose the port Cloud Run provides
EXPOSE 8080

# Cloud Run sets the PORT env variable; uvicorn will use it via CMD
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
