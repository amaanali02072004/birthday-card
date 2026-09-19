const openCard=document.getElementById('openCard');
const message=document.getElementById('message');
openCard.addEventListener('click',()=>message.scrollIntoView({behavior:'smooth'}));

document.getElementById('againBtn').addEventListener('click',()=>document.getElementById('top').scrollIntoView({behavior:'smooth'}));

const reveals=document.querySelectorAll('.reveal');
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.12});
reveals.forEach(x=>observer.observe(x));

const micBtn=document.getElementById('micBtn');
const skipBtn=document.getElementById('skipBtn');
const candles=document.querySelector('.candles');
const meterWrap=document.getElementById('meterWrap');
const meterBar=document.getElementById('meterBar');
const meterValue=document.getElementById('meterValue');
const hint=document.getElementById('hint');
let audioCtx, analyser, stream, raf, blowingSince=0, blown=false, micRequested=false;

async function requestMicPermission(){
  if(blown||micRequested)return;
  micRequested=true;
  try{
    stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:false,autoGainControl:false}});
    audioCtx=new (window.AudioContext||window.webkitAudioContext)();
    analyser=audioCtx.createAnalyser(); analyser.fftSize=2048; analyser.smoothingTimeConstant=.2;
    const source=audioCtx.createMediaStreamSource(stream); source.connect(analyser);
    meterWrap.hidden=false;
    micBtn.textContent='🎙️ Blow into your phone';
    hint.textContent='A steady, strong blow for about half a second will put out the candles.';
    analyse();
  }catch(err){
    hint.textContent='Microphone permission was not available. You can still use the tap option below.';
    micBtn.textContent='🎙️ Try microphone again';
  }finally{
    micRequested=false;
  }
}

function extinguish(){
  if(blown)return;
  blown=true;
  candles.classList.add('blown');
  meterBar.style.width='100%'; meterValue.textContent='100%';
  hint.textContent='Wish made. ✨ Happy 21st birthday!';
  micBtn.textContent='✨ Candles blown out';
  micBtn.disabled=true;
  if(stream) stream.getTracks().forEach(t=>t.stop());
  if(raf) cancelAnimationFrame(raf);
  setTimeout(()=>document.getElementById('gallery').scrollIntoView({behavior:'smooth'}),1100);
}

function analyse(){
  const data=new Uint8Array(analyser.fftSize);
  analyser.getByteTimeDomainData(data);
  let sum=0;
  for(const v of data){const n=(v-128)/128; sum+=n*n}
  const rms=Math.sqrt(sum/data.length);
  const strength=Math.min(100,Math.max(0,(rms-.018)*900));
  meterBar.style.width=`${strength}%`;
  meterValue.textContent=`${Math.round(strength)}%`;
  const now=performance.now();
  if(strength>55){ if(!blowingSince) blowingSince=now; if(now-blowingSince>520) extinguish(); }
  else if(strength<28) blowingSince=0;
  raf=requestAnimationFrame(analyse);
}

micBtn.addEventListener('click',requestMicPermission);
window.addEventListener('load',()=>{
  console.log('Console ~ navigator:', navigator)
  if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
    requestMicPermission();
  }
});
skipBtn.addEventListener('click',extinguish);
