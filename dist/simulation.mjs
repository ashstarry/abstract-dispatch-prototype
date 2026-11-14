import {CHARS,LEVELS,UPGRADES} from './campaign.mjs';
import {BANTER,SAFE_LINES,PAIR_LINES} from './legacy.mjs';
const copy=v=>structuredClone(v);
export function newCampaign(){return {version:2,unlocked:0,stars:[0,0,0,0,0,0],bank:0,upgrades:[],seenIntro:false,completed:false,records:{},run:null};}
export function newRun(index,campaign=newCampaign(),difficulty='standard'){
 const l=LEVELS[index],gear=campaign.upgrades||[],bonus=difficulty==='relaxed'?2:0;
 return {level:index,difficulty,maxTurns:l.turns+bonus,turn:0,started:false,finished:false,passed:false,duty:[...l.defaultCrew],budget:l.budget+(difficulty==='relaxed'?3:0),tools:l.tools+(gear.includes('tools')?2:0),energy:l.energy+(gear.includes('radio')?1:0),maxEnergy:6+(gear.includes('radio')?1:0),panic:0,effect:0,damage:0,completed:0,failed:0,spent:0,gear:[...gear],shield:0,forecastUntil:0,blackoutUntil:0,jamUntil:0,rewindUsed:false,checkpoint:null,history:[],log:[],events:[],actors:Object.fromEntries(CHARS.map(c=>[c.id,{fatigue:0,returnUntil:0,cooldown:0}])),jobs:l.jobs.map(q=>({...copy(q),deadline:q.deadline+bonus,status:q.release===0?(q.dependencies.length?'locked':'waiting'):'queued',crew:[],mode:null,travelLeft:0,workLeft:0,plan:null,boost:{},retryUsed:false,revealed:!q.hidden,dispatchedAt:null}))};
}
export function actorJob(s,id){return s.jobs.find(j=>j.status==='active'&&j.crew.includes(id));}
export function available(s,id){return s.duty.includes(id)&&!actorJob(s,id)&&s.actors[id].returnUntil<=s.turn&&s.actors[id].fatigue<6;}
export function dependenciesMet(s,j){return j.dependencies.every(id=>s.jobs.find(q=>q.id===id)?.status==='done');}
export function start(s){if(s.started||s.finished)return '这一班已经开始。';if(s.duty.length!==LEVELS[s.level].squad)return `本关要排${LEVELS[s.level].squad}人。`;if(s.duty.some(id=>!LEVELS[s.level].unlock.includes(id)))return '有人还未加入队伍。';s.started=true;s.log.push({at:0,who:'dispatch',text:'频道接通。先救现场，再整节目。'});return null;}
export function plan(s,j,ids,mode){
 const r=j[mode],stats={force:0,tech:0,talk:0,obs:0},notes=[];let work=r.work,fee=r.fee,tools=r.tools,damage=r.damage;
 for(const id of ids){const c=CHARS.find(c=>c.id===id);if(!c)continue;const tired=s.actors[id].fatigue>=3?1:0;for(const k in stats)stats[k]+=Math.max(0,c.stats[k]-tired);if(tired)notes.push(c.name+'疲劳：属性-1');}
 if(ids.includes('he')&&j.tags.includes('设备')){stats.tech++;notes.push('技术专长 +1');}
 if(ids.includes('tim')&&j.tags.includes('设备')){stats.obs+=2;notes.push('镜头侦察：观察 +2');}
 if(ids.includes('geng')&&mode==='chaos'){stats.force+=2;stats.tech++;damage++;notes.push('功能过剩：力气+2 / 技术+1 / 损失+1');}
 if(ids.includes('dong')&&j.tags.includes('人群')){stats.talk+=2;if(mode==='safe')work++;notes.push('文化控场：口才+2'+(mode==='safe'?' / 多1拍':''));}
 if(ids.includes('li')){fee--;if(j.tags.includes('人群'))stats.talk++;notes.push('议价：费用-1');}
 if(ids.includes('da')&&mode==='safe'){stats.obs+=2;work++;notes.push('先看一眼：观察+2 / 多1拍');}
 if(ids.includes('wang')&&j.tags.includes('验收')){stats.obs+=2;notes.push('独立评测：观察+2');}
 if(ids.includes('wang')&&ids.includes('luo')){stats.tech+=2;work++;notes.push('互相质检：技术+2 / 先吵1拍');}
 if(j.boost.geng&&ids.includes('geng')){stats.force+=3;stats.tech++;damage++;notes.push('原型机：力气+3 / 技术+1 / 损失+1');}
 if(j.boost.intel){stats.obs+=3;notes.push('现场情报：观察+3');}
 if(j.boost.discount){fee-=2;tools--;notes.push('提前采购：费用-2 / 工具-1');}
 if(s.blackoutUntil>s.turn&&j.tags.includes('设备')){work++;notes.push('系统低功耗：多1工作拍');}
 const req={...r.req};if(j.hidden&&!j.revealed){const k=Object.keys(req).includes('obs')?'obs':Object.keys(req)[0];req[k]++;}
 const missing=Object.entries(req).filter(([k,v])=>stats[k]<v).map(([k,v])=>({stat:k,need:v,have:stats[k]}));
 const blocked=!dependenciesMet(s,j)&&!r.bypass;
 const success=ids.length>0&&!missing.length&&!blocked;
 if(!success&&ids.includes('luo'))damage=Math.max(0,Math.max(2,damage)-2);else if(!success)damage=Math.max(2,damage);
 const travel=1,ret=Math.max(0,1+(s.jamUntil>s.turn?1:0)-(s.gear.includes('van')?1:0));
 return {mode,name:r.name,stats,req,known:j.revealed,missing,blocked,success,work:Math.max(1,work),travel,returnTime:ret,duration:travel+Math.max(1,work),fee:Math.max(0,fee),tools:Math.max(0,tools),damage,notes,pay:success?j.pay:0};
}
export function dispatch(s,id,ids,mode){
 if(!s.started||s.finished)return {error:'先开始这一班。'};
 const j=s.jobs.find(q=>q.id===id);if(!j||!['waiting','locked'].includes(j.status))return {error:'这单现在不能派人。'};
 if(!['safe','chaos'].includes(mode))return {error:'先选处理方案。'};
 if(ids.length<1||ids.length>2||new Set(ids).size!==ids.length)return {error:'每单派1到2人。'};
 if(ids.some(id=>!available(s,id)))return {error:'有人在现场、返程或需要休息。'};
 if(s.jobs.filter(q=>q.status==='active').length>=LEVELS[s.level].slots)return {error:'出勤线路占满了，先等一队回来。'};
 const p=plan(s,j,ids,mode);if(p.blocked)return {error:'先完成前置任务，或换成不依赖它的放飞方案。'};
 if(s.budget<p.fee)return {error:'预算不足。换方案，或让李加棋议价。'};
 if(s.tools<p.tools)return {error:'工具包不足，可以在工具栏采购。'};

 s.budget-=p.fee;s.spent+=p.fee;s.tools-=p.tools;j.plan=p;j.crew=[...ids];j.mode=mode;j.workLeft=p.work;j.travelLeft=p.travel;j.status='active';j.dispatchedAt=s.turn;
 s.log.push({at:s.turn,who:ids[0],text:`${j.title}，接了。`});return {job:j};
}
export function recall(s,id){const j=s.jobs.find(q=>q.id===id);if(j?.status!=='active')return '这队不在出勤。';for(const c of j.crew)s.actors[c].returnUntil=s.turn+j.plan.returnTime;j.crew=[];j.status=dependenciesMet(s,j)?'waiting':'locked';j.plan=null;j.workLeft=0;j.travelLeft=0;s.log.push({at:s.turn,who:'dispatch',text:'已召回。费用和工具不退，人员还得返程。'});return null;}
function lines(s,j,success){const crew=j.crew;
 if(!success)return [[crew[0],'我以为问题不大。'],['dispatch','你以为对了，问题是很大。']];
 if(j.id==='lab-door')return [[crew[0],'门开了。假人也出来了。'],['dispatch','怎么还带了个工牌？'],[crew[0],'你说模拟上班，我给他补上了。']];
 if(j.id==='lab-crate')return [[crew[0],'工具箱搬回来了。'],['dispatch','锁没给我拆了吧？'],[crew[0],'没拆！今天主要是考核你。']];
 if(crew.includes('wang')&&crew.includes('luo'))return [['wang','这套方法不严谨。'],['luo','你先把活干了再严谨。'],['dispatch','行了！报告留着写报销！']];
 const combo=PAIR_LINES.find(p=>p.ids.every(id=>crew.includes(id)));if(combo&&j.mode==='chaos')return combo.lines;
 if(j.mode==='chaos'&&BANTER[j.joke]?.every(([id])=>id==='dispatch'||crew.includes(id)))return BANTER[j.joke];
 const safe=SAFE_LINES[j.joke];if(j.mode==='safe'&&safe)return [[crew[0],safe[0]],['dispatch',safe[1]],[crew[1]||crew[0],safe[2]]];
 return [[crew[0],CHARS.find(c=>c.id===crew[0]).quip],['dispatch',j.type==='boss'?'规程停了。今晚终于轮到人说话了。':'人没事吧？'],[crew[1]||crew[0],j.plan.damage?'人没事，东西有点事。':'没事。现在能下班吗？']];
}
function finishJob(s,j,ok,out){
 const crew=[...j.crew],damage=j.plan.damage,pay=ok?j.pay:0;
 j.status=ok?'done':'failed';s.completed+=ok?1:0;s.failed+=ok?0:1;s.damage+=damage;s.effect+=j.mode==='chaos'?3:1;
 const balance=s.budget+pay-damage;if(balance<0)s.panic+=Math.min(15,-balance*3);s.budget=Math.max(0,balance);
 if(ok){s.tools+=j.toolReward;s.panic=Math.max(0,s.panic-4);}else s.panic+=j.critical?22:15;
 for(const id of crew){s.actors[id].fatigue=Math.min(6,s.actors[id].fatigue+2);s.actors[id].returnUntil=s.turn+j.plan.returnTime;}
 const result={kind:'result',id:j.id,title:j.title,type:j.type,joke:j.joke,mode:j.mode,success:ok,crew,damage,pay,at:s.turn,lines:lines(s,j,ok)};
 s.history.push(result);s.log.push({at:s.turn,who:'dispatch',text:ok?`${j.title}已处理${damage?'，维修费'+damage+'。':'，这回没赔。'}`:`${j.title}处理失败。还有补救机会。`});out.push(result);
}
function refresh(s){for(const j of s.jobs){if(j.status==='queued'&&j.release<=s.turn)j.status=dependenciesMet(s,j)?'waiting':'locked';else if(j.status==='locked'&&dependenciesMet(s,j))j.status='waiting';}}
function bossCounter(s,j,out){if(j.type!=='boss'||j.boost.countered||j.travelLeft>0||j.plan.work-j.workLeft<Math.ceil(j.plan.work/2))return;j.boost.countered=true;if(s.shield>0){s.shield--;out.push({kind:'event',blocked:true,text:'独立复核挡住了规程的反扑。控制台继续拆！'});}else{j.workLeft+=2;j.plan.work+=2;j.plan.duration+=2;s.energy=Math.max(0,s.energy-1);out.push({kind:'event',blocked:false,text:'规程启用表格风暴：控制台追加2格工作，指挥点-1！'});}s.log.push({at:s.turn,who:'system',text:out.at(-1).text});}
function settle(s){const l=LEVELS[s.level];const allDone=s.jobs.every(j=>j.status==='done');const goal=s.completed>=l.minComplete&&s.jobs.filter(j=>j.critical).every(j=>j.status==='done')&&s.panic<100;const finalCore=l.id===5&&s.jobs.find(j=>j.id==='s5-core')?.status==='done';if(s.turn>=(s.maxTurns??l.turns)||s.panic>=100||allDone||(finalCore&&goal)){s.finished=true;s.passed=goal;}}
export function finishNow(s){s.finished=true;s.passed=s.completed>=LEVELS[s.level].minComplete&&s.jobs.filter(j=>j.critical).every(j=>j.status==='done')&&s.panic<100;}
export function tick(s){
 if(!s.started||s.finished)return [];
 const snapshot=copy({...s,checkpoint:null});s.checkpoint=snapshot;s.turn++;const out=[];
 for(const id of s.duty){if(!actorJob(s,id)&&s.actors[id].returnUntil<=s.turn)s.actors[id].fatigue=Math.max(0,s.actors[id].fatigue-(s.gear.includes('break')?2:1));}
 if(s.turn%3===0)s.energy=Math.min(s.maxEnergy,s.energy+1);
 for(const ev of LEVELS[s.level].events.filter(e=>e.at===s.turn)){
  if(s.shield>0){s.shield--;out.push({kind:'event',text:'独立复核生效：这次系统恶化被挡住了。',blocked:true});}
  else {if(ev.kind==='blackout')s.blackoutUntil=s.turn+ev.duration;if(ev.kind==='jam')s.jamUntil=s.turn+ev.duration;if(ev.kind==='drain')s.energy=Math.max(0,s.energy-ev.amount);if(ev.kind==='surge'){const target=s.jobs.filter(j=>['waiting','locked','active'].includes(j.status)).sort((a,b)=>a.deadline-b.deadline)[0];if(target)target.deadline=Math.max(s.turn+1,target.deadline-ev.amount);}out.push({kind:'event',text:ev.text,blocked:false});}
  s.events.push({...ev,handled:true});s.log.push({at:s.turn,who:'system',text:out.at(-1).text});
 }
 const before=s.jobs.filter(j=>j.status==='queued').map(j=>j.id);refresh(s);const released=s.jobs.filter(j=>before.includes(j.id)&&j.status!=='queued');if(released.length)out.push({kind:'arrival',text:released.map(j=>j.title).join(' / ')});
 for(const j of s.jobs){
  if(j.status==='active'){
   if(j.travelLeft>0)j.travelLeft--;else j.workLeft--;bossCounter(s,j,out);
   if(j.travelLeft===0&&j.workLeft<=0)finishJob(s,j,j.plan.success,out);
   else if(s.turn>=j.deadline)finishJob(s,j,false,out);
  }else if(['waiting','locked'].includes(j.status)&&s.turn>=j.deadline){j.status='expired';s.failed++;s.panic+=j.critical?22:15;s.log.push({at:s.turn,who:'dispatch',text:j.title+'超时撤单。'});out.push({kind:'expired',id:j.id,title:j.title,text:j.title+'超时了。罗咏皓可以尝试售后兜底。'});}
 }
 refresh(s);settle(s);return out;
}
export function skill(s,actorId,targetId){
 const c=CHARS.find(c=>c.id===actorId),a=s.actors[actorId],ability=c?.ability,j=s.jobs.find(q=>q.id===targetId),out=[];
 if(!s.started||s.finished)return {error:'技能只能在任务中使用。'};if(!c||!s.duty.includes(actorId))return {error:'这位今天没值班。'};
 if(actorId==='da'&&s.rewindUsed)return {error:'本关的回溯已经用过了。'};if(a.cooldown>s.turn)return {error:`技能还差${a.cooldown-s.turn}拍。`};if(s.energy<ability.cost)return {error:'指挥点不足，每3拍恢复1点。'};
 if(actorId==='da'){
  if(s.rewindUsed||!s.checkpoint)return {error:'回溯需要先推进一拍，而且本关只能用一次。'};
  const restored=copy(s.checkpoint),energy=s.energy-ability.cost;Object.assign(s,restored);s.energy=Math.max(0,energy);s.rewindUsed=true;s.checkpoint=null;s.actors.da.cooldown=999;s.log.push({at:s.turn,who:'da',text:'刚才那波不算。回到上一拍，重新排。'});return {out:[{kind:'rewind',text:'已回到上一拍。结果、费用和人员位置一并回退。'}]};
 }
 if(actorId==='wang'){s.shield++;s.forecastUntil=s.turn+3;}
 else {
  if(!j)return {error:'先在地图上选一单。'};
  if(actorId==='he'){
   if(j.status!=='active'||!j.crew.includes('he')||j.travelLeft>0)return {error:'何彤学要先到自己负责的现场，才能赶工。'};if(s.tools<1)return {error:'需要1工具包。'};s.tools--;j.workLeft=Math.max(0,j.workLeft-2);bossCounter(s,j,out);if(j.workLeft===0)finishJob(s,j,j.plan.success,out);
  }
  if(actorId==='geng'){
   if(!['waiting','locked'].includes(j.status)||j.boost.geng)return {error:'只能为尚未出发、且未改装的任务做原型机。'};if(!available(s,'geng'))return {error:'首工耿得先回基地才能改装。'};if(s.tools<1)return {error:'需要1工具包。'};s.tools--;j.boost.geng=true;
  }
  if(actorId==='luo'){
   if(!['failed','expired'].includes(j.status)||j.retryUsed)return {error:'只能接回失败或撤单任务，每单一次。'};if(s.budget<2)return {error:'兜底需要2预算。'};s.budget-=2;j.retryUsed=true;j.status=dependenciesMet(s,j)?'waiting':'locked';j.deadline=Math.min(s.maxTurns??LEVELS[s.level].turns,s.turn+4);j.crew=[];j.plan=null;j.workLeft=0;j.travelLeft=0;
  }
  if(actorId==='dong'){
   if(!['waiting','locked'].includes(j.status)||!j.tags.includes('人群')||j.boost.calm)return {error:'只能为尚未处理的人群任务控场一次。'};j.deadline=Math.min(s.maxTurns??LEVELS[s.level].turns,j.deadline+3);j.boost.calm=true;s.panic=Math.max(0,s.panic-5);
  }
  if(actorId==='li'){
   if(!['waiting','locked'].includes(j.status)||j.boost.discount)return {error:'只能为未派遣的任务议价一次。'};j.boost.discount=true;
  }
  if(actorId==='tim'){
   if(!['waiting','locked'].includes(j.status)||j.boost.intel)return {error:'选择一单还没侦察、尚未派遣的任务。'};j.revealed=true;j.boost.intel=true;
  }
 }
 s.energy-=ability.cost;a.cooldown=s.turn+ability.cooldown;s.log.push({at:s.turn,who:actorId,text:ability.name+'，开！'});out.unshift({kind:'skill',actor:actorId,text:ability.name+'已生效。'});refresh(s);settle(s);return {out};
}
export function buyTools(s){if(!s.started||s.finished)return '先开始任务。';if(s.budget<3)return '买工具需要3预算。';s.budget-=3;s.tools++;s.spent+=3;return null;}
export function rating(s){if(!s.passed)return 0;let n=1;if(s.completed===s.jobs.length)n++;if(s.completed===s.jobs.length&&s.damage<=Math.max(2,s.level+1)&&s.panic<25)n++;return n;}
export function commitWin(c,s){if(!s.finished||!s.passed)return {reward:0};const old=c.stars[s.level]||0,stars=rating(s),reward=Math.max(0,stars-old)+(old===0?1:0);c.stars[s.level]=Math.max(old,stars);c.bank+=reward;c.unlocked=Math.max(c.unlocked,Math.min(5,s.level+1));c.records[s.level]={completed:s.completed,total:s.jobs.length,damage:s.damage,turns:s.turn,stars};if(s.level===5)c.completed=true;c.run=null;return {reward,stars};}
export function buyUpgrade(c,id){const u=UPGRADES.find(u=>u.id===id);if(!u)return '没有这项改造。';if(c.upgrades.includes(id))return '已经装上了。';if(c.bank<u.cost)return '津贴不够。先通关或提高星级。';c.bank-=u.cost;c.upgrades.push(id);return null;}
