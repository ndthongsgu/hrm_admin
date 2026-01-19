import type { BaseDto } from "./base.dto";
import type { CarSeatDto } from "./carSeat.dto";
import type { CarTypeDto } from "./carType.dto";

export interface CarDto extends BaseDto {
  code: string;
  carType: CarTypeDto;
  licensePlate: string;
  carSeats: CarSeatDto[];
}

export interface CarFilter {
  code?: string;
  licensePlate?: string;
  carTypeId?: string;
  isDeleted?: boolean;
}

export interface CarCreateUpdateDto {
  carTypeId: string;
  licensePlate: string;
}

export interface CarPageRequest extends CarFilter {
  page: number;
  size: number;
  sortBy?: string;
  sortDirection?: string;
}
