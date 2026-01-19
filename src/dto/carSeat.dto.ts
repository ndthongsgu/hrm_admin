import type { BaseDto } from "./base.dto";
import type { CarDto } from "./car.dto";

export interface CarSeatDto extends BaseDto {
  carId: string;
  seatNumber: string;
  seatPosition?: string;
  car?: CarDto;
}

export interface CarSeatFilter {
  carId?: string;
  seatNumber?: string;
}

export interface CarSeatCreateUpdateDto {
  carId: string;
  seatNumber: string;
  seatPosition?: string;
}

export interface CarSeatPageRequest extends CarSeatFilter {
  page: number;
  size: number;
  sortBy?: string;
  sortDirection?: string;
}
