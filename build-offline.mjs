import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';

const root=path.dirname(fileURLToPath(import.meta.url));
process.chdir(root);
const read=p=>fs.readFileSync(p,'utf8');
const assets={};
for(const name of fs.readdirSync('dist/assets'))if(name.endsWith('.webp'))assets[name.slice(0,-5)]='data:image/webp;base64,'+fs.readFileSync('dist/assets/'+name).toString('base64');
const script=JSON.parse(read('voice-script.json'));
for(const c of script.clips){const p='dist/assets/audio/'+c.file;if(!fs.existsSync(p))throw new Error('Missing voice clip: '+c.file);assets['audio/'+c.id]='data:audio/mpeg;base64,'+fs.readFileSync(p).toString('base64');}
const order=['legacy','campaign','simulation','sound','game'];
let code='globalThis.ABSTRACT_ASSETS='+JSON.stringify(assets)+';\n';
for(const name of order){
 let src=read('dist/'+name+'.mjs');
 const exports=[...src.matchAll(/^export\s+(?:const|let|function|class)\s+(\w+)/gm)].map(x=>x[1]);
 src=src.replace(/^import\s+\{([^}]+)\}\s+from\s+['"]\.\/(\w+)\.mjs['"];?\s*$/gm,(_,list,mod)=>'const {'+list.replace(/\b(\w+)\s+as\s+(\w+)/g,'$1:$2')+'}=__'+mod+';');
 src=src.replace(/^export\s+/gm,'');
 code+='const __'+name+'=(()=>{\n'+src+'\nreturn {'+exports.join(',')+'};\n})();\n';
}
new vm.Script(code);
const html=read('dist/index.html').replace('<link rel="stylesheet" href="game.css">','<style>'+read('dist/game.css')+'</style>').replace('<script type="module" src="game.mjs"></script>','<script>'+code.replaceAll('</script','<\\/script')+'</script>');
if(/(?:src|href)="(?:\.\/)?(?:game\.(?:mjs|css)|\.\/assets\/)/.test(html))throw new Error('Standalone still references external game files');
const file='抽象派遣局-战役版.html';fs.writeFileSync(file,html);console.log(JSON.stringify({file,megabytes:Math.round(Buffer.byteLength(html)/1048576*10)/10,imageAssets:Object.keys(assets).filter(k=>!k.startsWith('audio/')).length,voiceClips:script.clips.length}));
