import assert from 'node:assert/strict';
import fs from 'node:fs';
import {CHARS,SHIFTS} from './dist/data.mjs';
import {initialState,startShift,dispatchJob,tick,planJob,available} from './dist/engine.mjs';

const pairs=ids=>ids.flatMap((a,i)=>[[a],...ids.slice(i+1).map(b=>[a,b])]);
let checks=0;
const check=(value,message)=>{assert.ok(value,message);checks++;};
check(CHARS.length===8,'Eight complete characters');
for(const c of CHARS)check(fs.existsSync(`dist/assets/${c.id}.webp`),`Portrait exists: ${c.id}`);
check(SHIFTS.length===3&&SHIFTS.reduce((n,s)=>n+s.jobs.length,0)===12,'Three shifts, twelve tasks');
for(const shift of SHIFTS)for(const job of shift.jobs)for(const mode of ['safe','chaos']){
 const valid=pairs(CHARS.map(c=>c.id)).map(ids=>planJob(job,ids,mode)).filter(p=>p.success&&p.duration<=job.deadline);
 check(valid.length>0,`${job.id}/${mode} has a real solution`);
 check(valid.every(p=>p.fee>=0&&p.duration>=1&&p.damage>=0),`${job.id}/${mode} has valid costs`);
}
{
 const s=initialState();check(startShift(s)===null,'Shift starts with six staff');
 check(!!dispatchJob(s,'lift',['wang'],'safe').error,'Off-duty staff rejected');
 check(!!dispatchJob(s,'lift',['he','he'],'safe').error,'Duplicate staff rejected');
 const r=dispatchJob(s,'lift',['he','geng'],'safe');check(!r.error&&r.plan.success&&r.plan.duration===1,'Fast technical rescue');
 check(!available(s,'he'),'Busy person cannot move instantly');check(!!dispatchJob(s,'fire',['he'],'safe').error,'Busy person cannot double-book');
 check(!dispatchJob(s,'fire',['tim','da'],'safe').error,'Second simultaneous task allowed');
 check(!!dispatchJob(s,'queue',['luo','dong'],'safe').error,'Third simultaneous task rejected');
 const results=tick(s);check(results.length===1&&s.completed===1,'Completion on correct beat');check(!available(s,'he'),'Return journey occupies one beat');
 tick(s);check(available(s,'he'),'Available after return beat');check(s.budget>=0,'Budget remains nonnegative');
}
{
 const s=initialState();startShift(s);const r=dispatchJob(s,'lift',['tim'],'safe');check(!r.error&&!r.plan.success,'Insufficient crew produces forecast failure');tick(s);tick(s);
 check(s.completed===0&&s.missed===1,'Failure earns no success');check(s.budget<=s.initialBudget,'Failed task earns no bonus');
}
{
 const s=initialState();startShift(s);for(let i=0;i<6;i++)tick(s);check(s.finished&&s.completed===0&&s.missed===4,'Deadlines expire and shift ends');
}
{
 const j=SHIFTS[0].jobs[0],p=planJob(j,['wang','luo'],'safe');check(p.stats.tech===7&&p.duration===3,'Rivalry adds technical power and real time cost');
 const s=initialState();startShift(s);s.budget=0;check(!!dispatchJob(s,'lift',['he','geng'],'safe').error,'Insufficient budget rejected');
}

// Search actual legal schedules, including concurrency, cooldown, deadlines and budget.
function solve(shift){
 const root=initialState(shift);startShift(root);const seen=new Set();let visited=0;
 function dfs(s,path){
  if(s.completed===4)return path;if(s.finished||s.missed>0||++visited>100000)return null;
  const key=JSON.stringify([s.turn,s.budget,s.jobs.map(j=>[j.status,j.remaining,j.crew]),s.returnAt]);if(seen.has(key))return null;seen.add(key);
  const free=s.duty.filter(id=>available(s,id));
  if(s.jobs.filter(j=>j.status==='active').length<2){
   for(const j of s.jobs.filter(j=>j.status==='waiting').sort((a,b)=>a.deadline-b.deadline))for(const mode of ['safe','chaos'])for(const ids of pairs(free)){
    const p=planJob(j,ids,mode);if(!p.success||s.turn+p.duration>j.deadline||p.fee>s.budget)continue;
    const n=structuredClone(s),r=dispatchJob(n,j.id,ids,mode);if(!r.error){const sol=dfs(n,[...path,{turn:s.turn,job:j.id,crew:ids,mode}]);if(sol)return sol;}
   }
  }
  const n=structuredClone(s);tick(n);return dfs(n,[...path,{advance:true,turn:n.turn}]);
 }
 const schedule=dfs(root,[]);check(!!schedule,`Shift ${shift+1} can clear all tasks with default staff`);return {shift:shift+1,visited,schedule};
}
const solutions=SHIFTS.map((_,i)=>solve(i));
console.log(JSON.stringify({checks,status:'passed',solutions},null,2));
