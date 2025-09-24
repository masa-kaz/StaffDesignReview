#!/usr/bin/env node

/**
 * プレビューサーバーを起動し、自動的にブラウザを開くスクリプト
 * verify:serve の代替として使用
 */

import { spawn } from 'child_process';

console.log('\n🚀 プレビューサーバーを起動中...\n');

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
    console.log('\n\n🛑 サーバーを停止しています...\n');
    process.exit(0);
  }
});

// Ctrl+C の処理
process.on('SIGINT', () => {
  console.log('\n\n🛑 サーバーを停止しています...\n');
  process.exit(0);
});
