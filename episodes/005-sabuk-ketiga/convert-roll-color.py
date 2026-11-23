"""Encode two fresh Rec.709 files directly from retained sRGB/JFIF source frames."""
import json, subprocess, sys
from pathlib import Path
p=Path(__file__).resolve().parent; root=p.parents[1];sys.path.insert(0,str(root/'scripts'))
from verify_export_common import sha256_file, write_report
source=Path(sys.argv[1]); master=Path(sys.argv[2]); delivery=Path(sys.argv[3]); report=Path(sys.argv[4]); source_manifest=Path(sys.argv[5])
for target in (master,delivery,report,source_manifest):
 if target.exists():raise FileExistsError(f'Output exists: {target}')
fps=30;count=4693;files=[source/f'element-{i:04d}.jpeg' for i in range(count)]
if any(not f.is_file() for f in files) or len(list(source.glob('element-*.jpeg')))!=count:raise RuntimeError('Source sequence must contain exactly frames 0–4692')
browser=root/'node_modules/@remotion/renderer/dist/open-browser.js'
if '--force-color-profile=srgb' not in browser.read_text(encoding='utf-8'):raise RuntimeError('Renderer does not explicitly force the expected sRGB browser profile')
probes=[]
for idx in (0,6,3646,3832,3893,4658):
 info=json.loads(subprocess.check_output(['ffprobe','-v','error','-select_streams','v:0','-show_entries','stream=pix_fmt,color_range,color_space,width,height','-of','json',str(files[idx])],text=True))['streams'][0]
 if (info.get('pix_fmt'),info.get('color_range'),info.get('color_space'),info.get('width'),info.get('height'))!=('yuvj420p','pc','bt470bg',1080,1920):raise RuntimeError(f'Ambiguous JPEG source at {idx}: {info}')
 probes.append({'frame':idx,'stream':info})
hashes=[{'frame':i,'sha256':sha256_file(f),'bytes':f.stat().st_size} for i,f in enumerate(files)]
source_manifest.write_text(json.dumps({'directory':str(source),'fps':fps,'count':count,'sourceFrames':hashes},indent=2)+'\n',encoding='utf-8')
source_pattern=str(source/'element-%04d.jpeg');audio=str(root/'public/assets/005-sabuk-ketiga/assembly-mix.wav')
filter_string='zscale=matrixin=bt470bg:rangein=full:primariesin=bt709:transferin=iec61966-2-1:matrix=bt709:range=limited:primaries=bt709:transfer=bt709,format=yuv420p'
commands=[]
for output,quality,audio_rate in ((master,'18','192k'),(delivery,'28','128k')):
 cmd=['ffmpeg','-hide_banner','-loglevel','error','-n','-framerate',str(fps),'-start_number','0','-i',source_pattern,'-i',audio,
      '-map','0:v:0','-map','1:a:0','-frames:v',str(count),'-vf',filter_string,'-c:v','libx264','-preset','veryfast','-crf',quality,
      '-pix_fmt','yuv420p','-color_range','tv','-colorspace','bt709','-color_primaries','bt709','-color_trc','bt709',
      '-c:a','aac','-b:a',audio_rate,'-ac','1','-ar','48000','-movflags','+faststart',str(output)]
 commands.append(cmd);subprocess.run(cmd,check=True)
ffmpeg_version=subprocess.check_output(['ffmpeg','-version'],text=True).splitlines()[0]
result={'source':{'directory':str(source),'manifest':str(source_manifest),'manifestSha256':sha256_file(source_manifest),
 'description':'Chromium forced to sRGB; JPEG/JFIF full-range 8-bit BT.601-matrix YCbCr with sRGB transfer and BT.709/sRGB primaries.',
 'rendererLaunchFile':str(browser),'rendererLaunchFileSha256':sha256_file(browser),'frameProbes':probes},
 'ffmpegVersion':ffmpeg_version,'filter':filter_string,'commands':commands,'master':{'path':str(master),'sha256':sha256_file(master)},
 'audio':{'path':audio,'sha256':sha256_file(audio)},'note':'Both outputs are encoded directly from the retained JPEG source, with an explicit full-range BT.601-matrix/sRGB-transfer to limited-range BT.709 conversion before BT.709 tags.'}
write_report(result,report,delivery);print(json.dumps({'master':result['master'],'target':str(delivery),'targetSha256':sha256_file(delivery),'sourceManifestSha256':result['source']['manifestSha256'],'filter':filter_string},indent=2))
