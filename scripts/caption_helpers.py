"""Small, reviewable caption helpers shared by episode builders."""
import math
import unicodedata

YELLOW = frozenset({'kunci', 'pengait', 'sabuk', 'senter', 'baterai', 'air', 'pintu', 'jendela',
                    'tangga', 'pegangan', 'jalan', 'keluar', 'buka', 'tutup', 'kunci', 'matikan', 'hitung'})
RED = frozenset({'bahaya', 'ancaman', 'monster', 'makhluk', 'penculik', 'menyerang', 'serangan',
                 'terjebak', 'tamat', 'mati', 'tewas', 'jatuh', 'terkunci', 'kebakaran'})

def semantic_color(text, overrides=None):
    """Use explicit episode overrides before the conservative default vocabulary."""
    token = ''.join(c for c in text.casefold() if unicodedata.category(c)[0] in ('L', 'N') or c == '-')
    if overrides and token in overrides:
        color = overrides[token]
        if color not in ('white', 'yellow', 'red'):
            raise ValueError(f'Invalid caption color for {token}: {color}')
        return color
    return 'red' if token in RED else 'yellow' if token in YELLOW else 'white'

def assign_word_to_scene(word, cuts, fps):
    """Assign a timed word once, to the panel containing most of its frame interval."""
    if fps <= 0 or len(cuts) < 2 or any(b <= a for a, b in zip(cuts, cuts[1:])):
        raise ValueError('Invalid caption scene boundaries or FPS')
    start = math.ceil(word['start'] * fps - 1e-8)
    end = math.ceil(word['end'] * fps - 1e-8)
    spans = [(max(start, left), min(end, right), left) for left, right in zip(cuts, cuts[1:])]
    spans = [span for span in spans if span[0] < span[1]]
    if not spans:
        raise ValueError(f"Word has no visible frame within the composition: {word['word']}")
    a, b, scene = max(spans, key=lambda span: span[1] - span[0])
    return {**word, 'startFrame': a, 'endFrame': b, 'sceneFrame': scene}


def build_caption_beats(words, cuts, fps, color_overrides=None):
    """Group timed ASR words into 1-4-token narrator beats on one panel each.

    Each input is a dict with word, start, end and chunk. An ASR item may
    contain multiple tokens with one shared time interval; no boundaries are
    invented for them. Normalize spelling and join split words before calling.
    """
    beats = []
    group = []

    def flush():
        if not group:
            return
        parts = [
            {'text': token.upper(), 'color': semantic_color(token, color_overrides),
             'startMs': word['startFrame'] * 1000 / fps,
             'endMs': word['endFrame'] * 1000 / fps}
            for word in group for token in word['word'].split()
        ]
        beats.append({'startMs': group[0]['startFrame'] * 1000 / fps,
                      'endMs': group[-1]['endFrame'] * 1000 / fps,
                      'speaker': 'NARATOR', 'words': parts})
        group.clear()

    for item in words:
        tokens = item['word'].split()
        if not 1 <= len(tokens) <= 4:
            raise ValueError('Each timed word must contain 1-4 tokens; provide measured timings for longer items')
        word = assign_word_to_scene(item, cuts, fps)
        if group and (sum(len(entry['word'].split()) for entry in group) + len(tokens) > 4
                      or word['startFrame'] - group[-1]['endFrame'] > 6
                      or word['sceneFrame'] != group[-1]['sceneFrame']
                      or group[-1]['word'].endswith(('.', '!', '?'))
                      or word['chunk'] != group[-1]['chunk']):
            flush()
        group.append(word)
    flush()
    return beats
