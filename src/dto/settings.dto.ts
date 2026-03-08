export interface SysSettingDto {
  id?: string;
  key: string;
  value: number;
  description?: string;
  effectiveDate?: string; // ISO date YYYY-MM-DD
  isDeleted?: boolean;
  createdAt?: string;
}

export interface SysSettingFilter {
  key?: string;
}

export interface TaxBracketDto {
  id?: string;
  policyName: string;
  minIncome: number;
  maxIncome?: number | null;
  taxRate: number; // 0‑1 decimal (e.g. 0.05 = 5%)
  subtractAmount?: number;
  isActive?: boolean;
  effectiveDate?: string; // ISO date
  isDeleted?: boolean;
  createdAt?: string;
}

export interface TaxBracketFilter {
  policyName?: string;
  isActive?: boolean;
}

export interface InsuranceConfigDto {
  id?: string;
  type: string; // SOCIAL | HEALTH | UNEMPLOYMENT
  employeeRate: number;
  companyRate?: number;
  capBaseType?: string; // BASE_SALARY | REGION_MIN
  capMultiplier?: number;
  effectiveDate?: string;
  isDeleted?: boolean;
  createdAt?: string;
}

export interface InsuranceConfigFilter {
  type?: string;
}
