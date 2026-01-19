import type { BaseDto } from "./base.dto";

export interface RouteDto extends BaseDto {
  startLocation: string;
  endLocation: string;
  distanceKm: number;
  estimatedDuration: number;
}

export interface RouteFilter {
  startLocation?: string;
  endLocation?: string;
  minDistanceKm?: number;
  maxDistanceKm?: number;
  minEstimatedDuration?: number;
  maxEstimatedDuration?: number;
  isDeleted?: boolean;
}

export interface RouteCreateUpdateDto {
  startLocation: string;
  endLocation: string;
  distanceKm: number;
  estimatedDuration: number;
}

export interface RoutePageRequest extends RouteFilter {
  page: number;
  size: number;
  sortBy?: string;
  sortDirection?: string;
}
