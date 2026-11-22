import unittest
from caption_helpers import assign_word_to_scene, semantic_color

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

    def test_word_outside_cut_boundaries_fails(self):
        with self.assertRaises(ValueError):
            assign_word_to_scene({'word': 'akhir', 'start': 2.2, 'end': 2.4}, [0, 30, 60], 30)

if __name__ == '__main__':
    unittest.main()
