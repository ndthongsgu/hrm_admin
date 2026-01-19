import type { BaseDto } from "./base.dto.ts";
import type { BookingDto } from "./booking.dto.ts";
import type { InvoiceDto } from "./Invoice.dto.ts";
import type { PaymentMethodDto } from "./paymentMethod.dto.ts";

export type PaymentStatusType = "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";

export interface PaymentDto extends BaseDto {
  bookingId: string;
  booking?: BookingDto;
  method?: PaymentMethodDto;
  amount: number;
  status: PaymentStatusType;
  transactionCode?: string;
  paidAt: Date;
  invoice?: InvoiceDto;
}

export interface PaymentCreateDto {
  bookingId: string;
  methodId: string;
  amount: number;
  status: PaymentStatusType;
  transactionCode: string;
  paidAt: Date;
}

export interface PaymentUpdateDto {
  bookingId?: string;
  methodId?: string;
  amount?: number;
  status?: PaymentStatusType;
  transactionCode?: string;
  paidAt?: Date;
}

export interface PaymentUpdateStatusDto {
  status: PaymentStatusType;
}

export interface PaymentFilter {
  bookingId?: string;
  methodId?: string;
  status?: PaymentStatusType;
  transactionCode?: string;
}

export interface PaymentPageRequest extends PaymentFilter {
  page: number;
  size: number;
  sortBy?: string;
  sortDirection?: string;
}

export const PaymentStatusLabels: Record<PaymentStatusType, string> = {
  PENDING: "Chờ xử lý",
  SUCCESS: "Thành công",
  FAILED: "Thất bại",
  REFUNDED: "Đã hoàn tiền",
};

export const PaymentStatusColors: Record<PaymentStatusType, string> = {
  PENDING: "orange",
  SUCCESS: "green",
  FAILED: "red",
  REFUNDED: "blue",
};