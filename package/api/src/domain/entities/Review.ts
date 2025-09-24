import { IsNotEmpty, IsString, IsOptional, IsEnum, IsUUID, IsDateString } from 'class-validator';

export enum ReviewStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  IN_PROGRESS = 'in_progress'
}

export class Review {
  @IsUUID()
  id: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsEnum(ReviewStatus)
  status: ReviewStatus;

  @IsOptional()
  @IsString()
  reviewer?: string;

  @IsDateString()
  createdAt: string;

  @IsDateString()
  updatedAt: string;

  constructor(
    id: string,
    title: string,
    description: string,
    status: ReviewStatus = ReviewStatus.PENDING,
    reviewer?: string
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.status = status;
    this.reviewer = reviewer;
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }
}
