"""Build the v2 manifest on the prepared narration's measured timeline."""
import json
from pathlib import Path

p = Path(__file__).parent
source = json.loads((p / 'manifest.json').read_text(encoding='utf-8'))
fps, duration = source['fps'], source['duration']
starts = [source['timing'][scene['atCue']] if scene.get('atCue') else scene['at'] for scene in source['scenes']]
visible = {1, 7, 8, 10, 11, 14, 15, 16, 17, 18, 19, 22, 23}
scenes = []
for i, at in enumerate(starts):
    n = i + 1
    end = starts[i + 1] if i + 1 < len(starts) else duration
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
    if source['scenes'][i].get('atCue'):
        scenes[-1]['atCue'] = source['scenes'][i]['atCue']

manifest = {
    'schemaVersion': 2, 'pipelineVersion': 2, 'id': 'Skenario02RumahTengahHutan',
    'fps': fps, 'duration': duration, 'captions': 'captions.json',
    'openingTitle': 'PONDOK TENGAH BADAI',
    'narration': source['narration'],
    'art': {'styleId': 'urban-silhouette-noir', 'rasterAssets': {s['plate']: 'urban-silhouette-noir' for s in scenes}},
    'script': {'format': 'decision-consequence', 'engine': 'branch-rewind', 'wordCount': 252,
               'hook': {'at': 0, 'line': 'Kamu nemu pondok pos pantau di tengah badai. Salah gerak, tamat.'},
               'ending': {'at': starts[22], 'twistAt': starts[23], 'payoff': 'Survivor escapes down the cliff path.'}},
    'tensionRamp': {'startSec': 149.4, 'endSec': 152.5, 'extraScale': .01, 'vignetteStrength': .1},
    'shotTreatments': {'P15': '1.25x additional crop, 230px downward offset, and left-biased smaller caption to clear the hands and beam.'},
    'beds': [], 'scenes': scenes,
    'soundMix': source['soundMix'], 'timing': source['timing'],
    'notes': 'Original narration retained. The climax flash is at 120.933333 s and the thunder/impact at 123.933333 s, 13.333 ms after the measured BRAK start at 123.920 s. The earlier Kilat menyala line starts at 114.360 s and the count finishes at 119.080 s; neither can coincide with the flash without changing the accepted narration.'
}
(p / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
