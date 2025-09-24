// Netlify Functions用のハンドラー
exports.handler = async (event, context) => {
  try {
    const url = new URL(event.rawUrl)
    const pathname = url.pathname
    
    // CORS設定
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Content-Type': 'application/json'
    }
    
    // OPTIONSリクエストの処理
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers,
        body: ''
      }
    }
    
    // ルートに応じて適切なハンドラーを呼び出す
    if (pathname === '/api/health') {
      return await handleHealth(event, headers)
    } else if (pathname === '/api/reviews') {
      return await handleReviews(event, headers)
    } else if (pathname.startsWith('/api/reviews/') && pathname.endsWith('/comments')) {
      const id = pathname.split('/')[3]
      return await handleComments(event, headers, id)
    } else if (pathname.startsWith('/api/reviews/')) {
      const id = pathname.split('/')[3]
      return await handleReviewById(event, headers, id)
    }
    
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Not Found' })
    }
  } catch (error) {
    console.error('Error:', error)
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Internal Server Error' })
    }
  }
}

// ヘルスチェック
async function handleHealth(event, headers) {
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      message: 'Staff Design Review API is running',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    })
  }
}

// レビュー一覧・作成
async function handleReviews(event, headers) {
  if (event.httpMethod === 'GET') {
    const mockReviews = [
      {
        id: 1,
        title: 'ホームページデザイン',
        status: 'pending',
        reviewer: '田中太郎',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
      },
      {
        id: 2,
        title: 'ロゴデザイン',
        status: 'approved',
        reviewer: '佐藤花子',
        createdAt: '2024-01-14T14:30:00Z',
        updatedAt: '2024-01-16T09:15:00Z'
      }
    ]
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        reviews: mockReviews,
        pagination: {
          page: 1,
          limit: 10,
          total: mockReviews.length
        }
      })
    }
  } else if (event.httpMethod === 'POST') {
    const body = JSON.parse(event.body || '{}')
    
    if (!body.title || !body.description) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Title and description are required' })
      }
    }
    
    const newReview = {
      id: Date.now(),
      title: body.title,
      description: body.description,
      status: 'pending',
      reviewer: body.reviewer || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    return {
      statusCode: 201,
      headers,
      body: JSON.stringify(newReview)
    }
  }
}

// 個別レビュー
async function handleReviewById(event, headers, id) {
  if (event.httpMethod === 'GET') {
    const mockReview = {
      id: parseInt(id),
      title: 'ホームページデザイン',
      description: '新しいホームページのデザイン案です。',
      status: 'pending',
      reviewer: '田中太郎',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
      comments: [
        {
          id: 1,
          content: '色合いをもう少し明るくした方が良いと思います。',
          author: 'レビュアー1',
          createdAt: '2024-01-15T11:00:00Z'
        }
      ]
    }
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(mockReview)
    }
  } else if (event.httpMethod === 'PUT') {
    const body = JSON.parse(event.body || '{}')
    
    const updatedReview = {
      id: parseInt(id),
      ...body,
      updatedAt: new Date().toISOString()
    }
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(updatedReview)
    }
  } else if (event.httpMethod === 'DELETE') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: `Review ${id} deleted successfully`
      })
    }
  }
}

// コメント
async function handleComments(event, headers, reviewId) {
  if (event.httpMethod === 'GET') {
    const mockComments = [
      {
        id: 1,
        reviewId: parseInt(reviewId),
        content: '色合いをもう少し明るくした方が良いと思います。',
        author: 'レビュアー1',
        createdAt: '2024-01-15T11:00:00Z'
      },
      {
        id: 2,
        reviewId: parseInt(reviewId),
        content: 'レイアウトは良いと思いますが、フォントサイズを調整してください。',
        author: 'レビュアー2',
        createdAt: '2024-01-15T12:00:00Z'
      }
    ]
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ comments: mockComments })
    }
  } else if (event.httpMethod === 'POST') {
    const body = JSON.parse(event.body || '{}')
    
    if (!body.content || !body.author) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Content and author are required' })
      }
    }
    
    const newComment = {
      id: Date.now(),
      reviewId: parseInt(reviewId),
      content: body.content,
      author: body.author,
      createdAt: new Date().toISOString()
    }
    
    return {
      statusCode: 201,
      headers,
      body: JSON.stringify(newComment)
    }
  }
}
