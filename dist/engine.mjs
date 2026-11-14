import {CHARS,SHIFTS,BANTER,SAFE_LINES,PAIR_LINES} from './data.mjs';
export const MAX_TURNS=6;
export function initialState(shift=0){return {shift,turn:0,started:false,finished:false,duty:['tim','luo','dong','he','da','geng'],budget:SHIFTS[shift].budget,initialBudget:SHIFTS[shift].budget,reputation:100,effect:0,completed:0,missed:0,damage:0,returnAt:{},jobs:SHIFTS[shift].jobs.map(j=>({...j,status:'waiting',crew:[],remaining:0,plan:null})),history:[],log:[],lastResults:[]};}
export function available(s,id){return s.duty.includes(id)&&!s.jobs.some(j=>j.status==='active'&&j.crew.includes(id))&&(s.returnAt[id]??0)<=s.turn;}
export function planJob(job,ids,mode){
 const chars=ids.map(id=>CHARS.find(c=>c.id===id)).filter(Boolean); const r=job[mode];
 const stats={force:0,tech:0,talk:0,obs:0};chars.forEach(c=>Object.keys(stats).forEach(k=>stats[k]+=c.stats[k]));
 let duration=r.duration,fee=r.fee,damage=r.damage;const perks=[];
 if(ids.includes('tim')&&job.tags.includes('设备')){stats.obs+=2;perks.push('缇姆：观察 +2');if(mode==='chaos'){duration--;fee++;perks.push('极限测试：省1拍 / +1预算');}}
 if(ids.includes('he')&&job.tags.includes('设备')){duration--;fee++;perks.push('快速改装：省1拍 / +1预算');}
 if(ids.includes('wang')&&job.tags.includes('验收')){stats.obs+=2;perks.push('独立评测：观察 +2');}
 if(ids.includes('wang')&&ids.includes('luo')){stats.tech+=2;duration++;perks.push('互相质检：技术 +2 / 先吵1拍');}
 if(ids.includes('dong')&&job.tags.includes('人群')){stats.talk+=2;perks.push('讲故事：口才 +2');if(mode==='safe'){duration++;perks.push('故事还没讲完：多1拍');}}
 if(ids.includes('da')&&mode==='safe'){stats.obs+=3;duration++;perks.push('先看一眼：观察 +3 / 多1拍');}
 if(ids.includes('geng')&&mode==='chaos'){stats.force+=2;stats.tech++;damage++;perks.push('功能过剩：力气 +2 / 技术 +1 / 损失 +1');}
 if(ids.includes('li')){fee--;if(job.tags.includes('人群'))stats.talk++;perks.push('等一个活动：费用 -1');}
 const missing=Object.entries(r.req).filter(([k,v])=>stats[k]<v).map(([k,v])=>({stat:k,need:v,have:stats[k]}));
 const success=chars.length>0&&missing.length===0;
 duration=Math.max(1,duration);fee=Math.max(0,fee);if(!success){damage=Math.max(2,damage);duration=Math.min(duration,2);}if(ids.includes('luo')&&!success){damage=Math.max(0,damage-2);perks.push('先行赔付：失败损失 -2');}
 return {mode,name:r.name,stats,perks,missing,success,duration,fee,damage,pay:success?job.pay:0,effect:mode==='chaos'?3:1};
}
export function startShift(s){if(s.duty.length!==6)return '先选好6位值班人员。';s.started=true;s.log.push({turn:0,text:'夜班开始。嘴可以硬，任务得真干。',speaker:'dispatch'});return null;}
export function dispatchJob(s,jobId,ids,mode){
 if(!s.started||s.finished)return {error:'先开班，再派人。'};
 const j=s.jobs.find(j=>j.id===jobId);if(!j||j.status!=='waiting')return {error:'这单已经有人接了。'};
 if(!['safe','chaos'].includes(mode))return {error:'先选一个处理方案。'};
 if(ids.length<1||ids.length>2||new Set(ids).size!==ids.length)return {error:'每单选1到2人。'};
 if(s.jobs.filter(j=>j.status==='active').length>=2)return {error:'最多同时处理两单，先推进时间。'};
 if(ids.some(id=>!available(s,id)))return {error:'有人还在现场或返程中。'};
 const p=planJob(j,ids,mode);if(p.fee>s.budget)return {error:'预算不够，换个省钱的方案。'};
 if(s.turn+p.duration>j.deadline)return {error:'这套方案赶不上期限。换快一点的组合。'};
 s.budget-=p.fee;j.status='active';j.crew=[...ids];j.remaining=p.duration;j.plan=p;
 s.log.push({turn:s.turn,speaker:ids[0],text:`${j.where}，接了。${CHARS.find(c=>c.id===ids[0]).quip}`});return {job:j,plan:p};
}
export function tick(s){
 if(!s.started||s.finished)return [];
 s.turn++;const results=[];
 for(const j of s.jobs){
  if(j.status==='active'){
   j.remaining--;if(j.remaining<=0){
    j.status=j.plan.success?'done':'failed';s.budget=Math.max(0,s.budget+j.plan.pay-j.plan.damage);s.damage+=j.plan.damage;s.effect+=j.plan.effect;
    if(j.plan.success)s.completed++;else{s.missed++;s.reputation=Math.max(0,s.reputation-20);}
    for(const id of j.crew)s.returnAt[id]=s.turn+1;
    const r={jobId:j.id,title:j.title,type:j.type,where:j.where,crew:[...j.crew],success:j.plan.success,mode:j.plan.mode,damage:j.plan.damage,pay:j.plan.pay,turn:s.turn,route:j.plan.name,lines:dialogue(j)};results.push(r);s.history.push(r);
    s.log.push({turn:s.turn,speaker:'dispatch',text:j.plan.success?`${j.where}已解决。${j.plan.damage?`设备损失${j.plan.damage}预算，先记账。`:'这单居然没出幺蛾子。'}`:`${j.where}没处理好。人员返程，换个组合再试。`});
   }
  }else if(j.status==='waiting'&&s.turn>=j.deadline){j.status='expired';s.missed++;s.reputation=Math.max(0,s.reputation-20);s.log.push({turn:s.turn,speaker:'dispatch',text:`${j.where}超时了。客户已经开始找隔壁队。`});}
 }
 s.lastResults=results;
 if(s.jobs.every(j=>!['waiting','active'].includes(j.status))||s.turn>=MAX_TURNS){s.finished=true;}
 return results;
}
export function dialogue(j){
 const pair=j.crew;
 if(pair.includes('luo')&&pair.includes('wang'))return [['wang','这玩意儿不行。'],['luo','哪儿不行？又不行？'],['dispatch',j.plan.success?'行了行了，活干完再开发布会。':'客户都走了，你俩还搁这辩呢？']];
 if(!j.plan.success)return [[pair[0],'问题不大。'],['dispatch','问题是不大，任务没了。'],[pair[1]||pair[0],'这波我的，下一把。']];
 const combo=PAIR_LINES.find(p=>p.ids.every(id=>pair.includes(id)));
 if(combo&&j.plan.mode==='chaos')return combo.lines;
 if(j.plan.mode==='safe'){const lines=SAFE_LINES[j.id];return [[pair[0],lines[0]],['dispatch',lines[1]],[pair[1]||pair[0],lines[2]]];}
 if(BANTER[j.id].every(([id])=>id==='dispatch'||pair.includes(id)))return BANTER[j.id];
 return [[pair[0],CHARS.find(c=>c.id===pair[0]).quip],['dispatch','活干完了，先别庆祝。'],[pair[1]||pair[0],j.plan.damage?'账单别看我，我没带钱包。':'不庆祝也行，能下班吗？']];
}
export function grade(s){return s.completed===4?(s.damage<=2?'漂亮下班':'人没事，设备有事'):s.completed>=3?'勉强保住饭碗':s.completed>=2?'明天开个会':'全员写检讨';}
