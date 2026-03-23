import type { BaseDto } from "./base.dto";

export interface PositionDto extends BaseDto {
  code: string;
  name: string;
  description?: string;
  level?: number;
  baseSalary?: number;
  standardResponsibilityAllowance?: number;
  isActive: boolean;
}

export interface PositionCreateDto {
  code: string;
  name: string;
  description?: string;
  level?: number;
  baseSalary?: number;
}

export interface PositionUpdateDto {
  code?: string;
  name?: string;
  description?: string;
  level?: number;
  baseSalary?: number;
}

export interface PositionFilter {
  code?: string;
  name?: string;
  level?: number;
  isActive?: boolean;
}

export interface PositionPageRequest extends PositionFilter {
  page: number;
  size: number;
  sortBy?: string;
  sortDirection?: string;
}

export interface PositionSelectDto {
  id: string;
  code: string;
  name: string;
  level?: number;
}
