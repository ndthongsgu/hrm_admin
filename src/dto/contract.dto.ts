import type { BaseDto } from "./base.dto";

export interface SimpleRefDto {
  id: string;
  name?: string;
  code?: string;
  fullName?: string;
}

export interface ContractDto extends BaseDto {
  employee?: SimpleRefDto | null;
  contractNumber?: string;
  baseSalary?: number;
  actualSalary?: number;
  position?: SimpleRefDto | null;
  startDate?: string;
  endDate?: string | null;
  status?: string;
  isNet?: boolean;
}

export interface AllowanceTypeDto extends BaseDto {
  name: string;
  isTaxable?: boolean;
  isInsuranceBased?: boolean;
}

export interface ContractAllowanceDto extends BaseDto {
  contract?: ContractDto | null;
  allowanceType?: AllowanceTypeDto | null;
  amount?: number;
}

export interface SelectOptionDto {
  id: string;
  name: string;
}
