# StaffDesignReviewFront

Vue 3 + Vite をベースに、Atomic Design 構成／Pinia（状態管理）／Vue Router（ルーティング）／Histoire（UIカタログ）を採用した Netlify 向け SPA（フロントエンド）。

## スタック概要（What / Why）

- フレームワーク: Vue 3（Composition API, SFC）
- ビルド: Vite（高速な開発体験、モダン依存解決）
- ルーティング: Vue Router（`createWebHistory` による SPA）
- 状態管理: Pinia（型安全・シンプルなストア）
- UIカタログ: Histoire（コンポーネント単位の開発・可視化）
- テスト: Vitest（単体）、Playwright（E2E）
- 品質: ESLint + Oxlint + Prettier（自動整形）
- デプロイ: Netlify（`netlify.toml` に SPA リダイレクト、Node バージョン固定）

## 事前要件

- Node: `^20.19.0 || >=22.12.0`（Netlify も `20.19.0` を指定）
- パッケージマネージャ: npm
- 推奨 IDE: VSCode + Volar（Vetur は無効化）

## ディレクトリ構成（要点）

```
src/
  assets/
  components/
    atoms/       # 最小単位の UI（例: ButtonPrimary）
    molecules/   # 複数の atom を組み合わせた UI（例: HeroTitle）
    organisms/   # 複数の molecule をまとめた UI（例: HeaderNav）
    templates/   # ページのレイアウト器
  router/        # Vue Router 設定（`/__scenario__` などを含む）
  stores/        # Pinia ストア（例: counter）
  views/         # 画面（ページ）
  histoire.setup.ts # Histoire のセットアップ（Pinia 注入）

netlify.toml     # Netlify 設定（build/publish, SPA redirect, Node 版）
vite.config.ts   # Vite 設定（エイリアス、プラグイン）
```

## 設計思想

- コンポーネントは Atomic Design 準拠で粒度を分離し、再利用性を高める
- グローバル状態は Pinia に集約。副作用／計算値はストア内に閉じる
- ルーティングはページ指向で、コード分割を前提（`AboutView` は遅延読み込み）
- UIカタログ（Histoire）でコンポーネント契約を可視化し、レビュー容易化
- E2E は現実的なブラウザ挙動を Playwright で担保、単体は Vitest

## セットアップ

```sh
npm install
```

> 補足: 初回インストール後に Playwright のブラウザを自動取得する `postinstall` が走ります。
> CI/Netlify などでブラウザのダウンロードをスキップしたい場合は `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1` を設定してください。

## よく使うコマンド

```sh
# 開発サーバー（Vite）
npm run dev

# 型チェック + 本番ビルド（Vite）
npm run build

# プレビューサーバー（ビルド成果物を確認）
npm run preview

# UIカタログ（Histoire）
npm run story:dev
npm run story:build
npm run story:preview

# 単体テスト（Vitest）
npm run test:unit

# E2E テスト（Playwright）
# 初回のみ: npx playwright install
npm run test:e2e

# Lint / Format
npm run lint        # ESLint + Oxlint（fix あり）
npm run format      # Prettier（src/ 配下を整形）

# Netlify ローカル（Functions/redirect を含む）
npm run dev:netlify

# Netlify デプロイ
npm run deploy:preview
npm run deploy      # --prod
```

## ルーティング

- ヒストリー: `createWebHistory(import.meta.env.BASE_URL)`
- パス: `/`（Home）、`/__scenario__`（シナリオホスト）、`/about`（遅延読み込み）

## 状態管理（Pinia）

- 例: `stores/counter.ts`
- `setup` ストアを採用（`ref`/`computed`/関数を返す）
- `main.ts` で `createPinia()` を注入、Histoire でも `histoire.setup.ts` で注入

## コンポーネント（Atomic Design）

- atoms: `ButtonPrimary.vue`（`*.histoire.vue` / `*.story.vue` / `*.spec.ts` を同居）
- molecules: `HeroTitle.vue`
- organisms: `HeaderNav.vue`
- templates: `HomeTemplate.vue`

Histoire サンプルは `src/components/atoms/ButtonPrimary.histoire.vue` を参照。

## Histoire（UI カタログ）

- 設定: `histoire.config.ts`（`HstVue` プラグイン、`stories` のパターン）
- セットアップ: `src/histoire.setup.ts`（Pinia を注入）
- 起動/ビルドは「よく使うコマンド」を参照

## テスト

- 単体（Vitest）: `vitest.config.ts` で `jsdom` 環境、`e2e/**` を除外
- E2E（Playwright）: `playwright.config.ts`（マルチブラウザ、開発時は `dev` サーバーを起動して実行）

Playwright のブラウザ取得:

```sh
npx playwright install
# Linux で依存も含めて入れる場合
npx playwright install --with-deps
```

CI/Netlify 等でブラウザダウンロードをスキップする場合:

```sh
export PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
```

## コード品質

- ESLint（Vue/TS 推奨設定） + Oxlint（静的解析を強化）
- Prettier による整形（`npm run format`）
- `vite-plugin-vue-devtools` を導入（開発時のデバッグ支援）

## Netlify デプロイ

- `netlify.toml`
  - `[build] command = "npm run build"` / `publish = "dist"`
  - `[build.environment] NODE_VERSION = "20.19.0"`
  - `[[redirects]] /* -> /index.html`（SPA ルーティング）
  - `[functions] directory = "functions"`（将来的な Netlify Functions を想定）

ローカルでの Netlify 確認:

```sh
npm run dev:netlify
```

プレビュー/本番デプロイ:

```sh
npm run deploy:preview
npm run deploy
```

## 環境変数

- 参照方法: `import.meta.env.VITE_*`（クライアント公開用）、`import.meta.env.*`（ビルド時のみ/非公開）
- 既存利用: ルーターのベース URL に `import.meta.env.BASE_URL` を使用
- 定義場所: ルートに `.env` 系ファイル（コミット不要の秘密は `.env.local`）

推奨命名と例:

```ini
# .env
VITE_API_BASE_URL=https://api.example.com
VITE_FEATURE_X=true

# ビルドのみ参照（UI からは見えない値にする）
NODE_ENV=development
```

注意:

- ブラウザに露出してよい値は `VITE_` プレフィックスを付与（Viteの仕様）
- シークレットは Netlify の環境変数（Site settings > Build & deploy > Environment）で管理し、`.env.local` でローカル上書き
- CI/Netlify で Playwright ブラウザ取得をスキップ: `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1`

## ディレクトリ命名規約

- 全体: ケバブケース（`kebab-case`）を基本（Vue SFC はパスはケバブ、ファイルはパスカル）
- Vue SFC: コンポーネント/ビューは `PascalCase.vue`（例: `ButtonPrimary.vue`, `HomeView.vue`）
- ディレクトリ: `kebab-case`（例: `components`, `molecules`, `router`, `stores`）
- Atomic 層: `atoms/`, `molecules/`, `organisms/`, `templates/` 固定
- ストーリー/テスト: 対象と同じ階層に `*.histoire.vue` / `*.story.vue` / `*.spec.ts` を同居
- 画像/アセット: `assets/` 配下、用途でサブディレクトリ（`icons/`, `images/` など）
- ルート別機能塊を増やす場合は `features/<feature-name>/` を検討（大規模化したとき）

## 開発ガイド

- 新規コンポーネントは Atomic 層に配置し、Histoire のストーリーを同時に作成
- グローバル状態が必要になったら Pinia に集約（副作用はストア内）
- 画面追加時は `views/` と `router/index.ts` にルートを追加（必要なら遅延読み込み）
- PR 前に `npm run lint` / `npm run test:unit` を実行

## ソース更新後に実行・確認すべきコマンド一覧

```sh
# 1) 型とLintで静的チェック（自動修正も適用）
npm run lint         # ESLint + Oxlint（--fix）
npm run format       # Prettier（必要に応じて）
npm run type-check   # vue-tsc --build

# 2) テスト（段階的に）
npm run test:unit    # 単体テスト（Vitest）
# 必要に応じて E2E（時間がかかるため任意）
npm run test:e2e     # E2E テスト（Playwright）

# 3) ローカル動作確認
npm run dev          # Vite の開発サーバー
# Netlify の挙動も見る場合（functions/redirect 含む）
npm run dev:netlify

# 4) ビルドと最終確認
npm run build        # 本番ビルド
npm run preview      # ビルド成果物のプレビュー

# 5) UIカタログ（必要に応じて）
npm run story:dev
npm run story:build
npm run story:preview

# 6) デプロイ（必要に応じて）
npm run deploy:preview
npm run deploy       # --prod
```

一括実行（省力化）:

```sh
# 単体テストまで + ビルド
npm run verify

# E2E も含めてフル
npm run verify:full

# 検証後にプレビューまで自動起動
npm run verify:serve   # Webプレビュー + Histoireプレビューを並行起動 + URL表示

# URL表示のみ（サーバー起動後）
npm run show-urls      # 起動中のサーバーURLをまとめて表示
```

## 参考

- Vite 設定: https://vite.dev/config/
- Vue 公式: https://vuejs.org/
- Pinia: https://pinia.vuejs.org/
- Vue Router: https://router.vuejs.org/
- Histoire: https://histoire.dev/
- Playwright: https://playwright.dev/
