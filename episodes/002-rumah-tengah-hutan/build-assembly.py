"""Build the v2 manifest on the prepared narration's measured timeline."""
import json
from pathlib import Path

p = Path(__file__).parent
starts = [0, 5.56, 16.2, 24.02, 28.8, 36.1, 45.24, 58.52,
          65.82, 75.1, 84.6, 90.46, 97.34, 103.54, 106.3,
          108.36, 110.98, 114.36, 123.9333333333, 127.82, 132.8, 141.46,
          145.26, 148.8]
starts = [round(t * 30) for t in starts]
visible = {1, 7, 8, 10, 11, 14, 15, 16, 17, 18, 19, 22, 23}
scenes = []
for i, at in enumerate(starts):
    n = i + 1
    end = starts[i + 1] if i < 23 else 4620
    plate = f'assets/002-rumah-tengah-hutan/master-batch-01/p{n:02}.webp'
    scenes.append({
        'id': f'P{n:02}', 'name': f'Panel {n:02}', 'at': at, 'plate': plate,
        'camera': {'from': {'scale': 1.035, 'x': -10 if i % 2 == 0 else 10, 'y': 0}, 'to': {'scale': 1.075, 'x': 10 if i % 2 == 0 else -10, 'y': 0}},
        'characters': {'mode': 'baked'}, 'hud': [],
        'editorial': {'protagonist': 'reaction' if n == 23 else ('visible' if n in visible else 'absent'),
                      'purpose': 'threat-proximity', 'evidence': f'Selected approved panel P{n:02}.'},
        'reframes': [{'at': j, 'duration': min(30, end - at - j), 'scale': 1.01, 'x': 0, 'y': 0}
                     for j in range(0, end - at, 70)],
    })

manifest = {
    'schemaVersion': 2, 'pipelineVersion': 2, 'id': 'Skenario02RumahTengahHutan',
    'fps': 30, 'duration': 4620, 'captions': 'captions.json',
    'openingTitle': 'PONDOK TENGAH BADAI',
    'narration': {'asset': 'assets/002-rumah-tengah-hutan/narration-prepared.mp3', 'at': 0, 'duration': 4548, 'gain': 1},
    'art': {'styleId': 'urban-silhouette-noir', 'rasterAssets': {s['plate']: 'urban-silhouette-noir' for s in scenes}},
    'script': {'format': 'decision-consequence', 'engine': 'branch-rewind', 'wordCount': 252,
               'hook': {'at': 0, 'line': 'Kamu nemu pondok pos pantau di tengah badai. Salah gerak, tamat.'},
               'ending': {'at': starts[22], 'twistAt': starts[23], 'payoff': 'Survivor escapes down the cliff path.'}},
    'tensionRamp': {'startSec': 149.4, 'endSec': 152.5, 'extraScale': .01, 'vignetteStrength': .1},
    'shotTreatments': {'P15': '1.25x additional crop, 230px downward offset, and left-biased smaller caption to clear the hands and beam.'},
    'beds': [], 'scenes': scenes,
    'soundMix': {'asset': 'assets/002-rumah-tengah-hutan/mix-polish.wav',
                 'recipe': 'episodes/002-rumah-tengah-hutan/mix.py',
                 'cues': [
                     {'name': 'synthetic rain and wind', 'atSec': 0},
                     {'name': 'falling pine', 'asset': 'sfx/prepared/body-fall.wav', 'atSec': 9.1},
                     {'name': 'branches', 'asset': 'sfx/prepared/coat-shift.wav', 'atSec': 18.9},
                     {'name': 'setup thunder', 'atSec': 32.7, 'source': 'deterministic synthesized noise'},
                     {'name': 'exposed strike', 'asset': 'assets/002-rumah-tengah-hutan/wood-hit.ogg', 'atSec': 62.2333333333},
                     {'name': 'rewind', 'asset': 'sfx/prepared/tension-rise.wav', 'atSec': 84.6},
                     {'name': 'climax thunder and masked strike', 'asset': 'assets/002-rumah-tengah-hutan/wood-hit.ogg', 'atSec': 123.9459133333, 'thunderAtSec': 123.9333333333},
                     {'name': 'door creak', 'asset': 'sfx/prepared/minimarket-door-creak-outside.wav', 'atSec': 143.34},
                     {'name': 'blackout sub', 'atSec': 152.65, 'source': 'deterministic sine'}]},
    'timing': {'setupFlashFrame': 891, 'setupThunderFrame': 981,
               'climaxFlashFrame': 3628, 'climaxThunderFrame': 3718,
               'rewindFrame': 2538, 'rewindFrames': 12,
               'postRewindSilence': [88.6, 90.2], 'postThunderSilence': [139.0, 141.0],
               'blackoutFrame': 4575, 'blackoutSubFrame': 4580},
    'notes': 'Original narration retained. The climax flash is at 120.933333 s and the thunder/impact at 123.933333 s, 13.333 ms after the measured BRAK start at 123.920 s. The earlier Kilat menyala line starts at 114.360 s and the count finishes at 119.080 s; neither can coincide with the flash without changing the accepted narration.'
}
(p / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
