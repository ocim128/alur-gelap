import json, math, wave, struct, subprocess, pathlib
p=pathlib.Path('episodes/001-kamar-terkunci'); out=pathlib.Path('out/001-kamar-terkunci'); m=json.loads((p/'manifest.json').read_text(encoding='utf-8'))
# Oscillator starts on the black-cut sample; synthesized locally.
with wave.open('public/assets/001-kamar-terkunci/blackout-sub.wav','wb') as w:
 w.setnchannels(1); w.setsampwidth(2); w.setframerate(48000)
 data=[int(16000*math.exp(-i/48000*3.6)*math.sin(2*math.pi*55*i/48000)) for i in range(48000)]
 w.writeframes(struct.pack('<%dh'%len(data),*data))
inputs=['public/'+m['narration']['asset'],'public/assets/001-kamar-terkunci/captor-muffled.wav']; filters=['[0:a]aresample=48000,asetpts=N/SR/TB,volume=1[narr]','[1:a]aresample=48000,asetpts=N/SR/TB,volume=0.8,adelay=8500|8500[captor]']; labels=['[narr]','[captor]']
for i,c in enumerate(m['soundCues']):
 asset='public/assets/001-kamar-terkunci/blackout-sub.wav' if c['name']=='blackout sub' else 'public/'+c['asset']; inputs.append(asset); idx=i+2; delay=round(c['at']*1000/30); trim=',atrim=duration=0.4' if c['name']=='rewind' else ''
 filters.append(f'[{idx}:a]aresample=48000,asetpts=N/SR/TB{trim},volume={c["gain"]},adelay={delay}|{delay}[c{idx}]'); labels.append(f'[c{idx}]')

for j,bed in enumerate(m['beds']):
 inputs.append('public/'+bed['asset']); idx=len(inputs)-1; delay=round(bed['at']*1000/30); length=bed['duration']/30
 filters.append(f'[{idx}:a]aresample=48000,asetpts=N/SR/TB,aloop=loop=-1:size=2147483647,atrim=duration={length},afade=t=in:st=0:d=0.2,afade=t=out:st={max(0,length-.2)}:d=0.2,volume={bed["gain"]},adelay={delay}|{delay}[bed{j}]'); labels.append(f'[bed{j}]')
filters.append(''.join(labels)+f'amix=inputs={len(labels)}:normalize=0:duration=longest,apad,atrim=duration=141,aresample=48000[mix]')
cmd=['ffmpeg','-y','-v','error']
for x in inputs:cmd+=['-i',x]
cmd+=['-filter_complex',';'.join(filters),'-map','[mix]','-c:a','pcm_s24le',str(out/'mix-raw.wav')]
subprocess.run(cmd,check=True)
