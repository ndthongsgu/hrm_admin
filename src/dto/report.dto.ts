import type { PaymentStatusType } from "./payment.dto";
import type { BookingStatusType } from "./booking.dto";

export interface RevenueTimePoint {
  date: string;
  totalRevenue: number;
  transactionCount?: number;
  successCount?: number;
  failCount?: number;
  successRate?: number;
}

export interface RevenueByMethodDto {
  method: string;
  total: number;
}

export interface RevenueFilterDto {
  startDate: string;
  endDate: string;
  routeId?: string;
  methodId?: string;
  status?: PaymentStatusType;
  printedBy?: string;
}

export interface BookingsByRouteDto {
  routeId?: string;
  routeName: string;
  totalBookings: number;
  routeRevenue?: number;
}

export interface BookingsStatusByRouteDto {
  routeId?: string;
  routeName: string;
  cancelled: number;
  success: number;
}

export interface BookingsFilterDto {
  startDate: string;
  endDate: string;
  statuses?: BookingStatusType[];
  customerTypeId?: string;
  printedBy?: string;
}

export interface TripsStatusDto {
  status: string; // "Đã chạy" | "Bị hủy"
  total: number;
}

export interface TripsTrendPointDto {
  date: string;
  cancelledTrips: number;
  completedTrips: number;
}

export interface TripsFilterDto {
  startDate: string;
  endDate: string;
  routeId?: string;
  carTypeId?: string;
  printedBy?: string;
}
