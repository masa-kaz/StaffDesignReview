#!/usr/bin/env node

/**
 * プレビューサーバーのURLを表示するスクリプト
 * verify:serve 実行時に起動したサーバーのURLをまとめて表示
 */


console.log('\n🚀 プレビューサーバーが起動しました！\n');

console.log('📱 Web アプリケーション:');
console.log('   http://localhost:4173');
console.log('');

console.log('🎨 UI カタログ (Histoire):');
console.log('   http://localhost:6006');
console.log('');

console.log('💡 ヒント:');
console.log('   - Ctrl+C でサーバーを停止');
console.log('   - ブラウザで上記URLを開いて確認');
console.log('');

// オプション: ブラウザで自動開く（macOS/Linux/Windows対応）
const platform = process.platform;
const openCmd = platform === 'win32' ? 'start' : platform === 'darwin' ? 'open' : 'xdg-open';

console.log('🌐 ブラウザで自動開く場合は以下を実行:');
console.log(`   ${openCmd} http://localhost:4173`);
console.log(`   ${openCmd} http://localhost:6006`);
console.log('');

// キーボード入力の監視
console.log('⌨️  キーボード操作:');
console.log('   - q + Enter: サーバーを停止');
console.log('   - Ctrl+C: 強制終了');
console.log('');

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
