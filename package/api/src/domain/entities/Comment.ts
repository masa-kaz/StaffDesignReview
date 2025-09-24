import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class Comment {
  @IsUUID()
  id: string;

  @IsUUID()
  reviewId: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsString()
  author: string;

  @IsNotEmpty()
  @IsString()
  createdAt: string;

  constructor(
    id: string,
    reviewId: string,
    content: string,
    author: string
  ) {
    this.id = id;
    this.reviewId = reviewId;
    this.content = content;
    this.author = author;
    this.createdAt = new Date().toISOString();
  }
}
