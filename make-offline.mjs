// Compatibility entry point: both download filenames now open the campaign.
import './build-offline.mjs';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
fs.copyFileSync(fileURLToPath(new URL('./抽象派遣局-战役版.html',import.meta.url)),fileURLToPath(new URL('./抽象派遣局-双击试玩.html',import.meta.url)));
