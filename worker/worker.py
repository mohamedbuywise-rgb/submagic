"""
ClipGenie Worker — All CapCut Free Features + More
Processes: transcription, TTS, audio enhance, background removal, compression, noise removal, speed control
"""
import os
import json
import time
import subprocess
import tempfile
import requests
from redis import Redis
from faster_whisper import WhisperModel
from rembg import remove
from PIL import Image
from supabase import create_client

redis_client = Redis.from_url(os.getenv('REDIS_URL', 'redis://localhost:6379'))

# Supabase Storage client (uses service_role key for full upload access)
supabase = create_client(
    os.getenv('SUPABASE_URL'),
    os.getenv('SUPABASE_KEY')
)
BUCKET_NAME = 'clipgenie-uploads'  # لازم تعمل الـ bucket ده في Supabase Storage وتخليه Public


def upload_to_supabase(local_path, remote_name=None, content_type=None):
    """يرفع ملف من الديسك المحلي لـ Supabase Storage ويرجّع الـ public URL"""
    remote_name = remote_name or f"{int(time.time())}_{os.path.basename(local_path)}"
    with open(local_path, 'rb') as f:
        file_bytes = f.read()

    supabase.storage.from_(BUCKET_NAME).upload(
        path=remote_name,
        file=file_bytes,
        file_options={
            "content-type": content_type or "application/octet-stream",
            "upsert": "true",
        },
    )

    public_url = supabase.storage.from_(BUCKET_NAME).get_public_url(remote_name)
    print(f"[Supabase Upload] {local_path} -> {public_url}")
    return public_url


def upload_result_files(result):
    """يمسح على أي قيمة في نتيجة الجوب لو كانت مسار ملف موجود فعلاً على الديسك،
    يرفعه على Supabase Storage، ويستبدل المسار المحلي بالـ public URL.
    كده أي handler جديد هيتغطى تلقائي من غير ما نلمسه."""
    for key, value in list(result.items()):
        if isinstance(value, str) and os.path.isfile(value):
            try:
                public_url = upload_to_supabase(value)
                result[key] = public_url
                try:
                    os.remove(value)  # نضف الملف المحلي بعد الرفع
                except OSError:
                    pass
            except Exception as e:
                print(f"[Upload Error] Failed to upload {value}: {e}")
    return result


def resolve_input_file(file_ref):
    """جوب بيجيله file_path ممكن يبقى رابط (URL) من Supabase Storage مش مسار محلي،
    عشان الفرونت بيرفع الملف هناك مش على الـ Worker مباشرة. الدالة دي بتنزّل
    الملف من الرابط لملف مؤقت محلي، وترجّع المسار المحلي عشان باقي الكود يشتغل
    زي ما هو (subprocess/ffmpeg محتاجين مسار على الديسك)."""
    if not isinstance(file_ref, str) or not file_ref.startswith(('http://', 'https://')):
        return file_ref  # أصلاً مسار محلي، سيبه زي ما هو

    ext = os.path.splitext(file_ref.split('?')[0])[1] or '.tmp'
    fd, local_path = tempfile.mkstemp(suffix=ext, dir='/tmp')
    os.close(fd)

    print(f"[Download] {file_ref} -> {local_path}")
    response = requests.get(file_ref, stream=True, timeout=120)
    response.raise_for_status()
    with open(local_path, 'wb') as f:
        for chunk in response.iter_content(chunk_size=8192):
            f.write(chunk)

    return local_path

print("Loading AI models...")
model = WhisperModel("tiny", device="cpu", compute_type="int8")
print("All models loaded!")

# 🎨 Subtitle Styles (FREE)
SUBTITLE_STYLES = {
    "classic": {
        "name": "Classic Professional",
        "force_style": "Fontname=Montserrat,Fontsize=24,PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,Outline=2.5,Shadow=1,Alignment=2,MarginV=40,Bold=0",
        "desc": "Outline سميك + Shadow ناعم"
    },
    "tiktok": {
        "name": "TikTok / Social",
        "force_style": "Fontname=Arial,Fontsize=28,PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,Outline=3,Shadow=2,Alignment=2,MarginV=50,Bold=1",
        "desc": "Stroke أسود + Shadow قوي"
    },
    "box": {
        "name": "Background Box",
        "force_style": "Fontname=Roboto,Fontsize=22,PrimaryColour=&H00FFFFFF,BackColour=&H80000000,BorderStyle=4,Outline=0,Shadow=0,Alignment=2,MarginV=40",
        "desc": "خلفية سوداء شفافة"
    },
    "glow": {
        "name": "Gradient Glow",
        "force_style": "Fontname=Montserrat,Fontsize=26,PrimaryColour=&H00FFFFFF,OutlineColour=&H00FF8800,Outline=2,Shadow=3,Alignment=2,MarginV=45,Bold=1",
        "desc": "Glow برتقالي"
    },
    "minimal": {
        "name": "Minimal Clean",
        "force_style": "Fontname=Inter,Fontsize=20,PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,Outline=0.5,Shadow=1,Alignment=2,MarginV=35",
        "desc": "Shadow خفيف أنيق"
    }
}

def run_ffmpeg(cmd, desc="FFmpeg"):
    """Run FFmpeg command with error handling"""
    print(f"[{desc}] Running: {' '.join(cmd)}")
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"[{desc}] Error: {result.stderr}")
        raise Exception(f"{desc} failed: {result.stderr}")
    print(f"[{desc}] Done!")
    return result

# ═══════════════════════════════════════════════════════════
# 1. AUTO SUBTITLES (Transcription + Burn-in)
# ═══════════════════════════════════════════════════════════

def generate_srt(segments, output_path):
    with open(output_path, 'w', encoding='utf-8') as f:
        for i, segment in enumerate(segments, 1):
            start = time.strftime('%H:%M:%S,', time.gmtime(segment.start))
            start += f"{int((segment.start % 1) * 1000):03d}"
            end = time.strftime('%H:%M:%S,', time.gmtime(segment.end))
            end += f"{int((segment.end % 1) * 1000):03d}"
            f.write(f"{i}\n{start} --> {end}\n{segment.text.strip()}\n\n")
    return output_path

def generate_vtt(segments, output_path):
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write("WEBVTT\n\n")
        for i, segment in enumerate(segments, 1):
            start = time.strftime('%H:%M:%S.', time.gmtime(segment.start))
            start += f"{int((segment.start % 1) * 1000):03d}"
            end = time.strftime('%H:%M:%S.', time.gmtime(segment.end))
            end += f"{int((segment.end % 1) * 1000):03d}"
            f.write(f"{start} --> {end}\n{segment.text.strip()}\n\n")
    return output_path

def process_transcription(job):
    file_path = job['file_path']
    language = job.get('language', 'ar')
    output_format = job.get('format', 'srt')
    style_name = job.get('style', 'classic')

    print(f"[Transcribe] Processing: {file_path}")
    segments, info = model.transcribe(file_path, language=language, word_timestamps=False)

    srt_path = file_path.replace('.mp4', '.srt').replace('.mov', '.srt')
    generate_srt(segments, srt_path)

    result = {'type': 'transcription', 'srt_file': srt_path}

    if output_format in ('vtt', 'all'):
        vtt_path = file_path.replace('.mp4', '.vtt').replace('.mov', '.vtt')
        generate_vtt(segments, vtt_path)
        result['vtt_file'] = vtt_path

    if output_format in ('burn', 'all'):
        burned_path = file_path.replace('.mp4', '_subtitled.mp4').replace('.mov', '_subtitled.mp4')
        style = SUBTITLE_STYLES.get(style_name, SUBTITLE_STYLES["classic"])
        cmd = [
            "ffmpeg", "-y", "-i", file_path,
            "-vf", f"subtitles={srt_path}:force_style='{style['force_style']}'",
            "-c:v", "libx264", "-crf", "23", "-preset", "fast",
            "-c:a", "copy", burned_path
        ]
        run_ffmpeg(cmd, "Burn Subtitles")
        result['burned_video'] = burned_path
        result['style_used'] = style['name']

    return result

# ═══════════════════════════════════════════════════════════
# 2. TEXT TO SPEECH (TTS)
# ═══════════════════════════════════════════════════════════

def process_tts(job):
    """Convert text to speech using system TTS (espeak/pico2wave) or gTTS"""
    text = job['text']
    language = job.get('language', 'ar')
    output_path = job.get('output_path', '/tmp/tts_output.mp3')

    print(f"[TTS] Generating speech for: {text[:50]}...")

    # Try pico2wave first (better quality, free)
    try:
        lang_map = {'ar': 'ar-AR', 'en': 'en-US', 'fr': 'fr-FR'}
        pico_lang = lang_map.get(language, 'en-US')
        wav_path = output_path.replace('.mp3', '.wav')
        cmd = ["pico2wave", "-l", pico_lang, "-w", wav_path, text]
        run_ffmpeg(cmd, "pico2wave")

        # Convert to MP3
        cmd = ["ffmpeg", "-y", "-i", wav_path, "-codec:a", "libmp3lame", "-qscale:a", "2", output_path]
        run_ffmpeg(cmd, "Convert to MP3")
        os.remove(wav_path)

    except:
        # Fallback to espeak (robotic but works)
        cmd = ["espeak", "-v", language, "-w", output_path.replace('.mp3', '.wav'), text]
        run_ffmpeg(cmd, "espeak")
        cmd = ["ffmpeg", "-y", "-i", output_path.replace('.mp3', '.wav'), output_path]
        run_ffmpeg(cmd, "Convert to MP3")

    return {'type': 'tts', 'audio_file': output_path}

# ═══════════════════════════════════════════════════════════
# 3. AUDIO ENHANCEMENT (Noise Removal + Volume Normalize)
# ═══════════════════════════════════════════════════════════

def process_audio_enhance(job):
    """Remove noise, normalize volume, enhance clarity"""
    file_path = job['file_path']
    output_path = file_path.replace('.mp4', '_enhanced.mp4').replace('.mov', '_enhanced.mov')

    print(f"[Audio Enhance] Processing: {file_path}")

    # High-pass filter (remove rumble) + volume normalize + compression
    cmd = [
        "ffmpeg", "-y", "-i", file_path,
        "-af", "highpass=f=80,afftdn=nf=-25,dynaudnorm=f=150:g=15",
        "-c:v", "copy", output_path
    ]
    run_ffmpeg(cmd, "Audio Enhance")

    return {'type': 'audio_enhance', 'output_file': output_path}

# ═══════════════════════════════════════════════════════════
# 4. BACKGROUND REMOVAL (rembg)
# ═══════════════════════════════════════════════════════════

def process_remove_bg(job):
    file_path = job['file_path']
    output_path = file_path.replace('.png', '_nobg.png').replace('.jpg', '_nobg.png')

    print(f"[Remove BG] Processing: {file_path}")
    input_image = Image.open(file_path)
    output_image = remove(input_image)
    output_image.save(output_path)

    return {'type': 'remove_bg', 'output_file': output_path}

# ═══════════════════════════════════════════════════════════
# 5. VIDEO COMPRESSION (Smart)
# ═══════════════════════════════════════════════════════════

def process_compress(job):
    """Compress video while keeping quality"""
    file_path = job['file_path']
    quality = job.get('quality', 'medium')  # low, medium, high
    output_path = file_path.replace('.mp4', '_compressed.mp4').replace('.mov', '_compressed.mov')

    crf_map = {'low': '32', 'medium': '26', 'high': '20'}
    crf = crf_map.get(quality, '26')

    print(f"[Compress] Quality: {quality}, CRF: {crf}")

    cmd = [
        "ffmpeg", "-y", "-i", file_path,
        "-c:v", "libx264", "-crf", crf, "-preset", "slow",
        "-c:a", "aac", "-b:a", "128k",
        "-movflags", "+faststart",
        output_path
    ]
    run_ffmpeg(cmd, "Compress")

    # Get file sizes
    original_size = os.path.getsize(file_path)
    new_size = os.path.getsize(output_path)
    savings = ((original_size - new_size) / original_size) * 100

    return {
        'type': 'compress',
        'output_file': output_path,
        'original_size_mb': round(original_size / 1024 / 1024, 2),
        'new_size_mb': round(new_size / 1024 / 1024, 2),
        'savings_percent': round(savings, 1)
    }

# ═══════════════════════════════════════════════════════════
# 6. NOISE REMOVAL (Audio only)
# ═══════════════════════════════════════════════════════════

def process_noise_removal(job):
    """Remove background noise from audio/video"""
    file_path = job['file_path']
    output_path = file_path.replace('.mp4', '_clean.mp4').replace('.mov', '_clean.mov')

    print(f"[Noise Removal] Processing: {file_path}")

    # afftdn = FFmpeg audio FFT denoiser
    cmd = [
        "ffmpeg", "-y", "-i", file_path,
        "-af", "afftdn=nf=-30:tn=1",
        "-c:v", "copy", output_path
    ]
    run_ffmpeg(cmd, "Noise Removal")

    return {'type': 'noise_removal', 'output_file': output_path}

# ═══════════════════════════════════════════════════════════
# 7. SPEED CONTROL (Fast/Slow motion)
# ═══════════════════════════════════════════════════════════

def process_speed(job):
    """Change video speed (0.5x slow to 2x fast)"""
    file_path = job['file_path']
    speed = float(job.get('speed', '1.0'))  # 0.5, 0.75, 1.25, 1.5, 2.0
    output_path = file_path.replace('.mp4', f'_speed{speed}x.mp4')

    print(f"[Speed] Changing to {speed}x")

    # setpts for video, atempo for audio (limited to 0.5-2.0)
    cmd = [
        "ffmpeg", "-y", "-i", file_path,
        "-filter_complex", f"[0:v]setpts={1/speed}*PTS[v];[0:a]atempo={min(speed, 2.0)}[a]",
        "-map", "[v]", "-map", "[a]",
        "-c:v", "libx264", "-preset", "fast",
        "-c:a", "aac", output_path
    ]
    run_ffmpeg(cmd, "Speed Control")

    return {'type': 'speed', 'output_file': output_path, 'speed': speed}

# ═══════════════════════════════════════════════════════════
# 8. FORMAT CONVERSION
# ═══════════════════════════════════════════════════════════

def process_convert(job):
    """Convert video to any format (MP4, MOV, AVI, MKV, WebM, GIF)"""
    file_path = job['file_path']
    target_format = job.get('format', 'mp4')  # mp4, mov, avi, mkv, webm, gif
    output_path = file_path.rsplit('.', 1)[0] + f'.{target_format}'

    print(f"[Convert] To {target_format}")

    if target_format == 'gif':
        # GIF needs special handling
        cmd = [
            "ffmpeg", "-y", "-i", file_path,
            "-vf", "fps=10,scale=480:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=128[p];[s1][p]paletteuse",
            "-loop", "0", output_path
        ]
    else:
        cmd = ["ffmpeg", "-y", "-i", file_path, "-c:v", "libx264", "-c:a", "aac", output_path]

    run_ffmpeg(cmd, f"Convert to {target_format}")

    return {'type': 'convert', 'output_file': output_path, 'format': target_format}

# ═══════════════════════════════════════════════════════════
# MAIN WORKER LOOP
# ═══════════════════════════════════════════════════════════

JOB_HANDLERS = {
    'transcription': process_transcription,
    'tts': process_tts,
    'audio_enhance': process_audio_enhance,
    'remove_bg': process_remove_bg,
    'compress': process_compress,
    'noise_removal': process_noise_removal,
    'speed': process_speed,
    'convert': process_convert,
}

def main():
    print("=" * 60)
    print("✨ ClipGenie Worker — All CapCut Features + More")
    print("=" * 60)
    print("Available jobs:")
    for key in JOB_HANDLERS:
        print(f"  • {key}")
    print("Available subtitle styles:")
    for key, style in SUBTITLE_STYLES.items():
        print(f"  • {key}: {style['name']}")
    print("=" * 60)

    while True:
        job_data = redis_client.blpop('clipgenie:jobs', timeout=5)
        if job_data:
            _, job_json = job_data
            job = json.loads(job_json)
            job_type = job.get('type')

            # لو الجوب فيه file_path ورابط (URL) من Supabase Storage، نزّله محلياً الأول
            if job.get('file_path'):
                job['file_path'] = resolve_input_file(job['file_path'])

            try:
                handler = JOB_HANDLERS.get(job_type)
                if handler:
                    result = handler(job)
                    result = upload_result_files(result)  # رفع الملفات على Supabase Storage
                else:
                    result = {'error': f'Unknown job type: {job_type}'}

                redis_client.setex(f"clipgenie:result:{job['id']}", 3600, json.dumps(result))
                print(f"[Done] Job {job['id']} completed successfully")

            except Exception as e:
                print(f"[Error] Job {job['id']}: {e}")
                redis_client.setex(f"clipgenie:result:{job['id']}", 3600, json.dumps({'error': str(e)}))

if __name__ == '__main__':
    main()