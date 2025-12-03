FROM python:3.12-slim-trixie

# 1. Install curl, ca-certificates AND unzip (Required for the model extraction below)
RUN apt-get update && apt-get install -y --no-install-recommends curl ca-certificates unzip

# 2. Install uv
ADD https://astral.sh/uv/install.sh /uv-installer.sh
RUN sh /uv-installer.sh && rm /uv-installer.sh

# Ensure the installed binary is on the `PATH`
ENV PATH="/root/.local/bin/:$PATH"

# 3. Download and unzip the Model
# We do this BEFORE copying app code so this heavy layer is cached and doesn't download every time you change code
RUN mkdir -p /speech_to_text_models && \
    cd /speech_to_text_models && \
    curl -L -o vosk-model-small-en-us-0.15.zip https://alphacephei.com/vosk/models/vosk-model-small-en-us-0.15.zip && \
    unzip vosk-model-small-en-us-0.15.zip && \
    rm vosk-model-small-en-us-0.15.zip

# 4. Set workdir
WORKDIR /app

# 5. Copy dependency files first (Optimization for caching)
COPY pyproject.toml uv.lock /app/

# 6. Install dependencies
RUN uv sync --frozen --no-cache

# 7. Copy the rest of the application
COPY . /app

EXPOSE 8000

CMD ["uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]