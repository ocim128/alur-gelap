"""Regression: an unrelated MP4 must never be reported as a passing export."""
import subprocess
import sys
sys.dont_write_bytecode = True
import tempfile
import unittest
import json
import importlib.util
import shutil
from unittest.mock import patch
from pathlib import Path
import numpy as np

VERIFIER = Path(__file__).with_name('verify-export.py')
spec = importlib.util.spec_from_file_location('forest_verifier', VERIFIER)
verifier = importlib.util.module_from_spec(spec)
spec.loader.exec_module(verifier)
manifest = json.loads(VERIFIER.with_name('manifest.json').read_text(encoding='utf-8'))

def fake_output(*args, **kwargs):
    command = args[0]
    if '-frames:v' in command:
        frames = np.zeros((7, 42, 24), dtype=np.uint8)
        frames[3:6] = 255
        return frames.tobytes()
    if command[command.index('-t') + 1] != '0.4':
        return np.zeros(48000, dtype='<f4').tobytes()
    start = float(command[command.index('-ss') + 1])
    seed = 9 if start < 100 else 18
    sr = 48000
    x = np.random.default_rng(seed).standard_normal(int(sr * 2.8)).astype(np.float32)
    low = np.cumsum(x, dtype=np.float64)
    low[90:] -= low[:-90].copy()
    low[:90] = 0
    t = np.arange(len(x)) / sr
    reference = (x * .22 * np.exp(-t * 18) + (low / 20) * .8 * np.exp(-t * 1.8)).astype(np.float32)
    signal = np.zeros(int(.4 * sr), dtype='<f4')
    signal[int(.18 * sr):int(.18 * sr) + int(.14 * sr)] = reference[:int(.14 * sr)]
    return signal.tobytes()

class ExportVerifierTest(unittest.TestCase):
    def test_builder_tracks_retimed_cue(self):
        with tempfile.TemporaryDirectory() as directory:
            folder = Path(directory)
            changed = json.loads(json.dumps(manifest))
            changed['timing']['climaxThunderFrame'] += 1
            (folder / 'manifest.json').write_text(json.dumps(changed), encoding='utf-8')
            shutil.copy(VERIFIER.with_name('build-assembly.py'), folder / 'build-assembly.py')
            subprocess.run([sys.executable, str(folder / 'build-assembly.py')], check=True)
            rebuilt = json.loads((folder / 'manifest.json').read_text(encoding='utf-8'))
            scene = next(scene for scene in rebuilt['scenes'] if scene['id'] == 'P19')
            self.assertEqual(scene['at'], changed['timing']['climaxThunderFrame'])
            self.assertEqual(rebuilt['duration'], changed['duration'])
            self.assertEqual(rebuilt['soundMix'], changed['soundMix'])

    def test_wrong_video_fails(self):
        with tempfile.TemporaryDirectory() as directory:
            video = Path(directory) / 'wrong.mp4'
            subprocess.run(['ffmpeg', '-v', 'error', '-f', 'lavfi', '-i', 'color=black:size=64x64:rate=30:duration=1',
                '-f', 'lavfi', '-i', 'anullsrc=r=48000:cl=mono', '-t', '1', '-c:v', 'libx264', '-c:a', 'aac', str(video)], check=True)
            result = subprocess.run([sys.executable, str(VERIFIER), str(video)], text=True, capture_output=True)
            self.assertNotEqual(result.returncode, 0)
            self.assertIn('missing', result.stdout.lower())
            self.assertNotIn('Traceback', result.stderr)

    def test_out_of_tolerance_cue_fails(self):
        with patch.object(verifier.subprocess, 'check_output', side_effect=fake_output):
            result = verifier.verify(Path('unused.mp4'), manifest)
        self.assertTrue(any('exceeds one frame' in message for message in result['errors']))

    def test_nonfinite_audio_fails(self):
        def nonfinite(*args, **kwargs):
            data = fake_output(*args, **kwargs)
            command = args[0]
            if '-frames:v' not in command and command[command.index('-t') + 1] == '0.4':
                samples = np.frombuffer(data, dtype='<f4').copy()
                samples[0] = np.nan
                return samples.tobytes()
            return data
        with patch.object(verifier.subprocess, 'check_output', side_effect=nonfinite):
            result = verifier.verify(Path('unused.mp4'), manifest)
        self.assertTrue(any('non-finite' in message for message in result['errors']))

if __name__ == '__main__':
    unittest.main()
