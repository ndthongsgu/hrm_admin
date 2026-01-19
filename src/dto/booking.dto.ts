import type { BaseDto } from "./base.dto";
import type { CarDto } from "./car.dto";
import type { CarSeatDto } from "./carSeat.dto";
import type { CustomerDto } from "./customer.dto";
import type { TripDto, TripStopDto } from "./trip.dto";

export interface BookingDto extends BaseDto {
  code: string;
  type: string;
  customer: CustomerDto;
  trip: TripDto;
  customerName?: string;
  customerEmail?: string;
  bookingStatus: BookingStatusType;
  totalPrice: number;
  routeStartLocation?: string;
  routeEndLocation?: string;
  departureTimeFormatted?: string;
  bookingSeats?: BookingSeatDto[];
  pickupStop?: TripStopDto;
  dropoffStop?: TripStopDto;
}

export interface BookingSeatDto extends BaseDto {
  booking: BookingDto;
  code: string;
  seat: CarSeatDto;
  status: string;
  price: number;
  car?: CarDto;
  carSeats: CarSeatDto[];
}

export interface BookingFilter {
  code?: string;
  type?: string;
  bookingStatus?: BookingStatusType;
  customerId?: string;
  tripId?: string;
  statuses?: BookingStatusType[];
  createdAfter?: string;
  createdBefore?: string;
  minPrice?: number;
  maxPrice?: number;
  routeStartLocation?: string;
  routeEndLocation?: string;
}

export interface BookingCreateDto {
  code?: string;
  type?: string;
  customerId: string;
  tripId: string;
  pickupStopId?: string;
  dropoffStopId?: string;
  bookingStatus?: BookingStatusType;
  totalPrice: number;
  bookingSeats?: BookingSeatCreateDto[];
}

export interface BookingUpdateDto {
  code?: string;
  type?: string;
  customerId?: string;
  tripId?: string;
  pickupStopId?: string;
  dropoffStopId?: string;
  bookingStatus?: BookingStatusType;
  totalPrice?: number;
}

export interface BookingSeatCreateDto {
  bookingId?: string;
  seatId: string;
  status?: string;
  price: number;
}

export interface BookingSeatUpdateDto {
  bookingId?: string;
  seatId?: string;
  status?: string;
  price?: number;
}

export interface BookingSeatFilter {
  bookingId?: string;
  seatId?: string;
  status?: string;
}

export interface BookingSeatSelectDto {
  id: string;
  seatId: string;
  seatCode: string;
  seatStatus: string;
  price: number;
}

export interface BookingPageRequest extends BookingFilter {
  page: number;
  size: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
}

export const BookingStatus = {
  NEW: "new",
  AWAIT_PAYMENT: "await_payment",
  AWAIT_GO: "await_go",
  DEPARTING: "departing",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export type BookingStatusType =
  (typeof BookingStatus)[keyof typeof BookingStatus];

export const BookingStatusLabels: Record<BookingStatusType, string> = {
  new: "Chờ xác nhận",
  await_payment: "Chờ thanh toán",
  await_go: "Chờ khởi hành",
  departing: "Đang khởi hành",
  completed: "Hoàn thành",
  cancelled: "Đã hủy",
};

export const BookingStatusColors: Record<BookingStatusType, string> = {
  new: "orange",
  await_payment: "blue",
  await_go: "cyan",
  departing: "purple",
  completed: "green",
  cancelled: "red",
};
