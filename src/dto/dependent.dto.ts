import type { BaseDto } from "./base.dto";

interface EmployeeRefDto {
  id: string;
  fullName?: string;
  code?: string;
}

export interface DependentDto extends BaseDto {
  employee?: EmployeeRefDto | null;
  fullName?: string;
  relationship?: string;
  birthDate?: string;
  isQualified?: boolean;
}

export interface DependentCreateDto {
  employee: { id: string };
  fullName: string;
  relationship: string;
  birthDate?: string;
  isQualified: boolean;
}

export interface DependentUpdateDto {
  employee?: { id: string };
  fullName?: string;
  relationship?: string;
  birthDate?: string;
  isQualified?: boolean;
}

export interface DependentFilter {
  employeeId?: string;
  fullName?: string;
  relationship?: string;
}
