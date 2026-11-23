"""Compare every decoded source frame after explicit conversion with the lossless master."""
import hashlib, json, subprocess
from pathlib import Path

p=Path(__file__).resolve().parent; root=p.parents[1]
folder=root/'out/004-tangan-pilot-kemarin'
source=folder/'skenario04-rec709-proof-source.mp4'; master=folder/'skenario04-rec709-proof-master.mp4'; delivery=folder/'skenario04-rec709-proof-review.mp4'
directory=p/'verification'; ref_file=directory/'rec709-proof-converted-reference.framemd5'; master_file=directory/'rec709-proof-master.framemd5'; report=directory/'rec709-fullstream-proof.json'
if any(x.exists() for x in (ref_file,master_file,report)):raise FileExistsError('Output exists; choose new report names')
conversion='scale=in_range=full:in_color_matrix=bt601:out_range=limited:out_color_matrix=bt709,format=yuv420p'
common=['-map','0:v:0','-fps_mode','passthrough','-pix_fmt','yuv420p','-f','framemd5','-']
ref_cmd=['ffmpeg','-v','error','-i',str(source),'-vf',conversion,*common]
master_cmd=['ffmpeg','-v','error','-i',str(master),*common]
def digest(path):
 h=hashlib.sha256()
 with path.open('rb') as f:
  for chunk in iter(lambda:f.read(1024*1024),b''):h.update(chunk)
 return h.hexdigest()
def run(command,destination):
 print(subprocess.list2cmdline(command),flush=True)
 output=subprocess.check_output(command,text=True)
 with destination.open('x',encoding='utf-8',newline='\n') as f:f.write(output)
 return [line.strip() for line in output.splitlines() if line and not line.startswith('#')]
ref=run(ref_cmd,ref_file); actual=run(master_cmd,master_file)
expected=json.loads((p/'manifest.json').read_text(encoding='utf-8'))['duration']
def item(line):
 fields=[x.strip() for x in line.split(',')]
 return {'stream':int(fields[0]),'dts':int(fields[1]),'pts':int(fields[2]),'duration':int(fields[3]),'size':int(fields[4]),'md5':fields[5]}
reference=[item(line) for line in ref]; frames=[item(line) for line in actual]
mismatches=[i for i,(a,b) in enumerate(zip(reference,frames)) if a!=b]
passed=len(reference)==len(frames)==expected and not mismatches
payload={'result':'pass' if passed else 'fail','scope':'All decoded 1080x1920 yuv420p frames compared by framemd5 after explicit source range and matrix conversion. Does not prove unknown source primaries or transfer.',
 'source':{'path':str(source.relative_to(root)),'sha256':digest(source)},'master':{'path':str(master.relative_to(root)),'sha256':digest(master)},'delivery':{'path':str(delivery.relative_to(root)),'sha256':digest(delivery)},
 'referenceCommand':ref_cmd,'masterCommand':master_cmd,'referenceFrameHashes':str(ref_file.relative_to(root)),'referenceFrameHashesSha256':digest(ref_file),
 'masterFrameHashes':str(master_file.relative_to(root)),'masterFrameHashesSha256':digest(master_file),'expectedFrames':expected,'referenceFrames':len(reference),'masterFrames':len(frames),'mismatchCount':len(mismatches),'firstMismatches':mismatches[:20]}
with report.open('x',encoding='utf-8') as f:json.dump(payload,f,indent=2);f.write('\n')
print(json.dumps(payload,indent=2),flush=True)
if not passed:raise SystemExit(1)
