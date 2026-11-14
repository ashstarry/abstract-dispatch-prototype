import assert from 'node:assert/strict';
import fs from 'node:fs';
// Runs from the project root after copying this file there; the fallback also lets
// the authoring workspace run the same checks without touching app source.
const local=new URL('./dist/simulation.mjs',import.meta.url);
const project=fs.existsSync(local)?new URL('./',import.meta.url):new URL('../../outputs/abstract-dispatch-campaign/',import.meta.url);
const sim=await import(new URL('dist/simulation.mjs',project));
const {LEVELS,CHARS}=await import(new URL('dist/campaign.mjs',project));
const {newCampaign,newRun,start,available,plan,dispatch,tick,skill,buyTools,commitWin,buyUpgrade,finishNow}=sim;
let checks=0;const verified=[];
function ok(v,label){assert.ok(v,label);checks++;}
function equal(a,b,label){assert.deepEqual(a,b,label);checks++;}
function apply(s,step){
 let r;
 if(step.action==='dispatch')r=dispatch(s,step.job,step.crew,step.mode);
 else if(step.action==='skill')r=skill(s,step.actor,step.target);
 else if(step.action==='buyTools')r=buyTools(s);
 else if(step.action==='tick')r=tick(s);
 else throw new Error('Unknown schedule action');
 ok(!r?.error&&typeof r!=='string','legal schedule action: '+JSON.stringify(step));return r;
}

const SOLUTIONS=[{"level":0,"steps":[{"turn":0,"action":"dispatch","job":"lab-door","crew":["he"],"mode":"safe"},{"turn":1,"action":"tick"},{"turn":1,"action":"skill","actor":"he","target":"lab-door"},{"turn":2,"action":"tick"},{"turn":3,"action":"tick"},{"turn":3,"action":"dispatch","job":"lab-crate","crew":["he","luo"],"mode":"safe"},{"turn":4,"action":"tick"},{"turn":4,"action":"skill","actor":"he","target":"lab-crate"}]},{"level":1,"steps":[{"turn":0,"action":"dispatch","job":"s1-lift","crew":["geng","dong"],"mode":"safe"},{"turn":1,"action":"tick"},{"turn":1,"action":"dispatch","job":"s1-fire","crew":["he"],"mode":"safe"},{"turn":2,"action":"tick"},{"turn":2,"action":"skill","actor":"he","target":"s1-fire"},{"turn":3,"action":"tick"},{"turn":3,"action":"dispatch","job":"s1-eggs","crew":["he","luo"],"mode":"safe"},{"turn":4,"action":"tick"},{"turn":5,"action":"tick"},{"turn":6,"action":"tick"},{"turn":6,"action":"dispatch","job":"s1-drone","crew":["geng"],"mode":"chaos"},{"turn":7,"action":"tick"},{"turn":8,"action":"tick"}]},{"level":2,"steps":[{"turn":0,"action":"dispatch","job":"s2-screen","crew":["he","geng"],"mode":"safe"},{"turn":0,"action":"dispatch","job":"s2-queue","crew":["li"],"mode":"safe"},{"turn":1,"action":"tick"},{"turn":1,"action":"skill","actor":"he","target":"s2-screen"},{"turn":2,"action":"tick"},{"turn":3,"action":"tick"},{"turn":3,"action":"dispatch","job":"s2-stock","crew":["he","luo"],"mode":"safe"},{"turn":4,"action":"tick"},{"turn":4,"action":"skill","actor":"he","target":"s2-stock"},{"turn":5,"action":"tick"},{"turn":5,"action":"buyTools"},{"turn":5,"action":"dispatch","job":"s2-cat","crew":["he","geng"],"mode":"safe"},{"turn":6,"action":"tick"},{"turn":7,"action":"tick"},{"turn":8,"action":"tick"},{"turn":9,"action":"tick"},{"turn":9,"action":"buyTools"},{"turn":9,"action":"dispatch","job":"s2-stage","crew":["geng","luo"],"mode":"safe"},{"turn":10,"action":"tick"},{"turn":11,"action":"tick"},{"turn":12,"action":"tick"}]},{"level":3,"steps":[{"turn":0,"action":"dispatch","job":"s3-power","crew":["he","luo"],"mode":"safe"},{"turn":1,"action":"tick"},{"turn":1,"action":"skill","actor":"he","target":"s3-power"},{"turn":1,"action":"dispatch","job":"s3-pump","crew":["geng","da"],"mode":"safe"},{"turn":2,"action":"tick"},{"turn":3,"action":"tick"},{"turn":4,"action":"tick"},{"turn":5,"action":"tick"},{"turn":5,"action":"dispatch","job":"s3-bus","crew":["luo","dong"],"mode":"safe"},{"turn":6,"action":"tick"},{"turn":6,"action":"dispatch","job":"s3-bridge","crew":["geng","da"],"mode":"chaos"},{"turn":7,"action":"tick"},{"turn":8,"action":"tick"},{"turn":8,"action":"dispatch","job":"s3-drone","crew":["he","tim"],"mode":"safe"},{"turn":9,"action":"tick"},{"turn":10,"action":"tick"},{"turn":11,"action":"tick"},{"turn":11,"action":"dispatch","job":"s3-shelter","crew":["geng","dong"],"mode":"chaos"},{"turn":12,"action":"tick"},{"turn":13,"action":"tick"}]},{"level":4,"steps":[{"turn":0,"action":"dispatch","job":"s4-relay","crew":["luo","wang"],"mode":"safe"},{"turn":1,"action":"tick"},{"turn":1,"action":"dispatch","job":"s4-server","crew":["geng","dong"],"mode":"chaos"},{"turn":2,"action":"tick"},{"turn":3,"action":"tick"},{"turn":4,"action":"tick"},{"turn":4,"action":"dispatch","job":"s4-report","crew":["dong","tim"],"mode":"safe"},{"turn":5,"action":"tick"},{"turn":6,"action":"tick"},{"turn":6,"action":"dispatch","job":"s4-antenna","crew":["geng","luo"],"mode":"safe"},{"turn":7,"action":"tick"},{"turn":8,"action":"tick"},{"turn":9,"action":"tick"},{"turn":9,"action":"dispatch","job":"s4-crowd","crew":["dong","wang"],"mode":"safe"},{"turn":10,"action":"tick"},{"turn":10,"action":"dispatch","job":"s4-backup","crew":["he","tim"],"mode":"safe"},{"turn":11,"action":"tick"},{"turn":11,"action":"skill","actor":"he","target":"s4-backup"},{"turn":12,"action":"tick"},{"turn":12,"action":"dispatch","job":"s4-broadcast","crew":["geng","luo"],"mode":"safe"},{"turn":13,"action":"tick"},{"turn":14,"action":"tick"},{"turn":15,"action":"tick"},{"turn":16,"action":"tick"}]},{"level":5,"steps":[{"turn":0,"action":"dispatch","job":"s5-power","crew":["he","tim"],"mode":"safe"},{"turn":0,"action":"dispatch","job":"s5-bridge","crew":["geng","dong"],"mode":"chaos"},{"turn":1,"action":"tick"},{"turn":1,"action":"skill","actor":"he","target":"s5-power"},{"turn":2,"action":"tick"},{"turn":3,"action":"tick"},{"turn":3,"action":"dispatch","job":"s5-hotline","crew":["geng","dong"],"mode":"safe"},{"turn":4,"action":"tick"},{"turn":4,"action":"dispatch","job":"s5-cooling","crew":["luo","wang"],"mode":"safe"},{"turn":5,"action":"tick"},{"turn":6,"action":"tick"},{"turn":7,"action":"tick"},{"turn":7,"action":"dispatch","job":"s5-bypass","crew":["he","tim"],"mode":"safe"},{"turn":8,"action":"tick"},{"turn":8,"action":"skill","actor":"he","target":"s5-bypass"},{"turn":9,"action":"tick"},{"turn":10,"action":"tick"},{"turn":10,"action":"dispatch","job":"s5-evac","crew":["luo","dong"],"mode":"safe"},{"turn":11,"action":"tick"},{"turn":12,"action":"tick"},{"turn":12,"action":"dispatch","job":"s5-backup","crew":["geng","wang"],"mode":"safe"},{"turn":13,"action":"tick"},{"turn":14,"action":"tick"},{"turn":15,"action":"tick"},{"turn":16,"action":"tick"},{"turn":17,"action":"tick"},{"turn":18,"action":"tick"},{"turn":19,"action":"tick"},{"turn":20,"action":"tick"},{"turn":20,"action":"dispatch","job":"s5-core","crew":["he","luo"],"mode":"safe"},{"turn":21,"action":"tick"},{"turn":21,"action":"skill","actor":"he","target":"s5-core"},{"turn":22,"action":"tick"},{"turn":23,"action":"tick"},{"turn":24,"action":"tick"},{"turn":24,"action":"buyTools"},{"turn":24,"action":"skill","actor":"he","target":"s5-core"}]}];

ok(LEVELS.length===6,'one experimental and five formal levels');
equal(CHARS.length,8,'eight complete characters');
equal(LEVELS.reduce((n,l)=>n+l.jobs.length,0),32,'32 authored tasks');
for(const solution of SOLUTIONS){
 const s=newRun(solution.level);equal(start(s),null,'default crew can start');
 for(const step of solution.steps)apply(s,step);
 ok(s.finished&&s.passed,'level '+solution.level+' passed');
 equal(s.completed,s.jobs.length,'level '+solution.level+' fully cleared');
 ok(s.budget>=0&&s.tools>=0&&s.energy>=0,'no negative spendable resources');
 verified.push({level:solution.level,completed:s.completed,total:s.jobs.length,turn:s.turn,damage:s.damage,panic:s.panic});
}
// Honest recovery window: all original jobs have settled, but a legal retry can still win.
{
 const s=newRun(0);start(s);ok(!dispatch(s,'lab-door',['luo'],'safe').error,'intentional bad assignment accepted as forecast failure');
 for(let i=1;i<=7;i++){tick(s);if(i===4)ok(!dispatch(s,'lab-crate',['geng'],'safe').error,'second experimental task dispatched');}
 equal(s.jobs.map(j=>j.status),['failed','done'],'witness has one failed final task');
 ok(!s.finished&&s.turn===7,'failure does not prematurely close the recovery window');
 ok(!skill(s,'luo','lab-door').error,'Luo can reopen the settled failure');
 equal(s.jobs[0].deadline,10,'retry is capped by the level deadline');
 ok(!dispatch(s,'lab-door',['he'],'safe').error,'retry can use a different qualified responder');
 tick(s);ok(!skill(s,'he','lab-door').error,'acceleration makes the late rescue fit');
 while(!s.finished)tick(s);
 ok(s.passed&&s.completed===2,'late recovery genuinely wins at the deadline');
}
// Voluntary finish is available and still checks actual goals.
{
 const s=newRun(1);start(s);finishNow(s);ok(s.finished&&!s.passed,'ending early does not fabricate success');
}
// No repeated-claim farm from a win screen.
{
 const c=newCampaign(),s=newRun(0);start(s);for(const a of SOLUTIONS[0].steps)apply(s,a);
 const first=commitWin(c,s),bank=c.bank,again=commitWin(c,s);ok(first.reward>0,'first win pays a finite grant');equal(again.reward,0,'same win does not pay twice');equal(c.bank,bank,'repeat claim cannot farm currency');
 ok(!buyUpgrade(c,'van'),'affordable upgrade can be bought');const after=c.bank;ok(!!buyUpgrade(c,'van'),'upgrade cannot be bought twice');equal(c.bank,after,'duplicate purchase does not charge again');
 const r=newRun(1,c);equal(plan(r,r.jobs[0],['he'],'safe').returnTime,0,'van changes real return timing');
}
// Travel and cooldown are real restrictions.
{
 const s=newRun(1);start(s);ok(!dispatch(s,'s1-lift',['he'],'safe').error,'technician can take elevator');
 ok(!available(s,'he'),'assigned responder not reusable');ok(!!dispatch(s,'s1-fire',['he'],'safe').error,'double booking rejected');
 ok(!!skill(s,'he','s1-lift').error,'cannot accelerate before arrival');tick(s);
 const t=s.tools;ok(!skill(s,'he','s1-lift').error,'acceleration works at the scene');equal(s.tools,t-1,'acceleration consumes a real tool');
 equal(s.jobs[0].status,'done','acceleration really completes work');ok(!available(s,'he'),'completion retains return journey');tick(s);ok(available(s,'he'),'responder becomes available after return');
}
// One stage rewind, no recursive history and no unlimited currency rollback.
{
 const s=newRun(3);start(s);dispatch(s,'s3-power',['he','tim'],'safe');const before={budget:s.budget,tools:s.tools,energy:s.energy};tick(s);
 ok(!skill(s,'da').error,'rewind succeeds once');equal(s.turn,0,'rewind restores one tick');equal(s.jobs[0].travelLeft,1,'travel position is restored');equal(s.jobs[0].workLeft,2,'work results are restored');
 equal(s.budget,before.budget,'budget is restored to the checkpoint');equal(s.tools,before.tools,'tools are restored to the checkpoint');equal(s.energy,before.energy-2,'rewind still costs command points');
 ok(skill(s,'da').error.includes('已经用过'),'second rewind clearly reports stage limit');equal(s.checkpoint,null,'checkpoint does not recurse');
}
// All eight abilities have observable effects, not cosmetic labels.
{
 const s=newRun(2);start(s);const j=s.jobs[1],deadline=j.deadline;ok(!skill(s,'dong',j.id).error,'crowd control applies');equal(j.deadline,deadline+3,'crowd control extends real deadline');ok(!!skill(s,'dong',j.id).error,'crowd control cannot repeatedly stack on one job');
}
{
 const s=newRun(2);start(s);const j=s.jobs[0],before=plan(s,j,['he'],'safe');ok(!skill(s,'li',j.id).error,'procurement applies');const after=plan(s,j,['he'],'safe');ok(after.fee<before.fee&&after.tools<before.tools,'procurement reduces actual fee and tools');
}
{
 const s=newRun(1);start(s);const j=s.jobs[0],before=plan(s,j,['geng'],'chaos');ok(!skill(s,'geng',j.id).error,'prototype modification applies');const after=plan(s,j,['geng'],'chaos');equal(after.stats.force,before.stats.force+3,'prototype adds real force');equal(after.damage,before.damage+1,'prototype has real equipment cost');
}
{
 const s=newRun(3);start(s);while(s.turn<8)tick(s);const j=s.jobs.find(j=>j.id==='s3-drone'),before=plan(s,j,['tim'],'safe');ok(!skill(s,'tim',j.id).error,'scouting applies to released task');const after=plan(s,j,['tim'],'safe');ok(!before.known&&after.known,'scouting exposes hidden requirement');equal(after.stats.obs,before.stats.obs+3,'scouting boosts actual observation');ok(!before.success&&after.success,'scouting changes a real outcome');
}
{
 const s=newRun(4);start(s);ok(!skill(s,'wang').error,'audit shield can be enabled');for(let i=0;i<6;i++)tick(s);equal(s.blackoutUntil,0,'shield blocks scripted blackout');equal(s.shield,0,'shield is consumed once');
}
// The new surge applies to an in-progress job, not only unassigned tickets.
{
 const s=newRun(4);start(s);for(const a of SOLUTIONS[4].steps){if(a.action==='tick'&&a.turn===15){const active=s.jobs.find(j=>j.id==='s4-broadcast');equal(active.status,'active','broadcast is active during surge');const old=active.deadline;apply(s,a);equal(active.deadline,old-2,'surge shortens an active job deadline');break;}apply(s,a);}
}
// A speed-up cannot skip the final machine's halfway counterattack.
{
 const s=newRun(5);start(s);for(const a of SOLUTIONS[5].steps){if(a.action==='skill'&&a.target==='s5-core')continue;if(a.action==='tick'&&a.turn===23)break;apply(s,a);}
 const j=s.jobs.find(j=>j.id==='s5-core');equal(s.turn,22,'counter probe reaches the intended point');ok(!j.boost.countered&&j.workLeft===4,'machine has not countered before the speed-up');const energy=s.energy;
 const r=skill(s,'he',j.id);ok(!r.error,'core speed-up accepted');ok(j.boost.countered,'speed-up crossing halfway triggers counter');equal(j.workLeft,4,'counter adds two work blocks after the speed-up');equal(s.energy,energy-2,'speed-up and counter both consume command points');ok(r.out.some(x=>x.kind==='event'&&!x.blocked),'counterattack is a visible event');
}
// Actual complete final-stage route that uses both a speed-up and a counter shield.
{
 const s=newRun(5);start(s);let shieldUsed=false;
 for(const a of SOLUTIONS[5].steps){if(s.finished)break;apply(s,a);if(a.action==='dispatch'&&a.job==='s5-core'){ok(!skill(s,'wang').error,'audit shield placed for final machine');shieldUsed=true;}}
 ok(shieldUsed&&s.passed&&s.completed===8,'unupgraded final stage clears with active counterplay');ok(s.log.some(x=>x.text.includes('挡住了规程的反扑')),'shield actually blocked machine counter');
}

// Relaxed mode extends both ticket windows and the stage clock.
{
 for(let index=0;index<LEVELS.length;index++){
  const s=newRun(index,newCampaign(),'relaxed');equal(s.maxTurns,LEVELS[index].turns+2,'relaxed stage clock extends with deadlines');ok(s.jobs.every(j=>j.deadline<=s.maxTurns),'relaxed ticket deadlines fit the extended stage');
 }
 const s=newRun(1,newCampaign(),'relaxed');start(s);
 for(const a of SOLUTIONS[1].steps){if(a.job==='s1-drone'||a.target==='s1-drone')continue;apply(s,a);}
 while(s.turn<13)tick(s);
 const drone=s.jobs.find(j=>j.id==='s1-drone');equal(drone.status,'waiting','last relaxed ticket remains live after base-mode clock nears its end');
 ok(!dispatch(s,'s1-drone',['geng'],'chaos').error,'relaxed route can legally finish after the standard clock');
 tick(s);ok(!s.finished,'stage does not end at the old standard-mode clock');tick(s);
 ok(s.passed&&s.completed===4&&s.turn===15,'late relaxed ticket completes before the extended clock');
}


// Fatigue is reachable through continuous legal dispatch and really lowers capability.
{
 const s=newRun(3);start(s);
 ok(!dispatch(s,'s3-power',['he','geng'],'safe').error,'fatigue probe restores power');
 while(s.turn<4)tick(s);
 ok(!dispatch(s,'s3-pump',['he','geng'],'safe').error,'same crew can do the dependent pump');
 while(s.turn<8)tick(s);
 ok(!skill(s,'geng','s3-bridge').error,'prototype bridges the force gap for the third continuous job');
 ok(!dispatch(s,'s3-bridge',['he','geng'],'chaos').error,'third continuous assignment is legal');
 while(s.turn<12)tick(s);
 ok(s.actors.he.fatigue>=3&&s.actors.geng.fatigue>=3,'continuous work reaches fatigue penalty');
 const target=s.jobs.find(j=>j.id==='s3-bus'),tired=plan(s,target,['he','geng'],'safe'),fresh=newRun(3),normal=plan(fresh,fresh.jobs.find(j=>j.id==='s3-bus'),['he','geng'],'safe');
 equal(tired.stats.force,normal.stats.force-2,'fatigue removes capability from both tired responders');
}

console.log(JSON.stringify({status:'passed',checks,levels:verified},null,2));
