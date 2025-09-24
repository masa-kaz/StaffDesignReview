# Staff Design Review API - Clean Architecture + GraphQL

## 概要

このAPIは、スタッフデザインレビューシステムのバックエンドAPIです。Clean ArchitectureとGraphQLを組み合わせて設計されており、保守性、テスタビリティ、スケーラビリティを重視しています。

## アーキテクチャ

### Clean Architecture レイヤー構造

```
src/
├── domain/                    # ドメイン層（ビジネスロジック）
│   ├── entities/              # エンティティ
│   │   ├── Review.ts
│   │   └── Comment.ts
│   ├── interfaces/            # インターフェース（依存関係の逆転）
│   │   └── index.ts
│   └── services/              # ドメインサービス
│       └── index.ts
├── infrastructure/            # インフラストラクチャ層
│   ├── repositories/          # リポジトリ実装
│   │   └── InMemoryRepository.ts
│   └── graphql/               # GraphQL設定
│       └── schema.ts
└── pages/api/                 # プレゼンテーション層
    ├── graphql.ts
    └── health.ts
```

### レイヤーの役割

1. **Domain Layer（ドメイン層）**
   - ビジネスロジックの中核
   - エンティティ、値オブジェクト、ドメインサービス
   - 外部への依存なし

2. **Infrastructure Layer（インフラストラクチャ層）**
   - 外部システムとの接続
   - データベース、外部API、フレームワーク
   - ドメイン層のインターフェースを実装

3. **Presentation Layer（プレゼンテーション層）**
   - 外部とのインターフェース
   - GraphQLエンドポイント、HTTPハンドラー
   - ドメイン層のサービスを利用

## GraphQL API

### エンドポイント

- **GraphQL Playground**: `/api/graphql`
- **Health Check**: `/api/health`

### スキーマ

#### 型定義

```graphql
enum ReviewStatus {
  PENDING
  APPROVED
  REJECTED
  IN_PROGRESS
}

type Review {
  id: String!
  title: String!
  description: String!
  status: ReviewStatus!
  reviewer: String
  createdAt: String!
  updatedAt: String!
  comments: [Comment!]!
}

type Comment {
  id: String!
  reviewId: String!
  content: String!
  author: String!
  createdAt: String!
}

type Pagination {
  page: Int!
  limit: Int!
  total: Int!
}

type ReviewsResponse {
  reviews: [Review!]!
  pagination: Pagination!
}
```

#### クエリ

```graphql
# レビュー一覧取得
query GetReviews($page: Int, $limit: Int) {
  reviews(page: $page, limit: $limit) {
    reviews {
      id
      title
      description
      status
      reviewer
      createdAt
      updatedAt
    }
    pagination {
      page
      limit
      total
    }
  }
}

# 特定のレビュー取得
query GetReview($id: String!) {
  review(id: $id) {
    id
    title
    description
    status
    reviewer
    createdAt
    updatedAt
    comments {
      id
      content
      author
      createdAt
    }
  }
}

# コメント一覧取得
query GetComments($reviewId: String!) {
  comments(reviewId: $reviewId) {
    id
    content
    author
    createdAt
  }
}
```

#### ミューテーション

```graphql
# レビュー作成
mutation CreateReview($input: CreateReviewInput!) {
  createReview(input: $input) {
    id
    title
    description
    status
    reviewer
    createdAt
    updatedAt
  }
}

# レビュー更新
mutation UpdateReview($id: String!, $input: UpdateReviewInput!) {
  updateReview(id: $id, input: $input) {
    id
    title
    description
    status
    reviewer
    updatedAt
  }
}

# レビュー削除
mutation DeleteReview($id: String!) {
  deleteReview(id: $id)
}

# コメント作成
mutation CreateComment($reviewId: String!, $input: CreateCommentInput!) {
  createComment(reviewId: $reviewId, input: $input) {
    id
    content
    author
    createdAt
  }
}

# コメント削除
mutation DeleteComment($id: String!) {
  deleteComment(id: $id)
}
```

## 開発ガイド

### 依存関係の管理

このプロジェクトでは依存関係の逆転原則を適用しています：

- **ドメイン層**: 外部への依存なし
- **インフラストラクチャ層**: ドメイン層のインターフェースを実装
- **プレゼンテーション層**: ドメイン層のサービスを利用

### 新しい機能の追加

1. **エンティティの追加**
   - `src/domain/entities/` に新しいエンティティを作成
   - バリデーションルールを `class-validator` で定義

2. **リポジトリの追加**
   - `src/domain/interfaces/` にインターフェースを定義
   - `src/infrastructure/repositories/` に実装を作成

3. **サービスの追加**
   - `src/domain/services/` にビジネスロジックを実装
   - リポジトリのインターフェースを使用

4. **GraphQLスキーマの更新**
   - `src/infrastructure/graphql/schema.ts` を更新
   - 新しい型、クエリ、ミューテーションを追加

### テスト

```bash
# 型チェック
npm run type-check

# リント
npm run lint

# 開発サーバー起動
npm run dev

# GraphQL Playground
# http://localhost:3000/api/graphql
```

### デプロイ

```bash
# Netlifyにデプロイ
npm run deploy

# プレビューデプロイ
npm run deploy:preview
```

## 技術スタック

- **フレームワーク**: Next.js 15
- **言語**: TypeScript
- **API**: GraphQL (Apollo Server)
- **バリデーション**: class-validator
- **アーキテクチャ**: Clean Architecture
- **デプロイ**: Netlify

## 今後の拡張予定

- [ ] データベース統合（PostgreSQL/MySQL）
- [ ] 認証・認可機能
- [ ] ファイルアップロード機能
- [ ] リアルタイム通知（WebSocket）
- [ ] ログ・監視機能
- [ ] ユニットテスト・統合テスト
- [ ] CI/CDパイプライン