# API プロジェクト構造

```
src/
├── domain/                           # ドメイン層（ビジネスロジック）
│   ├── entities/                     # エンティティ
│   │   ├── Review.ts                # レビューエンティティ
│   │   └── Comment.ts               # コメントエンティティ
│   ├── interfaces/                  # インターフェース（依存関係の逆転）
│   │   └── index.ts                 # リポジトリ・サービスのインターフェース
│   └── services/                    # ドメインサービス
│       └── index.ts                 # ビジネスロジックの実装
├── infrastructure/                   # インフラストラクチャ層
│   ├── repositories/                # リポジトリ実装
│   │   └── InMemoryRepository.ts    # インメモリリポジトリ
│   └── graphql/                     # GraphQL設定
│       └── schema.ts                # GraphQLスキーマ定義
├── pages/api/                       # プレゼンテーション層（Next.js API Routes）
│   ├── graphql.ts                   # GraphQLエンドポイント
│   └── health.ts                    # ヘルスチェックエンドポイント
└── docs/                            # ドキュメント
    ├── CLEAN_ARCHITECTURE.md        # Clean Architecture設計ガイド
    └── GRAPHQL_GUIDE.md             # GraphQL使用ガイド
```

## レイヤーの役割

### Domain Layer（ドメイン層）
- **entities/**: ビジネスオブジェクト（Review, Comment）
- **interfaces/**: リポジトリ・サービスのインターフェース
- **services/**: ビジネスロジックの実装

### Infrastructure Layer（インフラストラクチャ層）
- **repositories/**: データアクセスの実装
- **graphql/**: GraphQLスキーマとリゾルバー

### Presentation Layer（プレゼンテーション層）
- **pages/api/**: HTTPエンドポイント（GraphQL, Health Check）

## 依存関係の流れ

```
Presentation Layer → Domain Layer ← Infrastructure Layer
```

- プレゼンテーション層はドメイン層のサービスを使用
- インフラストラクチャ層はドメイン層のインターフェースを実装
- ドメイン層は外部に依存しない
