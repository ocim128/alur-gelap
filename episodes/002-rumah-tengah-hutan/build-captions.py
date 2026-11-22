"""Prepare caption beats from the producer's measured word sidecar.

The sidecar is automatic speech recognition, so correct its obvious spelling
errors against the locked script without modifying the narration or timings.
"""
import json
import sys
from pathlib import Path
sys.dont_write_bytecode = True
sys.path.insert(0, str(Path(__file__).resolve().parents[2] / 'scripts'))
from caption_helpers import assign_word_to_scene, semantic_color

episode = Path(__file__).parent
source = json.loads((episode / 'narration-timestamps.json').read_text(encoding='utf-8'))
corrections = {
    'perhatikan,': 'perhatiin', 'seladahan': 'sela dahan', 'seladahan.': 'sela dahan.',
    'diambang': 'di ambang', 'gilatan': 'kilatan', 'Dilantai': 'Di lantai',
    'Prak,': 'BRAK', 'lante': 'lantai', 'kedalam': 'ke dalam',
    'tentuman.': 'dentuman', 'Guru': 'GURUH', 'guru': 'guruh',
    'berak,': 'BRAK', 'dibalik': 'di balik', 'ke': 'ke', 'muruh': 'gemuruh',
    'disarangnya,': 'di sarangnya',
}
words = []
for entry in source['words']:
    item = dict(entry)
    token = item['word']
    if token.startswith('-') and words:
        words[-1]['word'] += '-' + token[1:]
        words[-1]['end'] = item['end']
    elif words and words[-1]['word'].lower() == 'di' and token.lower() == 'hantam':
        words[-1]['word'] += token
        words[-1]['end'] = item['end']
    else:
        item['word'] = corrections.get(token, token)
        words.append(item)

# The ASR erroneously split "gemuruh" into "ke muruh".
for i in range(len(words) - 1):
    if words[i]['word'].lower() == 'ke' and words[i+1]['word'] == 'gemuruh':
        words[i]['word'] = 'gemuruh'
        words[i]['end'] = words[i+1]['end']
        words[i+1]['word'] = ''
words = [w for w in words if w['word']]

beats = []
group = []
manifest = json.loads((episode / 'manifest.json').read_text(encoding='utf-8'))
fps = manifest['fps']
cuts = [s['at'] for s in manifest['scenes']] + [manifest['duration']]

# Each ASR word is assigned once to its longest-overlap panel. Do not deduplicate
# separate spoken occurrences, even when their spelling is identical.
segments = [assign_word_to_scene(word, cuts, fps) for word in words]
color_path = episode / 'caption-colors.json'
color_overrides = json.loads(color_path.read_text(encoding='utf-8')) if color_path.exists() else {}

def flush():
    if not group:
        return
    pieces = ' '.join(w['word'] for w in group).split()
    beats.append({
        'startMs': group[0]['startFrame'] * 1000 / fps,
        'endMs': group[-1]['endFrame'] * 1000 / fps,
        'timestampMs': None, 'confidence': None, 'speaker': 'NARATOR',
        'words': [{'text': x.upper(), 'color': semantic_color(x, color_overrides)} for x in pieces],
    })
    group.clear()

for word in segments:
    length = sum(len(w['word'].split()) for w in group)
    if group and (length + len(word['word'].split()) > 4 or
                  word['startFrame'] - group[-1]['endFrame'] > 6 or
                  word['sceneFrame'] != group[-1]['sceneFrame'] or
                  group[-1]['word'].endswith(('.', '!', '?')) or
                  word['chunk'] != group[-1]['chunk']):
        flush()
    group.append(word)
flush()
(episode / 'captions.json').write_text(json.dumps(beats, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
