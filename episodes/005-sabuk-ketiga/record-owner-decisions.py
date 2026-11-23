"""Record the owner's 23 November listening and coverage dispositions."""
import json
from pathlib import Path
p=Path(__file__).resolve().parent/'pipeline-state.json';d=json.loads(p.read_text(encoding='utf-8'))
d['audio']['endingListening']={
 'status':'pass','reviewer':'owner','date':'2026-11-23',
 'video':'out/005-sabuk-ketiga/Skenario05SabukKetiga-audit-rework-v2-master_compressed.mp4',
 'notes':'Owner watched and listened: “Kamu berhasil bertahan hidup.” finishes completely cleanly with zero clipping before the 155.117 s vacuum, stinger and blackout.'}
images=d['images']
images.update({'status':'fail','technicalVerdict':'fail','ownerDisposition':'approved_with_exceptions','handoffAllowed':True,
 'exceptions':[
  {'panel':'P05','defect':'present_unreadable_at_phone_size','evidence':'Approved plate uses static grip and buckle staging; the delayed physical movement is not separately established.','downstreamVerify':'Carry this owner-accepted coverage exception into Agent 05 QA without treating it as a blocking image defect.'},
  {'panel':'P10','defect':'present_conflicting_state','evidence':'The selected plate shows both the pilot and third belts already open; it does not show sequential opening.','downstreamVerify':'Carry this owner-accepted coverage exception into Agent 05 QA without treating it as a blocking image defect.'},
  {'panel':'P11','defect':'present_unreadable_at_phone_size','evidence':'The pilot is slumped over the panel; direct body-to-panel contact remains partly obscured.','downstreamVerify':'Carry this owner-accepted aftermath coverage exception into Agent 05 QA without treating it as a blocking image defect.'},
  {'panel':'P15–P24','defect':'present_unreadable_at_phone_size','evidence':'The approved shots retain minor differences in the half-open doorway, rail and exterior rain across angles.','downstreamVerify':'Carry the owner-accepted minor door and rain variance into Agent 05 QA without treating it as a blocking image defect.'}
 ]})
owner_note=' Owner confirmed on 23 November 2026 that P05, P10, P11 and minor P15–P24 door/rain variance are approved coverage exceptions and do not block Agent 05 QA. The original technical findings remain documented; the owner requested no image or TTS re-roll.'
if owner_note not in images['notes']:images['notes'] += owner_note
d['render']={'status':'ready','notes':'Owner-approved exceptions and ending listening result recorded; requested P16–P17 timing and P18 roll are being assembled. Final render and technical verification pending.'}
p.write_text(json.dumps(d,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
