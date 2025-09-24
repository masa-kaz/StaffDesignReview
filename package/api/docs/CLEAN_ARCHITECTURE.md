# Clean Architecture 設計ガイド

## 概要

このプロジェクトでは、Robert C. Martin（Uncle Bob）が提唱したClean Architectureを採用しています。このアーキテクチャは、保守性、テスタビリティ、独立性を重視した設計パターンです。

## アーキテクチャの原則

### 1. 依存関係の逆転原則（Dependency Inversion Principle）

- 高レベルモジュールは低レベルモジュールに依存してはいけない
- 両方とも抽象化に依存すべき
- 抽象化は詳細に依存してはいけない

### 2. 関心の分離（Separation of Concerns）

- 各レイヤーは特定の責任を持つ
- ビジネスロジックとインフラストラクチャを分離
- プレゼンテーションとビジネスロジックを分離

### 3. 単一責任原則（Single Responsibility Principle）

- 各クラスは一つの責任のみを持つ
- 変更の理由は一つであるべき

## レイヤー構成

### Domain Layer（ドメイン層）

**責任**: ビジネスロジックの中核

```
domain/
├── entities/          # エンティティ（ビジネスオブジェクト）
├── interfaces/        # リポジトリ・サービスのインターフェース
└── services/          # ドメインサービス
```

**特徴**:
- 外部への依存なし
- フレームワークに依存しない
- ビジネスルールの実装
- エンティティと値オブジェクト

**例**:
```typescript
// entities/Review.ts
export class Review {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly status: ReviewStatus
  ) {}
}

// interfaces/index.ts
export interface ReviewRepository {
  findById(id: string): Promise<Review | null>;
  save(review: Review): Promise<void>;
}
```

### Infrastructure Layer（インフラストラクチャ層）

**責任**: 外部システムとの接続

```
infrastructure/
├── repositories/      # リポジトリの実装
├── graphql/          # GraphQL設定
└── database/         # データベース設定
```

**特徴**:
- ドメイン層のインターフェースを実装
- 外部システムとの接続
- フレームワーク固有の実装

**例**:
```typescript
// repositories/ReviewRepository.ts
export class InMemoryReviewRepository implements ReviewRepository {
  async findById(id: string): Promise<Review | null> {
    // 実装
  }
}
```

### Presentation Layer（プレゼンテーション層）

**責任**: 外部とのインターフェース

```
pages/api/
├── graphql.ts        # GraphQLエンドポイント
└── health.ts         # ヘルスチェック
```

**特徴**:
- HTTPリクエストの処理
- GraphQLスキーマの定義
- ドメインサービスの利用

## 実装パターン

### 1. 依存性注入（Dependency Injection）

```typescript
// Container.ts
class Container {
  private reviewRepository = new InMemoryReviewRepository();
  public reviewService = new ReviewServiceImpl(this.reviewRepository);
}
```

### 2. インターフェース分離

```typescript
// ドメイン層
export interface ReviewService {
  getReviewById(id: string): Promise<Review | null>;
}

// インフラストラクチャ層
export class ReviewServiceImpl implements ReviewService {
  constructor(private repository: ReviewRepository) {}
  
  async getReviewById(id: string): Promise<Review | null> {
    return await this.repository.findById(id);
  }
}
```

### 3. エラーハンドリング

```typescript
// ドメイン層
export class ReviewNotFoundError extends Error {
  constructor(id: string) {
    super(`Review with id ${id} not found`);
  }
}

// プレゼンテーション層
try {
  const review = await reviewService.getReviewById(id);
  return review;
} catch (error) {
  if (error instanceof ReviewNotFoundError) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }
  return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
}
```

## テスト戦略

### 1. ユニットテスト

```typescript
// domain/services/__tests__/ReviewService.test.ts
describe('ReviewService', () => {
  let reviewService: ReviewService;
  let mockRepository: jest.Mocked<ReviewRepository>;

  beforeEach(() => {
    mockRepository = {
      findById: jest.fn(),
      save: jest.fn()
    };
    reviewService = new ReviewServiceImpl(mockRepository);
  });

  it('should return review when found', async () => {
    const review = new Review('1', 'Test', 'Description', ReviewStatus.PENDING);
    mockRepository.findById.mockResolvedValue(review);

    const result = await reviewService.getReviewById('1');

    expect(result).toEqual(review);
    expect(mockRepository.findById).toHaveBeenCalledWith('1');
  });
});
```

### 2. 統合テスト

```typescript
// infrastructure/__tests__/GraphQL.test.ts
describe('GraphQL API', () => {
  it('should return reviews', async () => {
    const query = `
      query {
        reviews {
          reviews {
            id
            title
            status
          }
        }
      }
    `;

    const response = await request(app)
      .post('/api/graphql')
      .send({ query });

    expect(response.status).toBe(200);
    expect(response.body.data.reviews).toBeDefined();
  });
});
```

## ベストプラクティス

### 1. 命名規則

- **エンティティ**: 名詞（Review, Comment）
- **サービス**: 動詞 + Service（ReviewService, CommentService）
- **リポジトリ**: 名詞 + Repository（ReviewRepository）
- **インターフェース**: I + 名詞（IReviewService）

### 2. ファイル構成

```
src/
├── domain/
│   ├── entities/
│   │   ├── Review.ts
│   │   └── Comment.ts
│   ├── interfaces/
│   │   ├── IReviewRepository.ts
│   │   └── IReviewService.ts
│   └── services/
│       ├── ReviewService.ts
│       └── CommentService.ts
├── infrastructure/
│   ├── repositories/
│   │   ├── InMemoryReviewRepository.ts
│   │   └── DatabaseReviewRepository.ts
│   └── graphql/
│       ├── schema.ts
│       └── resolvers.ts
└── pages/api/
    ├── graphql.ts
    └── health.ts
```

### 3. エラーハンドリング

```typescript
// ドメイン層でのエラー定義
export class DomainError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = 'DomainError';
  }
}

export class ReviewNotFoundError extends DomainError {
  constructor(id: string) {
    super(`Review with id ${id} not found`, 'REVIEW_NOT_FOUND');
  }
}
```

### 4. バリデーション

```typescript
// エンティティでのバリデーション
export class Review {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly status: ReviewStatus
  ) {
    if (!id || id.trim().length === 0) {
      throw new DomainError('Review ID is required', 'INVALID_ID');
    }
    if (!title || title.trim().length === 0) {
      throw new DomainError('Review title is required', 'INVALID_TITLE');
    }
  }
}
```

## 拡張性の考慮

### 1. 新しい機能の追加

1. ドメイン層にエンティティとインターフェースを定義
2. インフラストラクチャ層に実装を作成
3. プレゼンテーション層にエンドポイントを追加

### 2. データベースの変更

- リポジトリの実装のみを変更
- ドメイン層は影響を受けない

### 3. APIの変更

- GraphQLスキーマのみを変更
- ドメイン層は影響を受けない

この設計により、保守性、テスタビリティ、拡張性を確保しながら、ビジネスロジックの独立性を保つことができます。
