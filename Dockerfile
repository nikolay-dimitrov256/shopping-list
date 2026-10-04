FROM python:3.14-slim

# Prevent Python from writing .pyc files to disk.
ENV PYTHONDONTWRITEBYTECODE=1
# Prevent Python from buffering stdout/stderr so logs appear immediately.
ENV PYTHONUNBUFFERED=1

# Set the working directory
WORKDIR /app

# Copy the requirements file and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

RUN useradd -m -r appuser && mkdir /app && chown -R appuser /app

# Copy the rest of the application code
COPY . .

# Run database migrations
RUN python manage.py migrate --noinput

# Collect static files
RUN python manage.py collectstatic --noinput

# Switch to the non-root user
USER appuser

# Expose the port the app runs on
EXPOSE 8000

# Set the entry point for the container
CMD ["python", "app.py"]