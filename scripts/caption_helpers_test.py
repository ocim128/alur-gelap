import json
import unittest
from pathlib import Path
from caption_helpers import assign_word_to_scene, semantic_color, build_caption_beats

# The equivalence inputs reproduce the episode-specific corrections without running
# builders, which would overwrite historical manifests and media.
def input_words(slug):
    p=Path('episodes')/slug
    side=json.loads((p/('narration-timestamps.json' if slug.startswith('003') else 'assembly-timestamps.json')).read_text(encoding='utf8'))
    corrections={'dituas':'di tuas','dituas,':'di tuas,','bertulin':'betulin','status,':'statis.','center.':'senter.','gunuh.':'gunung.','Arh':'Arah','benar':'bener','-benar':'-bener','Didalam':'Di dalam','natural':'netral','napa':'napas','selega.':'lega.','pertanya,':'petanya,','ali,':'alih,','begu':'beku','Kopilot':'Copilot','Jadikan':'Jadiin'}
    words=[]
    for original in side['words']:
        w=dict(original)
        if slug.startswith('003'):
            token=w['word']
            if token.lower()=='masuk' and 12.0<w['start']<12.5: w['word']='masuk ke'; token=w['word']
            if token.lower()=='tamat,': w['word']='Tamat.'; token=w['word']
            if token.lower()=='hening.': w['end']=135.8
            if words and words[-1]['word'].endswith('-'):
                words[-1]['word']+=token; words[-1]['end']=w['end']
            elif words and words[-1]['word'].lower()=='di' and token.lower() in ('gembok','telan'):
                words[-1]['word']+=token; words[-1]['end']=w['end']
            else: words.append(w)
        else:
            w['word']=corrections.get(w['word'],w['word'])
            if words and words[-1]['word'].lower()=='co' and w['word'].lower()=='pilot':
                words[-1]['word']='copilot'; words[-1]['end']=w['end']
            elif words and words[-1]['word'].lower()=='tangan' and w['word'].lower()=='mau' and 97<w['start']-1.64<99:
                words[-1]['word']='tanganmu'; words[-1]['end']=w['end']
            elif words and w['word'].startswith('-'):
                words[-1]['word']+=w['word']; words[-1]['end']=w['end']
            else: words.append(w)
    return words


class CaptionHelpersTest(unittest.TestCase):
    def test_words_crossing_cut_appear_once_in_longest_panel(self):
        early = assign_word_to_scene({'word': 'satu-satunya', 'start': .8, 'end': 1.1}, [0, 30, 60], 30)
        late = assign_word_to_scene({'word': 'pelan-pelan', 'start': .9, 'end': 1.2}, [0, 30, 60], 30)
        self.assertEqual((early['sceneFrame'], early['endFrame']), (0, 30))
        self.assertEqual((late['sceneFrame'], late['startFrame']), (30, 30))
        self.assertEqual(early['word'], 'satu-satunya')
        self.assertEqual(late['word'], 'pelan-pelan')

    def test_distinct_repeated_words_remain_distinct(self):
        words = [{'word': 'lari', 'start': .7, 'end': .9}, {'word': 'lari', 'start': 1.0, 'end': 1.2}]
        result = [assign_word_to_scene(word, [0, 30, 60], 30) for word in words]
        self.assertEqual([word['sceneFrame'] for word in result], [0, 30])
        self.assertEqual([word['word'] for word in result], ['lari', 'lari'])

    def test_semantic_colors_and_episode_overrides(self):
        self.assertEqual(semantic_color('KUNCI!'), 'yellow')
        self.assertEqual(semantic_color('BAHAYA,'), 'red')
        self.assertEqual(semantic_color('pelan-pelan'), 'white')
        self.assertEqual(semantic_color('kunci', {'kunci': 'red'}), 'red')
        with self.assertRaises(ValueError):
            semantic_color('kunci', {'kunci': 'blue'})

    def test_chunker_reproduces_shipped_narrator_beats(self):
        scenarios = {
            '003-goyangan-dek-enam': {'sekoci':'yellow','tuas':'yellow','rem':'yellow','pengunci':'yellow','genangan':'yellow','berayun':'yellow','puncak':'yellow','brak':'red','pusaran':'red','tamat':'red','sosok':'red','rantai':'yellow','klik':'yellow','lompat':'red'},
            '004-tangan-pilot-kemarin': {'celah':'yellow','tuas':'yellow','tamat':'red','gunung':'red'},
        }
        for slug, overrides in scenarios.items():
            with self.subTest(episode=slug):
                p = Path('episodes') / slug
                manifest = json.loads((p / 'manifest.json').read_text(encoding='utf8'))
                cuts = [scene['at'] for scene in manifest['scenes']] + [manifest['duration']]
                expected = json.loads((p / 'captions.json').read_text(encoding='utf8'))
                expected = [beat for beat in expected if beat.get('speaker') == 'NARATOR']
                self.assertEqual(build_caption_beats(input_words(slug), cuts, manifest['fps'], overrides), expected)

    def test_chunker_respects_boundaries_and_token_limit(self):
        words = [
            {'word':'satu dua', 'start':0, 'end':.2, 'chunk':0},
            {'word':'tiga empat', 'start':.2, 'end':.4, 'chunk':0},
            {'word':'lima.', 'start':.4, 'end':.5, 'chunk':0},
            {'word':'enam', 'start':.5, 'end':.6, 'chunk':0},
            {'word':'tujuh', 'start':.9, 'end':1.0, 'chunk':0},
            {'word':'delapan', 'start':1.0, 'end':1.1, 'chunk':1},
            {'word':'sembilan', 'start':2.0, 'end':2.1, 'chunk':1},
        ]
        beats = build_caption_beats(words, [0, 60, 90], 30, {})
        self.assertEqual([[word['text'] for word in beat['words']] for beat in beats],
                         [['SATU','DUA','TIGA','EMPAT'],['LIMA.'],['ENAM'],['TUJUH'],['DELAPAN'],['SEMBILAN']])
        self.assertTrue(all('startMs' in word and 'endMs' in word for beat in beats for word in beat['words']))
        with self.assertRaises(ValueError):
            build_caption_beats([{'word':'satu dua tiga empat lima', 'start':0, 'end':1, 'chunk':0}], [0, 60], 30, {})

    def test_word_outside_cut_boundaries_fails(self):
        with self.assertRaises(ValueError):
            assign_word_to_scene({'word': 'akhir', 'start': 2.2, 'end': 2.4}, [0, 30, 60], 30)

if __name__ == '__main__':
    unittest.main()
