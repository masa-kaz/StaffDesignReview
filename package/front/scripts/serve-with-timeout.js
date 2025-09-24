#!/usr/bin/env node

/**
 * タイムアウト機能付きプレビューサーバー起動スクリプト
 * 指定時間後に自動的にサーバーを停止
 */

import { spawn } from 'child_process';

// コマンドライン引数からタイムアウト時間を取得（デフォルト: 30分）
const timeoutMinutes = parseInt(process.argv[2]) || 30;
const timeoutMs = timeoutMinutes * 60 * 1000;

console.log(`\n🚀 プレビューサーバーを起動中... (${timeoutMinutes}分後に自動停止)\n`);

// タイムアウト設定
const timeoutId = setTimeout(() => {
  console.log(`\n⏰ ${timeoutMinutes}分経過しました。サーバーを自動停止します...\n`);
  process.exit(0);
}, timeoutMs);

// ブラウザを開く関数
function openBrowser(url) {
  const platform = process.platform;
  const openCmd = platform === 'win32' ? 'start' : platform === 'darwin' ? 'open' : 'xdg-open';
  
  const child = spawn(openCmd, [url], { 
    stdio: 'ignore',
    detached: true 
  });
  child.unref();
}

// サーバー起動後の処理
setTimeout(() => {
  console.log('📱 Web アプリケーション:');
  console.log('   http://localhost:4173');
  console.log('');
  
  console.log('🎨 UI カタログ (Histoire):');
  console.log('   http://localhost:6006');
  console.log('');
  
  console.log('🌐 ブラウザを自動で開いています...');
  
  // ブラウザを自動で開く
  openBrowser('http://localhost:4173');
  setTimeout(() => openBrowser('http://localhost:6006'), 1000);
  
  console.log('');
  console.log(`⏰ 自動停止: ${timeoutMinutes}分後`);
  console.log('⌨️  キーボード操作:');
  console.log('   - q + Enter: サーバーを停止');
  console.log('   - Ctrl+C: 強制終了');
  console.log('');
  
}, 3000); // 3秒後にブラウザを開く

// stdinの設定
process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.setEncoding('utf8');

// キー入力の監視
process.stdin.on('data', (key) => {
  if (key === 'q' || key === '\u0003') { // 'q' または Ctrl+C
    clearTimeout(timeoutId);
    console.log('\n\n🛑 サーバーを停止しています...\n');
    process.exit(0);
  }
});

// Ctrl+C の処理
process.on('SIGINT', () => {
  clearTimeout(timeoutId);
  console.log('\n\n🛑 サーバーを停止しています...\n');
  process.exit(0);
});
