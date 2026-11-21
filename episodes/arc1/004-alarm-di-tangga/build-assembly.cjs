const fs = require('fs');
const dir = 'episodes/004-alarm-di-tangga';
const raw = JSON.parse(fs.readFileSync(`${dir}/narration-timestamps.json`, 'utf8')).words;
const words = [];
for (const source of raw) {
  const a = {...source};
  if (a.word.toLowerCase() === 'diruko') {
    const mid = a.start + (a.end - a.start) * .35;
    words.push({...a, word: 'di', end: mid}, {...a, word: 'ruko', start: mid});
  } else {
    a.word = a.word.replace(/^center([.,!?]?)$/i, 'senter$1').replace(/^tersengol([.,!?]?)$/i, 'tersenggol$1');
    words.push(a);
  }
}
const captions=[]; let group=[];
for (const a of words) {
  group.push(a);
  if (group.length === 4 || /[.,!?]$/.test(a.word) || a === words.at(-1)) {
    const tagged=group.map(x=>({text:x.word.toUpperCase(),startMs:Math.round(x.start*1000),endMs:Math.round(x.end*1000),...(/^(RUKO|TANGGA|BOTOL|SENTER|BALKON|PINTU|PENANDA)/i.test(x.word)?{color:'yellow'}:/^(GADIS|BERGESEK)/i.test(x.word)?{color:'red'}:{})}));
    captions.push({startMs:tagged[0].startMs,endMs:tagged.at(-1).endMs,timestampMs:null,confidence:null,words:tagged}); group=[];
  }
}
fs.writeFileSync(`${dir}/captions.json`,JSON.stringify(captions,null,2)+'\n');
const fps=30, f=s=>Math.round(s*fps), duration=2088, jolt=2053;
const asset=n=>`assets/004-alarm-di-tangga/${n}`;
const starts=[0,14.1,19.8,23.5,26,29,34.4,44.8,50.9,61.5].map(f);
const names=['Ruko kosong','Tangga belakang','Jendela balkon','Botol dalam tas','Memasang penanda','Jejak di atas penanda','Menunggu menghadap pintu','Suara dekat','Botol di samping sepatu','Gadis di sudut'];
const evidence=['Pengemudi di depan ruko','Pengemudi memilih tangga belakang','Pengemudi memeriksa jendela','Pengemudi membuka tas','Pengemudi memasang botol','Pengemudi memeriksa tangga','Pengemudi duduk menghadap pintu','Pengemudi meraih senter','Pengemudi melihat botol di samping sepatu','Gadis di sudut kamar'];
const scenes=starts.map((start,i)=>{
 const len=(starts[i+1]??duration)-start, hud=[];
 if(i===0){hud.push({id:'clock-entry',type:'timestampBadge',text:'HARI 2 • 21:00',at:0,duration:115,revealFrames:12},{id:'entry-supplies',type:'supplyChecklist',box:{x:.54,y:.38,width:.42,height:.22},at:65,duration:120,revealFrames:18,items:[{label:'AIR',value:.8,display:'80%'},{label:'BATERAI',value:.3,display:'30%'}]},{id:'rule',type:'tacticalCallout',text:'JAUHI LANTAI SATU',box:{x:.08,y:.29,width:.84,height:.08},at:10,duration:48,revealFrames:8});}
 if(i===6)hud.push({id:'exit-supplies',type:'supplyChecklist',box:{x:.54,y:.35,width:.42,height:.22},at:25,duration:110,revealFrames:18,items:[{label:'AIR',value:.7,display:'70%'},{label:'BATERAI',value:.25,display:'25%'}]});
 if(i===7)hud.push({id:'clock-exit',type:'timestampBadge',text:'HARI 2 • 23:30',at:0,duration:110,revealFrames:12});
 const reframes=[]; for(let t=66;t<=len-18;t+=64)reframes.push({at:t,duration:13,scale:reframes.length%2?1:1.055,x:reframes.length%2?0:-12,y:reframes.length%2?0:8});
 return {id:`panel-${String(i+1).padStart(2,'0')}`,name:names[i],at:start,plate:asset(`panel-${String(i+1).padStart(2,'0')}.webp`),camera:{from:{scale:1.02,x:0,y:0},to:{scale:1.07,x:0,y:-8}},reframes,characters:{mode:'baked'},hud,editorial:{protagonist:i===9?'absent':([2,4,5,7,8].includes(i)?'reaction':'visible'),purpose:i===9?'threat-proximity':'character-emotion',evidence:evidence[i]},cues:[]};
});
scenes[7].cues.push({name:'Gesekan botol dekat sepatu',asset:'sfx/prepared/ep004-bottle-scrape.wav',at:f(49.0)-starts[7],duration:42,gain:.22,fadeOut:6},{name:'Napas pengemudi',asset:'sfx/prepared/ep004-survivor-breath.wav',at:f(50.4)-starts[7],duration:42,gain:.12,fadeOut:5});
scenes[9].cues.push({name:'Kinetic stinger',asset:'sfx/prepared/climax-stinger.wav',at:jolt-starts[9],duration:27,gain:.5,fadeOut:3},{name:'Metallic edge',asset:'sfx/prepared/metal-resonance.wav',at:jolt-starts[9],duration:22,gain:.16,fadeOut:7});
const art={}; for(let i=1;i<=10;i++)art[asset(`panel-${String(i).padStart(2,'0')}.webp`)]='gritty-dark-anime-comic';art[asset('panel-final-jolt.webp')]='gritty-dark-anime-comic';
const manifest={schemaVersion:2,id:'Arc01Episode04',arcEpisode:4,characterSheets:['assets/characters/arc-01-driver/sheet.png','assets/characters/arc-01-passenger-teen/sheet.png'],fps,duration,captions:'captions.json',openingTitle:'JANGAN TIDUR DI BAWAH',narration:{asset:asset('narration-prepared.mp3'),at:0,duration:2048,gain:1},effectBusGain:1,beds:[{name:'Udara malam sebelum gesekan',asset:'sfx/prepared/night-air.wav',at:0,duration:f(47),gain:.065,fadeIn:20,fadeOut:20,loop:true},{name:'Udara malam sesudah gesekan',asset:'sfx/prepared/night-air.wav',at:f(51.9),duration:Math.round(68.26*fps)-f(51.9),gain:.045,fadeIn:20,fadeOut:10,loop:true},{name:'Rising dread',asset:'sfx/prepared/climax-riser.wav',at:f(64.45),duration:114,gain:.13,fadeIn:8,fadeOut:4}],art:{styleId:'gritty-dark-anime-comic',rasterAssets:art},script:{format:'survival-tactics-curiosity-gap',hook:{at:0,line:'Sembunyi di ruko kosong, jauhi lantai satu.'},promise:{at:90,line:'Lantai atas memberimu waktu istirahat, asal kamu tahu siapa yang bisa mencapai pintumu.',openLoop:'Siapa yang sudah mencapai pintu?'},tactics:{at:360,steps:[{number:1,at:f(14.27),line:'Jangan tarik pintu besi.',detail:'Naik lewat tangga belakang dan cari jendela balkon.'},{number:2,at:f(23.61),line:'Taruh botol kosong bertutup merah di anak tangga.',detail:'Botol menjadi penanda orang naik.'},{number:3,at:f(34.49),line:'Duduk menghadap pintu.',detail:'Matikan layar ponsel dan pegang senter.'}]},ending:{at:1650,twistAt:starts[9],payoff:'Gadis sudah di kamar dan mengembalikan botol di samping sepatu.'}},scenes,tensionRamp:{startSec:64.45,endSec:68.26,extraScale:.075,vignetteStrength:.48},finalJolt:{triggerSec:jolt/fps,durationSec:.9,joltImageSrc:asset('panel-final-jolt.webp'),zoomFrom:1,zoomTo:1.18,shakePx:16,shakeDecayMs:320,flashFrames:2,rgbSplitPx:8,blackoutSec:8/30}};
fs.writeFileSync(`${dir}/manifest.json`,JSON.stringify(manifest,null,2)+'\n');
