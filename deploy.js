/**
 * @author zzh
 * @date 2024-07-23 14:17
 * @description 打开微信开发者工具
 * @example: node deploy.js 默认启动开发模式
 * @example: node deploy.js --mode dev  开发模式
 * @example: node deploy.js --mode build 生产模式
 */

// const { exec } = require('node:child_process')
// const path = require('node:path')
import { exec } from 'node:child_process';
import path from 'node:path';

const WechatCliPath = '/Applications/wechatwebdevtools.app/Contents/MacOS/cli ';
let ProjectPath = path.resolve(process.cwd(), 'dist/dev/mp-weixin'); // 默认打开开发模式
const args = process.argv.slice(2);

if (args.length > 0) {
  if (args[0] === '--mode') {
    ProjectPath = path.resolve(process.cwd(), `dist/${args[1]}/mp-weixin`);
  }
}

const command = `${WechatCliPath} -o ${ProjectPath}`;

exec(command, (err, stdout, stderr) => {
  if (err) {
    console.error(`打开微信开发者工具失败: ${stderr}`);
    return;
  }
  console.log(`微信开发者工具已打开: ${stdout}`);
});
