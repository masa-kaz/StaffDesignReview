# GraphQL API 使用ガイド

## 概要

このAPIはGraphQLを使用してスタッフデザインレビューシステムのデータを提供します。GraphQLの強力な型システムとクエリ機能を活用して、効率的なデータ取得が可能です。

## エンドポイント

- **GraphQL Playground**: `http://localhost:3000/api/graphql`
- **Health Check**: `http://localhost:3000/api/health`

## 基本的な使用方法

### 1. GraphQL Playgroundでのテスト

GraphQL Playgroundにアクセスして、以下のクエリを試すことができます：

```graphql
# レビュー一覧取得
query {
  reviews {
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
```

### 2. フロントエンドからの呼び出し

#### Vue.jsでの使用例

```javascript
// GraphQLクライアントの設定
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:3000/api/graphql',
  cache: new InMemoryCache()
});

// クエリの定義
const GET_REVIEWS = gql`
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
`;

// Vue.jsコンポーネントでの使用
export default {
  data() {
    return {
      reviews: [],
      loading: false,
      error: null
    };
  },
  async mounted() {
    try {
      this.loading = true;
      const { data } = await client.query({
        query: GET_REVIEWS,
        variables: { page: 1, limit: 10 }
      });
      this.reviews = data.reviews.reviews;
    } catch (error) {
      this.error = error.message;
    } finally {
      this.loading = false;
    }
  }
};
```

## クエリリファレンス

### Reviews（レビュー）

#### レビュー一覧取得

```graphql
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
```

**変数**:
- `page`: ページ番号（デフォルト: 1）
- `limit`: 1ページあたりの件数（デフォルト: 10）

#### 特定のレビュー取得

```graphql
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
```

**変数**:
- `id`: レビューID（必須）

### Comments（コメント）

#### コメント一覧取得

```graphql
query GetComments($reviewId: String!) {
  comments(reviewId: $reviewId) {
    id
    content
    author
    createdAt
  }
}
```

**変数**:
- `reviewId`: レビューID（必須）

## ミューテーションリファレンス

### Reviews（レビュー）

#### レビュー作成

```graphql
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
```

**変数**:
```json
{
  "input": {
    "title": "新しいデザイン案",
    "description": "ホームページのデザイン案です",
    "reviewer": "田中太郎"
  }
}
```

#### レビュー更新

```graphql
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
```

**変数**:
```json
{
  "id": "1",
  "input": {
    "title": "更新されたデザイン案",
    "status": "APPROVED"
  }
}
```

#### レビュー削除

```graphql
mutation DeleteReview($id: String!) {
  deleteReview(id: $id)
}
```

**変数**:
- `id`: レビューID（必須）

### Comments（コメント）

#### コメント作成

```graphql
mutation CreateComment($reviewId: String!, $input: CreateCommentInput!) {
  createComment(reviewId: $reviewId, input: $input) {
    id
    content
    author
    createdAt
  }
}
```

**変数**:
```json
{
  "reviewId": "1",
  "input": {
    "content": "色合いをもう少し明るくした方が良いと思います",
    "author": "レビュアー1"
  }
}
```

#### コメント削除

```graphql
mutation DeleteComment($id: String!) {
  deleteComment(id: $id)
}
```

**変数**:
- `id`: コメントID（必須）

## 型定義

### ReviewStatus（レビューステータス）

```graphql
enum ReviewStatus {
  PENDING      # 保留中
  APPROVED     # 承認済み
  REJECTED     # 却下
  IN_PROGRESS  # 進行中
}
```

### Review（レビュー）

```graphql
type Review {
  id: String!           # レビューID
  title: String!         # タイトル
  description: String!   # 説明
  status: ReviewStatus!  # ステータス
  reviewer: String       # レビュアー
  createdAt: String!     # 作成日時
  updatedAt: String!     # 更新日時
  comments: [Comment!]!  # コメント一覧
}
```

### Comment（コメント）

```graphql
type Comment {
  id: String!        # コメントID
  reviewId: String!   # レビューID
  content: String!    # 内容
  author: String!     # 作成者
  createdAt: String!  # 作成日時
}
```

### Pagination（ページネーション）

```graphql
type Pagination {
  page: Int!    # 現在のページ
  limit: Int!   # 1ページあたりの件数
  total: Int!   # 総件数
}
```

## エラーハンドリング

### 一般的なエラー

```json
{
  "errors": [
    {
      "message": "Review with id 999 not found",
      "locations": [
        {
          "line": 2,
          "column": 3
        }
      ],
      "path": [
        "review"
      ]
    }
  ],
  "data": null
}
```

### バリデーションエラー

```json
{
  "errors": [
    {
      "message": "Title and description are required",
      "locations": [
        {
          "line": 2,
          "column": 3
        }
      ],
      "path": [
        "createReview"
      ]
    }
  ],
  "data": null
}
```

## ベストプラクティス

### 1. 必要なフィールドのみを取得

```graphql
# 良い例：必要なフィールドのみ
query {
  reviews {
    reviews {
      id
      title
      status
    }
  }
}

# 悪い例：不要なフィールドも取得
query {
  reviews {
    reviews {
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
}
```

### 2. 変数の使用

```graphql
# 良い例：変数を使用
query GetReview($id: String!) {
  review(id: $id) {
    id
    title
  }
}

# 悪い例：ハードコード
query {
  review(id: "1") {
    id
    title
  }
}
```

### 3. エラーハンドリング

```javascript
try {
  const { data, errors } = await client.query({
    query: GET_REVIEWS
  });
  
  if (errors) {
    console.error('GraphQL errors:', errors);
    return;
  }
  
  // データの処理
  console.log(data.reviews);
} catch (error) {
  console.error('Network error:', error);
}
```

### 4. キャッシュの活用

```javascript
// Apollo Clientのキャッシュ設定
const client = new ApolloClient({
  uri: '/api/graphql',
  cache: new InMemoryCache({
    typePolicies: {
      Review: {
        fields: {
          comments: {
            merge(existing = [], incoming) {
              return [...existing, ...incoming];
            }
          }
        }
      }
    }
  })
});
```

## トラブルシューティング

### よくある問題

1. **CORS エラー**
   - フロントエンドとAPIのドメインが異なる場合
   - 解決策: CORS設定の確認

2. **型エラー**
   - GraphQLスキーマとクライアントの型定義が一致しない
   - 解決策: スキーマの再生成

3. **ネットワークエラー**
   - APIサーバーが起動していない
   - 解決策: `npm run dev` でサーバー起動

### デバッグ方法

1. **GraphQL Playgroundでのテスト**
2. **ネットワークタブでのリクエスト確認**
3. **コンソールログでのエラー確認**

このガイドを参考に、効率的なGraphQL APIの利用を実現してください。
