import fs from 'node:fs';
const read=p=>fs.readFileSync(p,'utf8');
const assets=Object.fromEntries(fs.readdirSync('dist/assets').filter(n=>n.endsWith('.webp')).map(n=>[n.replace(/\.webp$/,''),'data:image/webp;base64,'+fs.readFileSync('dist/assets/'+n).toString('base64')]));
let js=['data.mjs','engine.mjs','app.mjs'].map(f=>read('dist/'+f).replace(/^import .+;\s*$/gm,'').replace(/^export /gm,'')).join('\n');
js=js.replaceAll('./assets/${c.id}.webp','${ART[c.id]}').replaceAll('./assets/${id}.webp','${ART[id]}');
js=js.replaceAll('./assets/scene-${r.type}-${r.mode}.webp','${ART[`scene-${r.type}-${r.mode}`]}');
const html=read('dist/index.html').replace('<link rel="stylesheet" href="./style.css">','<style>'+read('dist/style.css')+'</style>').replace('<script type="module" src="./app.mjs"></script>','<script>const ART='+JSON.stringify(assets)+';\n'+js.replaceAll('</script','<\\/script')+'</script>');
fs.writeFileSync('抽象派遣局-双击试玩.html',html);console.log(JSON.stringify({file:'抽象派遣局-双击试玩.html',bytes:Buffer.byteLength(html),assets:Object.keys(assets).length}));
