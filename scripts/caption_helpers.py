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
