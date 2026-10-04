FROM python:3.14-slim

# Prevent Python from writing .pyc files to disk.
ENV PYTHONDONTWRITEBYTECODE=1
# Prevent Python from buffering stdout/stderr so logs appear immediately.
ENV PYTHONUNBUFFERED=1

# Set the working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends gosu \
    && rm -rf /var/lib/apt/lists/*

# Copy the requirements file and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

RUN useradd -m -r appuser && chown -R appuser /app && chmod +x /app/scripts/entrypoint.sh

# Expose the port the app runs on
EXPOSE 8000

ENTRYPOINT ["/app/scripts/entrypoint.sh"]

# Set the entry point for the container
CMD ["gunicorn", "ShoppingList.wsgi:application", "--workers", "5", "--bind", "0.0.0.0:8000"]