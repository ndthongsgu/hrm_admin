import type { BaseDto } from "./base.dto";
import type { PaymentDto } from "./payment.dto";

export interface InvoiceDto extends BaseDto {
    payment: PaymentDto;
    invoiceNumber: string;
    fileUrl: string;
    issuedAt: Date;
}

export interface InvoiceCreateDto {
    paymentId: string;
    invoiceNumber: string;
    fileUrl: string;
    issuedAt: Date;
}

export interface InvoiceUpdateDto extends InvoiceCreateDto {}

export interface InvoiceFilter {
  paymentId?: string;
  invoiceNumber?: string;
}

export interface InvoicePageRequest extends InvoiceFilter {
  page: number;
  size: number;
  sortBy?: string;
  sortDirection?: string;
}