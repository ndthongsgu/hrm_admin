import type { BaseDto } from "./base.dto";
import type { CustomerTypeDto } from "./customerType.dto";

export interface CustomerDto extends BaseDto {
  code: string;
  name: string;
  email: string;
  phone: string;
  description?: string;
  customerType?: CustomerTypeDto;
}

export interface CustomerCreateDto {
  code: string;
  name: string;
  email: string;
  phone: string;
  description?: string;
}

export interface CustomerUpdateDto {
  code: string;
  name: string;
  email: string;
  phone: string;
  description?: string;
}

export interface CustomerFilter {
  code?: string;
  name?: string;
  email?: string;
  phone?: string;
  customerTypeId?: string;
  isDeleted?: boolean;
}

export interface CustomerPageRequest extends CustomerFilter {
  page: number;
  size: number;
  sortBy?: string;
  sortDirection?: string;
}

export interface CustomerSelectOption {
  id: string;
  name: string;
  phone: string;
  userId: string;
}
