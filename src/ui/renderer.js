import { showAnalytics } from './analytics.js';

import { State } from './state.js';
import story from '../engine/story.json' assert {type:'json'};

const app = document.getElementById('app');
app.innerHTML = `
<header class="bg-zinc-900/80 backdrop-blur p-3 flex items-center justify-between border-b border-zinc-700">
  <i class="fas fa-chevron-left text-blue-500 text-xl w-8"></i>
  <div class="text-center">
    <div class="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center font-bold text-white text-xl mx-auto -mb-2">L</div>
    <h1 class="font-semibold text-white mt-2">Leo</h1>
    <p class="text-xs text-gray-400">home</p>
  </div>
  <i class="fas fa-info-circle text-blue-500 text-xl w-8"></i>
</header>
<main id="chat-log" class="flex-1 p-4 overflow-y-auto flex flex-col"></main>
<footer id="input-area" class="bg-zinc-900 p-3 border-t border-zinc-700">
  <div id="suggestions" class="flex space-x-2 overflow-x-auto pb-2"></div>
  <div class="flex items-center pt-2">
    <input id="free-input" type="text" placeholder="iMessage"
           class="flex-1 bg-zinc-800 text-white placeholder-gray-400 px-4 py-2 rounded-full focus:outline-none"/>
    <button id="send-btn" class="ml-2 text-3xl text-gray-500"><i class="fas fa-arrow-circle-up"></i></button>
  </div>
</footer>
`;

const chatLog = document.getElementById('chat-log');
const suggestions = document.getElementById('suggestions');
const input = document.getElementById('free-input');
const sendBtn = document.getElementById('send-btn');

export function renderBubble({s, t, u, src}){
  const wrap = document.createElement('div');
  if(s==='img'){
    wrap.className = 'flex justify-start';
    const img = document.createElement('img');
    img.src = src;
    img.className='rounded-2xl max-w-[75%]';
    wrap.append(img);
  }else if(s==='l' || s==='sys'){
    wrap.className = s==='l' ? 'flex justify-start' : 'text-center text-xs text-gray-500 my-2 italic';
    const bubble = document.createElement('div');
    bubble.className = s==='l'
      ? 'bg-zinc-800 text-white p-3 rounded-2xl max-w-[75%]'
      : '';
    if(u) bubble.classList.add('font-semibold','text-red-400');
    bubble.textContent = t;
    wrap.append(bubble);
  }else{
    wrap.className = 'flex justify-end';
    const bubble = document.createElement('div');
    bubble.className='bg-blue-500 text-white p-3 rounded-2xl max-w-[75%]';
    bubble.textContent = t;
    wrap.append(bubble);
  }
    State.transcript.push({s, t, src});
  chatLog.append(wrap);
  chatLog.scrollTop = chatLog.scrollHeight;
}

export function renderChoices(list){
  suggestions.innerHTML='';
  list.forEach(ch=>{
    const btn=document.createElement('button');
    btn.className='border border-blue-500 text-blue-500 px-4 py-1 rounded-full text-sm shrink-0 hover:bg-blue-500 hover:text-white';
    btn.textContent=ch.text;
    btn.onclick=()=>selectChoice(ch);
    suggestions.append(btn);
  });
}

function selectChoice(choice){
  State.update(st=>{
    st.panic = Math.max(0, Math.min(2, st.panic + (choice.panic||0)));
    if(choice.setFlag) st.flags.add(choice.setFlag);
    st.currentNodeId = choice.target;
  });
  renderBubble({s:'p', t:choice.text});
  State.timeline.push({panic: State.panic});
  processNode();
}

sendBtn.onclick=()=>handleFree();
input.onkeydown=e=>{ if(e.key==='Enter') handleFree(); };

async function handleFree(){
  const txt=input.value.trim();
  if(!txt) return;
  const node=story[State.currentNodeId];
  if(!node?.choices) return;
  const { IntentMatcher } = await import('./intent.js');
  const matcher=new IntentMatcher(node.choices);
  const matched=matcher.match(txt);
  if(matched){
    selectChoice({...matched, text:txt});
  }else{
    renderBubble({s:'l', t:"what? i don't get it"});
  }
  input.value='';
}

export async function processNode(){
  const node=story[State.currentNodeId];
  if(!node){ console.error('missing node'); return; }
  for(const m of node.messages){
    await new Promise(r=>setTimeout(r, m.s==='sys'?100:600));
    renderBubble(m);
    // panic-driven UI feedback
    if(State.panic>1){
      chatLog.classList.add('animate-heartbeat');
      navigator.vibrate?.([100, 50, 100]);
    }else{
      chatLog.classList.remove('animate-heartbeat');
    }
  }
  if(node.choices && node.choices.length){
    renderChoices(node.choices);
  }else{
    input.disabled=true;
    sendBtn.disabled=true;
  }
}

// subscriber keeps UI in sync (future)
State.subscribe(()=>{});

processNode();


document.getElementById('stats-btn').onclick = showAnalytics;
