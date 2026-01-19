import type { BaseDto } from "./base.dto";

export interface CustomerTypeDto extends BaseDto {
  code: string;
  name: string;
  description?: string;
}

export interface CustomerTypeCreateDto {
  code: string;
  name: string;
  description?: string;
}

export interface CustomerTypeUpdateDto {
  code: string;
  name: string;
  description?: string;
}

export interface CustomerTypeFilter {
  code?: string;
  name?: string;
  isDeleted?: boolean;
}

export interface CustomerTypePageRequest extends CustomerTypeFilter {
  page: number;
  size: number;
  sortBy?: string;
  sortDirection?: string;
}
