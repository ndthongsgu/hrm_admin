import type { BaseDto } from "./base.dto";
import type { CarDto } from "./car.dto";
import type { RouteDto } from "./route.dto";

export interface TripDto extends BaseDto {
  routeId: string;
  departureTime: string;
  price: number;
  availableSeats: number;
  route: RouteDto;
  tripCars?: TripCarDto[];
  tripStops?: TripStopDto[];
}

export interface TripCarDto extends BaseDto {
  car: CarDto;
  price: number;
  availableSeats: number;
}

export interface TripFilter {
  routeId?: string;
  departureTime?: string;
  price: number | undefined;
  isDeleted?: boolean;
}

export interface TripCreateUpdateDto {
  routeId: string;
  departureTime: string;
  price: number;
  availableSeats?: number;
  carIds: string[];
}

export interface TripPageRequest {
  page: number;
  size: number;
  sortBy?: string;
  sortDirection?: string;
  routeId?: string;
  startLocation?: string;
  endLocation?: string;
  departureAfter?: string;
  departureBefore?: string;
}

export interface TripSelectDto {
  id: string;
  route: RouteDto;
  departureTime: string;
  price: number;
  tripCars?: TripCarDto[];
}

export interface TripStopSelectDto {
  id: string;
  location: string;
  stopType: "PICKUP" | "DROPOFF";
}

export interface TripStopDto extends BaseDto {
  tripId: string;
  location: string;
  stopType: string;
  orderIndex: number;
}
