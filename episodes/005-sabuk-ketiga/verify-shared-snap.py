"""Verify the shared snap substitution without rewriting the existing mix."""
import json, subprocess, sys
from pathlib import Path
p=Path(__file__).resolve().parent;root=p.parents[1];sys.path.insert(0,str(root/'scripts'))
from verify_export_common import sha256_file,write_report
shared=root/'public/sfx/shared/tape-snap-rewind.wav';previous=root/'public/assets/004-tangan-pilot-kemarin/sfx/tape-snap-rewind.wav'
sha1=sha256_file(shared);sha2=sha256_file(previous)
def decode(path):return subprocess.check_output(['ffmpeg','-v','error','-i',str(path),'-ac','1','-ar','48000','-f','f32le','-'])
pcm_equal=decode(shared)==decode(previous)
source=(p/'mix.py').read_text(encoding='utf-8')
references_shared="public/sfx/shared/tape-snap-rewind.wav" in source
references_previous="public/assets/004-tangan-pilot-kemarin/sfx/tape-snap-rewind.wav" in source
ok=sha1==sha2 and pcm_equal and references_shared and not references_previous
report={'sharedPath':str(shared.relative_to(root)),'previousPath':str(previous.relative_to(root)),'sharedSha256':sha1,'previousSha256':sha2,'decodedPcmEqual':pcm_equal,'mixerReferencesShared':references_shared,'mixerReferencesOldEpisodeCopy':references_previous,'pass':ok,
 'note':'The byte-identical source substitution needs no regeneration of the existing mix; the delivery rewind onsets are checked separately.'}
write_report(report,Path(sys.argv[2]),sys.argv[1]);print(json.dumps(report,indent=2));sys.exit(not ok)
