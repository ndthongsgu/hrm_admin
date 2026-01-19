import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";
import { useQuery } from "@tanstack/react-query";
import type {
  RevenueFilterDto,
  RevenueTimePoint,
  RevenueByMethodDto,
  BookingsFilterDto,
  BookingsByRouteDto,
  BookingsStatusByRouteDto,
  TripsFilterDto,
  TripsStatusDto,
  TripsTrendPointDto,
} from "@/dto/report.dto";

export const useRevenueTime = (filters: RevenueFilterDto | null) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [API_ENDPOINTS.REPORTS.REVENUE_TIME, filters],
    queryFn: async () =>
      rootApiService.post<RevenueTimePoint[]>(
        API_ENDPOINTS.REPORTS.REVENUE_TIME,
        filters || {}
      ),
    enabled: !!filters,
    retry: 0,
  });
  return { data: data || [], isLoading, error, refetch };
};

export const useRevenueByMethod = (filters: RevenueFilterDto | null) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [API_ENDPOINTS.REPORTS.REVENUE_BY_METHOD, filters],
    queryFn: async () =>
      rootApiService.post<RevenueByMethodDto[]>(
        API_ENDPOINTS.REPORTS.REVENUE_BY_METHOD,
        filters || {}
      ),
    enabled: !!filters,
    retry: 0,
  });
  return { data: data || [], isLoading, error, refetch };
};

export const useBookingsByRoute = (filters: BookingsFilterDto | null) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [API_ENDPOINTS.REPORTS.BOOKINGS_BY_ROUTE, filters],
    queryFn: async () =>
      rootApiService.post<BookingsByRouteDto[]>(
        API_ENDPOINTS.REPORTS.BOOKINGS_BY_ROUTE,
        filters || {}
      ),
    enabled: !!filters,
    retry: 0,
  });
  return { data: data || [], isLoading, error, refetch };
};

export const useBookingsStatusByRoute = (
  filters: BookingsFilterDto | null
) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [API_ENDPOINTS.REPORTS.BOOKINGS_STATUS_BY_ROUTE, filters],
    queryFn: async () =>
      rootApiService.post<BookingsStatusByRouteDto[]>(
        API_ENDPOINTS.REPORTS.BOOKINGS_STATUS_BY_ROUTE,
        filters || {}
      ),
    enabled: !!filters,
    retry: 0,
  });
  return { data: data || [], isLoading, error, refetch };
};

export const useTripsStatus = (filters: TripsFilterDto | null) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [API_ENDPOINTS.REPORTS.TRIPS_STATUS, filters],
    queryFn: async () =>
      rootApiService.post<TripsStatusDto[]>(
        API_ENDPOINTS.REPORTS.TRIPS_STATUS,
        filters || {}
      ),
    enabled: !!filters,
    retry: 0,
  });
  return { data: data || [], isLoading, error, refetch };
};

export const useTripsTrend = (filters: TripsFilterDto | null) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [API_ENDPOINTS.REPORTS.TRIPS_STATUS_TREND, filters],
    queryFn: async () =>
      rootApiService.post<TripsTrendPointDto[]>(
        API_ENDPOINTS.REPORTS.TRIPS_STATUS_TREND,
        filters || {}
      ),
    enabled: !!filters,
    retry: 0,
  });
  return { data: data || [], isLoading, error, refetch };
};
