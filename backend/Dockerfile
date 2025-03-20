FROM python:3.10-alpine
WORKDIR /backend
ENV API_APP=server.py
ENV API_RUN_HOST=0.0.0.0
RUN apk add --no-cache gcc musl-dev linux-headers
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt
EXPOSE 8000
COPY . .
CMD ["fastapi", "run", "server.py"]