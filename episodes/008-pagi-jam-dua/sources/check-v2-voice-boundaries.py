"""Retained-take signal and independent padded-ASR evidence; not a listening review."""
import json
import math
import subprocess
import tempfile
from pathlib import Path

import numpy as np
from faster_whisper import WhisperModel
from scipy.signal import resample_poly

ROOT = Path(__file__).resolve().parent
SOURCES = {
    'aji': ROOT / 'vn-aji-retake2.mp3',
    'nino': ROOT / 'vn-nino-source.mp3',
    'salsa_candidate_4': ROOT / 'vn-salsa-v2-attempt-4.mp3',
    'salsa_candidate_8': ROOT / 'vn-salsa-v2-attempt-8.mp3',
    'salsa_candidate_13': ROOT / 'vn-salsa-v2-attempt-13.mp3',
    'salsa_selected_17': ROOT / 'vn-salsa-v2-attempt-17.mp3',
}
SR = 48000
model = WhisperModel('small', device='cpu', compute_type='int8', cpu_threads=4, local_files_only=True)
results = {}
for name, path in SOURCES.items():
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', str(path), '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'], check=True, capture_output=True).stdout
    samples = np.frombuffer(raw, dtype='<f4')
    def rms_db(a):
        rms = math.sqrt(float(np.mean(a.astype(np.float64) ** 2)))
        return round(20 * math.log10(rms), 2) if rms else None
    threshold = 10 ** (-40 / 20)
    active = np.flatnonzero(np.abs(samples) >= threshold)
    # Padding isolates Whisper's timestamp-floor behavior, not the original speech content.
    with tempfile.TemporaryDirectory() as tmp:
        padded = str(Path(tmp) / 'padded.wav')
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(path), '-af', 'adelay=500,apad=pad_dur=0.5', '-ar', '16000', '-ac', '1', padded], check=True)
        import soundfile as sf
        audio, rate = sf.read(padded, dtype='float32')
        assert rate == 16000
        segments, _ = model.transcribe(audio, language='id', beam_size=5, vad_filter=False, condition_on_previous_text=False, word_timestamps=True)
        segments = list(segments)
    words = [{'word': w.word.strip(), 'start_s_padded': round(w.start, 3), 'end_s_padded': round(w.end, 3)} for seg in segments for w in (seg.words or [])]
    results[name] = {
        'source': path.name, 'decoded_duration_s': round(len(samples) / SR, 3),
        'first_20ms_rms_dbfs': rms_db(samples[:960]), 'last_20ms_rms_dbfs': rms_db(samples[-960:]),
        'first_sample_above_minus40_dbfs_s': round(float(active[0]) / SR, 4) if len(active) else None,
        'last_sample_above_minus40_dbfs_s': round(float(active[-1]) / SR, 4) if len(active) else None,
        'padded_asr_transcript': ' '.join(seg.text.strip() for seg in segments), 'padded_asr_words': words,
    }
print(json.dumps({'method': '48 kHz mono PCM; independent small Whisper with 0.5 s padding; thresholds do not prove speech completeness or lack of clipping', 'clips': results}, indent=2, ensure_ascii=False))
