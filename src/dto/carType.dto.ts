import type { BaseDto } from "./base.dto";

export interface CarTypeDto extends BaseDto {
  code: string;
  name: string;
  description?: string;
  seatCount: number;
}

export interface CarTypeFilter {
  code?: string;
  name?: string;
  isDeleted?: boolean;
}

export interface CarTypeCreateUpdateDto {
  code: string;
  name: string;
  description?: string;
  seatCount: number;
}

export interface CarTypePageRequest extends CarTypeFilter {
  page: number;
  size: number;
  sortBy?: string;
  sortDirection?: string;
}
