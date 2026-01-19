import type { BaseDto } from "./base.dto";
import type { PaymentDto } from "./payment.dto";

export interface PaymentMethodDto extends BaseDto {
  code: string;
  name: string;
  description?: string;
  isDeleted: boolean;
  payments?: PaymentDto[];
}

export interface PaymentMethodCreateDto {
  code: string;
  name: string;
  description: string;
  isDeleted: boolean;
}

export interface PaymentMethodUpdateDto extends PaymentMethodCreateDto {}

export interface PaymentMethodFilter {
  code?: string;
  name?: string;
  isDeleted?: boolean;
}

export interface PaymentMethodPageRequest extends PaymentMethodFilter {
  page: number;
  size: number;
  sortBy?: string;
  sortDirection?: string;
}