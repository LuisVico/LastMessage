import { State } from './state.js';
import story from '../engine/story.json' assert {type:'json'};

const API_URL = 'http://localhost:3000';

const app = document.getElementById('app');
app.innerHTML = `
<div class="flex flex-col h-full bg-black text-white">
    <header class="bg-zinc-900/80 backdrop-blur p-3 flex items-center justify-between border-b border-zinc-800 shadow-md">
      <i id="home-btn" class="fas fa-chevron-left text-blue-500 text-xl w-8 cursor-pointer hover:text-blue-400 transition-colors"></i>
      <div class="text-center">
        <h1 class="font-semibold text-lg">Leo</h1>
        <p id="threat-level" class="text-xs text-green-500 transition-colors font-medium">Threat Level: Low</p>
      </div>
      <i id="info-btn" class="fas fa-info-circle text-blue-500 text-xl w-8 cursor-pointer hover:text-blue-400 transition-colors"></i>
    </header>
    <main id="chat-log" class="flex-1 p-4 overflow-y-auto flex flex-col space-y-4"></main>
    <footer id="input-area" class="p-3 border-t border-zinc-800">
      <div id="suggestions" class="flex gap-2 overflow-x-auto pb-3"></div>
      <div class="flex items-center gap-2 pt-2">
        <input id="free-input" type="text" placeholder="Message"
               class="flex-1 bg-zinc-800 text-white placeholder-zinc-400 px-4 py-2.5 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"/>
        <button id="send-btn" class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-2xl hover:bg-blue-500 transition-colors disabled:bg-zinc-700 disabled:text-zinc-500">
            <i class="fas fa-arrow-up"></i>
        </button>
      </div>
    </footer>
</div>
`;

const chatLog = document.getElementById('chat-log');
const suggestions = document.getElementById('suggestions');
const input = document.getElementById('free-input');
const sendBtn = document.getElementById('send-btn');

export function renderBubble({s, t, u, src}){
  const wrap = document.createElement('div');
  wrap.className = 'flex items-end max-w-[85%] opacity-0 animate-fade-in-up';

  if(s==='img'){
    wrap.className += ' justify-start';
    const img = document.createElement('img');
    img.src = src;
    img.className='rounded-2xl max-w-full';
    wrap.append(img);
  } else if(s==='l' || s==='sys'){
    if (s === 'l') {
        wrap.className += ' self-start';
        const bubble = document.createElement('div');
        bubble.className = 'bg-zinc-800 text-white p-3 rounded-t-2xl rounded-br-2xl';
        if(u) bubble.classList.add('font-semibold','text-red-400');
        bubble.textContent = t;
        wrap.append(bubble);
    } else { // s === 'sys'
        wrap.className += ' self-center w-full';
        const bubble = document.createElement('div');
        bubble.className = 'text-center text-xs text-zinc-500 my-2 italic';
        bubble.textContent = t;
        wrap.append(bubble);
    }
  } else { // s === 'p'
    wrap.className += ' self-end';
    const bubble = document.createElement('div');
    bubble.className='bg-blue-600 text-white p-3 rounded-t-2xl rounded-bl-2xl';
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
    btn.className='border border-blue-600 text-blue-400 px-4 py-1.5 rounded-full text-sm shrink-0 hover:bg-blue-600 hover:text-white transition-all';
    btn.textContent=ch.text;
    btn.onclick=()=>selectChoice(ch);
    suggestions.append(btn);
  });
}

async function selectChoice(choice){
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
    const restartBtn = document.createElement('button');
    restartBtn.textContent = 'GAME OVER. RESTART?';
    restartBtn.className = 'border border-red-500 text-red-500 px-4 py-2 rounded-full text-sm shrink-0 hover:bg-red-500 hover:text-white mt-4';
    restartBtn.onclick = () => window.location.reload();
    suggestions.innerHTML = '';
    suggestions.append(restartBtn);
  }
}

// subscriber keeps UI in sync (future)
State.subscribe(()=>{});

processNode();

document.getElementById('home-btn').onclick = () => {
    if (confirm('Are you sure you want to restart the game?')) {
        window.location.reload();
    }
};

document.getElementById('info-btn').onclick = () => {
    alert('This is a narrative-driven game where your choices matter. Try to keep Leo safe!\\n\\nMade with love by a human and an AI assistant.');
};
