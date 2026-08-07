FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
# pkg-config + libavformat/libavcodec/... dev headers لازمين عشان مكتبة
# av (اللي بيعتمد عليها faster-whisper) تتبني من المصدر
RUN apt-get update && apt-get install -y \
    ffmpeg \
    espeak \
    libespeak1 \
    pkg-config \
    libavformat-dev \
    libavcodec-dev \
    libavdevice-dev \
    libavutil-dev \
    libavfilter-dev \
    libswscale-dev \
    libswresample-dev \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Download Whisper model (tiny = fast, base = better)
RUN python -c "from faster_whisper import WhisperModel; WhisperModel('tiny', device='cpu', compute_type='int8')"

# Copy worker code
COPY worker.py .

# Render بيحط قيمة PORT تلقائي، بس بنعرّف Default هنا للتوثيق فقط
EXPOSE 10000

# Start worker
CMD ["python", "worker.py"]
