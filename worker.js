// Minecraft 服务器审核系统
const QUESTIONS = require('./questions.json');

const DEFAULT_CONFIG = {
  title: "Minecraft 服务器审核",
  password: "审核通过",
  quiz: { count: 50, passRate: 80, timeLimit: 600 },
  style: {
    background: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1920",
    primaryColor: "#00ff88"
  }
};

function esc(s) { return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateHTML(c) {
  const html = '<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>' + esc(c.title) + '</title><link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet"><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:"Press Start 2P",monospace;min-height:100vh;display:flex;align-items:center;justify-content:center;background:url("' + c.style.background + '") center/cover fixed;color:#fff;padding:20px}body::before{content:"";position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);z-index:-1}.container{background:rgba(0,0,0,0.85);border-radius:16px;padding:40px;max-width:800px;width:100%;box-shadow:0 0 30px ' + c.style.primaryColor + '40;border:2px solid ' + c.style.primaryColor + '}.title{text-align:center;margin-bottom:30px;font-size:14px;color:' + c.style.primaryColor + ';text-shadow:0 0 10px ' + c.style.primaryColor + '}.typewriter{overflow:hidden;border-right:3px solid ' + c.style.primaryColor + ';white-space:nowrap;animation:typing 2s steps(30,end),blink-caret .75s step-end infinite;display:inline-block}@keyframes typing{from{width:0}to{width:100%}}@keyframes blink-caret{from,to{border-color:transparent}50%{border-color:' + c.style.primaryColor + '}}.btn{width:100%;padding:15px;border:none;border-radius:8px;background:linear-gradient(135deg,' + c.style.primaryColor + ',' + c.style.primaryColor + 'aa);color:#1a1a2e;font-family:inherit;font-size:12px;cursor:pointer;transition:all .3s;margin-top:20px}.btn:hover{transform:translateY(-2px)}.btn:disabled{background:#333;color:#666;cursor:not-allowed}.hidden{display:none}.input-group{margin-bottom:20px}.input-group label{display:block;margin-bottom:8px;font-size:10px;color:#aaa}.input-group input{width:100%;padding:15px;border:2px solid #333;border-radius:8px;background:rgba(255,255,255,.1);color:#fff;font-family:inherit;font-size:12px}.info-box{margin-top:30px;font-size:8px;color:#888;line-height:2}.progress-bar{background:#333;border-radius:10px;height:20px;margin-bottom:20px}.progress-fill{background:' + c.style.primaryColor + ';height:100%;transition:width .3s;display:flex;align-items:center;justify-content:center;font-size:8px;color:#1a1a2e}.timer{text-align:center;font-size:20px;color:#ff6b6b;margin-bottom:20px}.timer.warning{animation:pulse .5s infinite}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}.question-box{background:rgba(255,255,255,.05);border-radius:12px;padding:20px;margin-bottom:20px}.question-num{font-size:10px;color:#888;margin-bottom:10px}.question-text{font-size:12px;line-height:1.8;margin-bottom:20px}.options{display:flex;flex-direction:column;gap:10px}.option{background:rgba(255,255,255,.1);border:2px solid #333;border-radius:8px;padding:15px;cursor:pointer;transition:all .2s;font-size:10px}.option:hover{border-color:' + c.style.primaryColor + '}.option.selected{border-color:' + c.style.primaryColor + ';background:rgba(0,255,136,.2)}.result-box{text-align:center;padding:40px}.score{font-size:48px;color:' + c.style.primaryColor + ';margin:20px 0}.score.failed{color:#ff6b6b}.password-display{font-size:18px;text-align:center;padding:20px;background:rgba(0,255,136,.1);border-radius:8px;margin:20px 0;letter-spacing:3px;color:' + c.style.primaryColor + '}</style></head><body><div class="container"><div id="startPage"><h1 class="title"><span class="typewriter">' + esc(c.title) + '</span></h1><div class="input-group"><label>请输入你的 QQ 号</label><input type="text" id="qqNumber" placeholder="例如: 123456789" maxlength="11"></div><button class="btn" onclick="startQuiz()">开始答题</button><div class="info-box"><p>共 ' + c.quiz.count + ' 道单选题</p><p>题库: 200 道随机抽取</p><p>时间限制: ' + Math.floor(c.quiz.timeLimit/60) + ' 分钟</p><p>通过分数: ' + c.quiz.passRate + '%</p></div></div><div id="quizPage" class="hidden"><h1 class="title">' + esc(c.title) + '</h1><div class="timer" id="timer">' + Math.floor(c.quiz.timeLimit/60) + ':00</div><div class="progress-bar"><div class="progress-fill" id="progress" style="width:0%">0/' + c.quiz.count + '</div></div><div class="question-box"><div class="question-num" id="questionNum">第 1 题 / 共 ' + c.quiz.count + ' 题</div><div class="question-text" id="questionText">加载中...</div><div class="options" id="options"></div></div><button class="btn" id="nextBtn" onclick="nextQuestion()" disabled>下一题</button></div><div id="resultPage" class="hidden"><div class="result-box"><h1 class="title">答题结果</h1><div class="score" id="score">0%</div><p id="resultText" style="font-size:10px;margin-bottom:20px"></p><div id="passwordBox" class="hidden"><p style="font-size:10px;margin-bottom:10px">验证密码：</p><div class="password-display" id="password"></div></div><button class="btn" onclick="location.reload()">重新答题</button></div></div></div><script>var CONFIG=' + JSON.stringify(c) + ';var Q=[],cur=0,corr=0,sel=null,TL=' + c.quiz.timeLimit + ',tmr=null;async function startQuiz(){var qq=document.getElementById("qqNumber").value.trim();if(!qq||!/^\d{5,11}$/.test(qq)){alert("请输入正确的QQ号");return}document.getElementById("startPage").classList.add("hidden");document.getElementById("quizPage").classList.remove("hidden");try{var r=await fetch("/api/quiz/start");var d=await r.json();Q=d.questions;showQuestion();startTimer()}catch(e){alert("网络错误");location.reload()}}function showQuestion(){var q=Q[cur];document.getElementById("questionNum").textContent="第 "+(cur+1)+" 题 / 共 "+Q.length+" 题";document.getElementById("questionText").textContent=q.question;var opts=document.getElementById("options");opts.innerHTML="";q.options.forEach(function(o,i){var div=document.createElement("div");div.className="option";div.textContent=String.fromCharCode(65+i)+". "+o;div.onclick=function(){selectOption(i)};opts.appendChild(div)});document.getElementById("progress").style.width=(cur/Q.length*100)+"%";document.getElementById("progress").textContent=cur+"/"+Q.length;document.getElementById("nextBtn").disabled=true;sel=null}function selectOption(idx){sel=idx;document.querySelectorAll(".option").forEach(function(el,i){el.classList.toggle("selected",i===idx)});document.getElementById("nextBtn").disabled=false}function nextQuestion(){if(sel===null)return;if(sel===Q[cur].answer)corr++;cur++;if(cur>=Q.length){endQuiz();return}showQuestion()}function startTimer(){tmr=setInterval(function(){TL--;var m=Math.floor(TL/60),s=TL%60;document.getElementById("timer").textContent=m+":"+(s<10?"0":"")+s;if(TL<=60)document.getElementById("timer").classList.add("warning");if(TL<=0){clearInterval(tmr);endQuiz()}},1000)}function endQuiz(){clearInterval(tmr);document.getElementById("quizPage").classList.add("hidden");document.getElementById("resultPage").classList.remove("hidden");var score=Math.round(corr/Q.length*100);var passed=corr>=Math.ceil(Q.length*CONFIG.quiz.passRate/100);document.getElementById("score").textContent=score+"%";document.getElementById("score").classList.toggle("failed",!passed);document.getElementById("resultText").textContent=passed?"恭喜通过！答对 "+corr+"/"+Q.length+" 题":"未通过，答对 "+corr+"/"+Q.length+" 题";if(passed){document.getElementById("passwordBox").classList.remove("hidden");document.getElementById("password").textContent=CONFIG.password}}document.getElementById("qqNumber").addEventListener("keypress",function(e){if(e.key==="Enter")startQuiz()})</script></body></html>';
  return html;
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const config = env.CONFIG ? JSON.parse(env.CONFIG) : DEFAULT_CONFIG;
    
    if (url.pathname === "/" || url.pathname === "/index.html") {
      return new Response(generateHTML(config), { headers: { "Content-Type": "text/html; charset=utf-8" }});
    }
    
    if (url.pathname === "/api/quiz/start") {
      const shuffled = shuffle(QUESTIONS);
      const selected = shuffled.slice(0, config.quiz.count);
      return Response.json({ questions: selected });
    }
    
    return new Response("Not Found", { status: 404 });
  }
};
