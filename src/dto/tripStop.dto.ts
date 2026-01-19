export interface TripStopDto {
  id: string;
  tripId: string;
  stopType: string;
  location: string;
  orderIndex: number;
  createdDate?: string;
  updatedDate?: string;
}

export interface TripStopFilter {
  tripId?: string;
  stopType?: string;
  location?: string;
}

export interface TripStopCreateUpdateDto {
  tripId: string;
  stopType: string;
  location: string;
  orderIndex: number;
}

export interface TripStopPageRequest extends TripStopFilter {
  page: number;
  size: number;
  sortBy?: string;
  sortDirection?: string;
}
