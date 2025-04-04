# Use a lightweight Python base image
FROM python:3.10-alpine

# Set environment variables
ENV API_APP=server.py
ENV API_RUN_HOST=0.0.0.0

# Set the working directory
WORKDIR /app

# Copy requirements file for initial build
COPY requirements.txt .

# Install system dependencies
RUN apk add --no-cache gcc musl-dev linux-headers mariadb-connector-c-dev libffi-dev openssl-dev

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose the API port
EXPOSE 8000

# Start FastAPI using Uvicorn
CMD ["uvicorn", "backend.server:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]