import type {
  BookingCreateDto,
  BookingDto,
  BookingFilter,
  BookingStatusType,
  BookingUpdateDto,
} from "@/dto/booking.dto";
import { BookingStatus } from "@/dto/booking.dto";
import type { PaginationDto, PaginationResponse } from "@/dto/pagination.dto";
import { useRouter } from "@/routes/hooks";
import { API_ENDPOINTS } from "@/services/api-route";
import rootApiService from "@/services/api.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../layout/useToast";

export const usePaginationBooking = (
  pagination: PaginationDto<BookingFilter>
) => {
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [API_ENDPOINTS.BOOKING.PAGINATION, pagination],
    queryFn: () =>
      rootApiService.post<PaginationResponse<BookingDto>>(
        API_ENDPOINTS.BOOKING.PAGINATION,
        pagination as any
      ),
  });

  return {
    data: data?.content || [],
    total: data?.totalElements || 0,
    isLoading,
    refetch,
    error,
  };
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const showToast = useToast();
  const { mutate: createBooking, isPending: isLoading } = useMutation({
    mutationFn: (body: BookingCreateDto) =>
      rootApiService.post<BookingDto>(API_ENDPOINTS.BOOKING.CREATE, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.BOOKING.PAGINATION],
      });
      showToast({
        title: "Thêm đặt xe thành công!",
        type: "success",
        message: "Đặt xe đã được tạo thành công.",
      });
      router.back();
    },
    onError: (error: any) =>
      showToast({
        title: "Thất bại",
        message:
          "Thêm đặt xe thất bại: " + (error?.message || "Lỗi không xác định"),
        type: "error",
      }),
  });

  return { createBooking, isLoading };
};

export const useUpdateBooking = (id: string) => {
  const queryClient = useQueryClient();
  const url = API_ENDPOINTS.BOOKING.UPDATE(id);
  const showToast = useToast();
  const router = useRouter();

  const { mutate: updateBooking, isPending: isLoading } = useMutation({
    mutationFn: (body: BookingUpdateDto) =>
      rootApiService.put<BookingDto>(url, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.BOOKING.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.BOOKING.FIND_BY_ID(id)],
      });
      showToast({
        title: "Cập nhật đặt xe thành công!",
        type: "success",
        message: "Đặt xe đã được cập nhật thành công.",
      });
      router.back();
    },
    onError: (error: any) =>
      showToast({
        title: "Thất bại",
        message:
          "Cập nhật đặt xe thất bại: " +
          (error?.message || "Lỗi không xác định"),
        type: "error",
      }),
  });

  return { updateBooking, isLoading };
};

export const useDetailBooking = (id: string) => {
  const url = API_ENDPOINTS.BOOKING.FIND_BY_ID(id);
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [url],
    queryFn: () => rootApiService.get<BookingDto>(url),
    enabled: !!id,
  });

  return { data, isLoading, refetch, error };
};

export const useSelectBookings = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: [API_ENDPOINTS.BOOKING.SELECT],
    queryFn: () =>
      rootApiService.get<BookingDto[]>(API_ENDPOINTS.BOOKING.SELECT),
  });

  return {
    data: data || [],
    isLoading,
    refetch,
  };
};

// New hooks for booking status management
export const useConfirmBooking = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();

  const { mutate: confirmBooking, isPending: isLoading } = useMutation({
    mutationFn: (id: string) =>
      rootApiService.post<BookingDto>(API_ENDPOINTS.BOOKING.CONFIRM(id)),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.BOOKING.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.BOOKING.FIND_BY_ID(data.id!)],
      });
      showToast({
        title: "Xác nhận đặt xe thành công!",
        type: "success",
        message:
          "Đặt xe đã được xác nhận và chuyển sang trạng thái chờ thanh toán.",
      });
    },
    onError: (error: any) => {
      showToast({
        title: "Lỗi xác nhận đặt xe!",
        type: "error",
        message: error.response?.data?.message || "Không thể xác nhận đặt xe.",
      });
    },
  });

  return { confirmBooking, isLoading };
};

export const useCompleteTrip = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();

  const { mutate: completeTrip, isPending: isLoading } = useMutation({
    mutationFn: (id: string) =>
      rootApiService.post<BookingDto>(API_ENDPOINTS.BOOKING.COMPLETE_TRIP(id)),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.BOOKING.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.BOOKING.FIND_BY_ID(data.id!)],
      });
      showToast({
        title: "Hoàn thành chuyến đi thành công!",
        type: "success",
        message: "Chuyến đi đã được đánh dấu là hoàn thành.",
      });
    },
    onError: (error: any) => {
      showToast({
        title: "Lỗi hoàn thành chuyến đi!",
        type: "error",
        message:
          error.response?.data?.message || "Không thể hoàn thành chuyến đi.",
      });
    },
  });

  return { completeTrip, isLoading };
};

export const useUpdateBookingStatusByDate = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();

  const { mutate: updateStatusByDate, isPending: isLoading } = useMutation({
    mutationFn: (id: string) =>
      rootApiService.post<BookingDto>(
        API_ENDPOINTS.BOOKING.UPDATE_STATUS_BY_DATE(id)
      ),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.BOOKING.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.BOOKING.FIND_BY_ID(data.id!)],
      });
      showToast({
        title: "Cập nhật trạng thái thành công!",
        type: "success",
        message: "Trạng thái đặt xe đã được cập nhật theo ngày khởi hành.",
      });
    },
    onError: (error: any) => {
      showToast({
        title: "Lỗi cập nhật trạng thái!",
        type: "error",
        message:
          error.response?.data?.message ||
          "Không thể cập nhật trạng thái đặt xe.",
      });
    },
  });

  return { updateStatusByDate, isLoading };
};

// Helper functions to determine button visibility
export const canConfirmBooking = (booking: BookingDto): boolean => {
  return booking.bookingStatus === BookingStatus.NEW;
};

export const canCompleteTrip = (booking: BookingDto): boolean => {
  return booking.bookingStatus === BookingStatus.DEPARTING;
};

export const canUpdateStatusByDate = (booking: BookingDto): boolean => {
  return booking.bookingStatus === BookingStatus.AWAIT_GO;
};

// Helper function to get next status
export const getNextBookingStatus = (
  currentStatus: BookingStatusType
): BookingStatusType | null => {
  switch (currentStatus) {
    case BookingStatus.NEW:
      return BookingStatus.AWAIT_PAYMENT;
    case BookingStatus.AWAIT_PAYMENT:
      return BookingStatus.AWAIT_GO;
    case BookingStatus.AWAIT_GO:
      return BookingStatus.DEPARTING;
    case BookingStatus.DEPARTING:
      return BookingStatus.COMPLETED;
    case BookingStatus.COMPLETED:
      return null;
    default:
      return null;
  }
};

// Helper function to check if booking is in progress
export const isBookingInProgress = (booking: BookingDto): boolean => {
  return booking.bookingStatus !== BookingStatus.COMPLETED;
};

// Helper function to get available actions for a booking
export const getBookingActions = (booking: BookingDto) => {
  const actions = {
    canConfirm: canConfirmBooking(booking),
    canComplete: canCompleteTrip(booking),
    canUpdateStatus: canUpdateStatusByDate(booking),
    canEdit: booking.bookingStatus !== BookingStatus.COMPLETED,
    canDelete: booking.bookingStatus === BookingStatus.NEW,
  };

  return actions;
};
