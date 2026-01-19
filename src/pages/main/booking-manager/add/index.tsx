import { formatDateTime } from "@/common/helpers/format";
import BaseView from "@/components/base-view/BaseView";
import SeatSelector from "@/components/custom/SeatSelector";
import type { FormField } from "@/components/form-custom";
import FormCustom from "@/components/form-custom";
import type { BookingDto } from "@/dto/booking.dto";
import { BookingStatus } from "@/dto/booking.dto";
import { useCreateBooking } from "@/hooks/booking";
import { useSelectCustomers } from "@/hooks/customer";
import useSeatSocket from "@/hooks/socket/useSeatSocket";
import { useSelectTrips } from "@/hooks/trip";
import { useTripStopsByTrip } from "@/hooks/trip-stop";
import { useRouter } from "@/routes/hooks";
import { seatHoldService } from "@/services/seatHoldService";
import { Form, message } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function AddBookingScreen({
  initData,
  title = "Thêm mới đặt xe",
  isEdit = false,
  handleUpdate,
  isLoadingUpdate,
}: {
  initData?: BookingDto;
  isEdit?: boolean;
  handleUpdate?: (data: any) => void;
  title?: string;
  isLoadingUpdate?: boolean;
}) {
  const { createBooking, isLoading } = useCreateBooking();
  const router = useRouter();
  const [form] = Form.useForm();

  const [selectedTripId, setSelectedTripId] = useState<string>(() => {
    const tripId = initData?.trip?.id || "";
    return tripId;
  });
  const [selectedCarId, setSelectedCarId] = useState<string>(() => {
    const carId = initData?.trip?.tripCars?.[0]?.car?.id || "";
    return carId;
  });
  const [seatPrice, setSeatPrice] = useState<number>(() => {
    const price = initData?.trip?.price || 0;
    return price;
  });
  const [reservedSeats, setReservedSeats] = useState<string[]>([]);
  const [heldSeats, setHeldSeats] = useState<string[]>([]); // seats held by WebSocket
  const [bookedSeats, setBookedSeats] = useState<string[]>([]); // seats booked in database

  const { data: customers } = useSelectCustomers();
  const { data: trips } = useSelectTrips();
  const { data: tripStops } = useTripStopsByTrip(selectedTripId);
  const seatSocket = useSeatSocket();

  // Initialize form values when editing
  useEffect(() => {
    if (isEdit && initData) {
      if (initData.trip?.id && initData.trip.id !== selectedTripId) {
        setSelectedTripId(initData.trip.id);
      }

      // Set car ID if available
      const carId = initData.trip?.tripCars?.[0]?.car?.id;
      if (carId && carId !== selectedCarId) {
        setSelectedCarId(carId);
      }

      // Set seat price
      if (initData.trip?.price && initData.trip.price !== seatPrice) {
        setSeatPrice(initData.trip.price);
      }

      // Set initial form values including selected seats
      const selectedSeatIds =
        initData.bookingSeats?.map((bookingSeat) => {
          // Ensure we're getting the seat ID, not the booking seat object
          if (typeof bookingSeat === "string") {
            return bookingSeat;
          }
          return bookingSeat.seat?.id || bookingSeat.id;
        }) || [];

      const initialValues = {
        code: initData.code,
        customerId: initData.customer?.id,
        tripId: initData.trip?.id,
        carId: carId,
        pickupStopId: initData.pickupStop?.id,
        dropoffStopId: initData.dropoffStop?.id,
        totalPrice: initData.totalPrice,
        bookingSeats: selectedSeatIds,
        bookingStatus: initData.bookingStatus,
      };

      form.setFieldsValue(initialValues);
    }
  }, [
    isEdit,
    initData,
    form,
    trips?.length,
    selectedTripId,
    selectedCarId,
    seatPrice,
  ]); // Remove selectedCarId, selectedTripId, seatPrice to avoid infinite loops

  // subscribe to realtime seat updates for current trip/car
  useEffect(() => {
    if (!selectedTripId || !selectedCarId || !seatSocket.isConnected) {
      return;
    }

    const unsub = seatSocket.subscribe(
      selectedTripId,
      selectedCarId,
      (payload) => {
        if (
          !payload ||
          payload.tripId !== selectedTripId ||
          payload.carId !== selectedCarId
        ) {
          return;
        }
        if (payload.action === "hold") {
          setHeldSeats((prev) => {
            const newSeats = Array.from(new Set([...prev, ...payload.seatIds]));
            return newSeats;
          });
          setReservedSeats((prev) => {
            const newSeats = Array.from(new Set([...prev, ...payload.seatIds]));
            return newSeats;
          });
        } else if (payload.action === "release") {
          setHeldSeats((prev) => {
            const newSeats = prev.filter((s) => !payload.seatIds.includes(s));
            return newSeats;
          });
          setReservedSeats((prev) => {
            const newSeats = prev.filter((s) => !payload.seatIds.includes(s));
            return newSeats;
          });
        }
      }
    );

    return () => {
      if (unsub) unsub();
    };
  }, [selectedTripId, selectedCarId, seatSocket, seatSocket.isConnected]);

  useEffect(() => {
    const fetchSeats = async () => {
      if (selectedTripId && selectedCarId) {
        try {
          const [fetchedHeldSeats, fetchedBookedSeats] = await Promise.all([
            seatHoldService.getHeldSeats(selectedTripId, selectedCarId),
            seatHoldService.getBookedSeats(selectedTripId, selectedCarId),
          ]);

          // When editing, exclude current booking's seats from booked seats
          let filteredBookedSeats = fetchedBookedSeats;
          if (isEdit && initData?.bookingSeats) {
            const currentBookingSeats = initData.bookingSeats.map(
              (bs) => bs.seat.id
            );
            filteredBookedSeats = fetchedBookedSeats.filter(
              (seatId) => !currentBookingSeats.includes(seatId)
            );
          }

          // Update separate states
          setHeldSeats(fetchedHeldSeats);
          setBookedSeats(filteredBookedSeats);

          // Update legacy reserved seats for backward compatibility
          const allReservedSeats = [
            ...new Set([...fetchedHeldSeats, ...filteredBookedSeats]),
          ];
          setReservedSeats(allReservedSeats);
        } catch (error) {
          setReservedSeats([]);
          setHeldSeats([]);
          setBookedSeats([]);
        }
      } else {
        setHeldSeats([]);
        setBookedSeats([]);
        setReservedSeats([]);
      }
    };

    fetchSeats();
  }, [selectedTripId, selectedCarId, isEdit, initData]);

  useEffect(() => {
    // Only clear seat states if not editing or if the trip actually changed
    if (!isEdit || (isEdit && selectedTripId !== initData?.trip?.id)) {
      setHeldSeats([]);
      setBookedSeats([]);
      setReservedSeats([]);
    }
  }, [selectedTripId, isEdit, initData]);

  useEffect(() => {
    if (selectedTripId && !isEdit) {
      const trip = trips.find((t) => t.id === selectedTripId);
      setSeatPrice(trip?.price || 0);

      // Only reset car selection if not editing
      setSelectedCarId("");
      // Clear form fields related to car selection and seats
      form.setFieldsValue({
        carId: undefined,
        bookingSeats: [],
        totalPrice: 0,
      });
    }
  }, [selectedTripId, trips, form, isEdit]);

  const updateTotalPrice = useCallback(
    (allValues: any) => {
      const seatsSelected = allValues.bookingSeats || [];
      const total = seatsSelected.length * seatPrice;
      form.setFieldsValue({ totalPrice: total });
    },
    [seatPrice, form]
  );

  useEffect(() => {
    const allValues = form.getFieldsValue();
    updateTotalPrice(allValues);
  }, [form, seatPrice, updateTotalPrice]);

  // Update total price when seats change during editing
  useEffect(() => {
    if (isEdit && initData) {
      const allValues = form.getFieldsValue();
      if (allValues.bookingSeats && allValues.bookingSeats.length > 0) {
        updateTotalPrice(allValues);
      }
    }
  }, [isEdit, initData, form, updateTotalPrice]);

  const seats = useMemo(() => {
    if (!selectedTripId || !selectedCarId) {
      return [];
    }

    if (isEdit && initData && initData.trip?.tripCars?.[0]?.car?.carSeats) {
      const carSeats = initData.trip.tripCars[0].car.carSeats;
      return carSeats;
    }

    // Fallback to loaded trips data
    const trip = trips?.find((t) => t.id === selectedTripId);
    const car = trip?.tripCars?.find((tc) => tc.car.id === selectedCarId)?.car;
    const seatList = car?.carSeats || [];

    return seatList;
  }, [selectedTripId, selectedCarId, trips, isEdit, initData]);

  const formFields: FormField[] = useMemo(
    () => [
      {
        name: "code",
        label: "Mã đặt xe",
        type: "input",
        placeholder: "Nhập mã đặt xe",
      },
      {
        name: "customerId",
        label: "Khách hàng",
        type: "select",
        required: true,
        showSearch: true,
        options:
          customers?.map((c) => ({
            id: c.id,
            name: `${c.name}`,
            value: c.id,
          })) || [],
        placeholder: "Chọn khách hàng",
      },
      {
        name: "tripId",
        label: "Chuyến đi",
        type: "select",
        required: true,
        options: (() => {
          // First try to get options from loaded trips data
          const tripOptions =
            trips?.map((t) => ({
              id: t.id,
              name: `${t.route.startLocation} → ${
                t.route.endLocation
              } - ${formatDateTime(t.departureTime)}`,
              value: t.id,
            })) || [];

          // If no trips loaded but we have initData (for edit mode), add the current trip
          if (tripOptions.length === 0 && isEdit && initData?.trip) {
            const trip = initData.trip;
            return [
              {
                id: trip.id,
                name: `${trip.route.startLocation} → ${
                  trip.route.endLocation
                } - ${formatDateTime(trip.departureTime)}`,
                value: trip.id,
              },
            ];
          }

          return tripOptions;
        })(),
        onChange: (value: string) => setSelectedTripId(value),
        placeholder: "Chọn chuyến đi",
      },
      {
        name: "carId",
        label: "Xe",
        type: "select",
        required: true,
        disabled: !selectedTripId,
        options: (() => {
          // First try to get options from loaded trips data
          const tripCars =
            trips
              ?.find((t) => t.id === selectedTripId)
              ?.tripCars?.map((tc) => ({
                id: tc.car.id,
                name: tc.car.licensePlate,
                value: tc.car.id,
              })) || [];

          // If no trip cars found but we have initData (for edit mode), use that
          if (tripCars.length === 0 && isEdit && initData?.trip?.tripCars) {
            return initData.trip.tripCars.map((tc) => ({
              id: tc.car.id,
              name: tc.car.licensePlate,
              value: tc.car.id,
            }));
          }

          return tripCars;
        })(),
        onChange: (value: string) => setSelectedCarId(value),
      },
      {
        name: "pickupStopId",
        label: "Điểm đón",
        type: "select",
        showSearch: true,
        disabled: !selectedTripId,
        required: true,
        options: (() => {
          // First try to get options from loaded trip stops
          const pickupStops = (tripStops || [])
            .filter((s: any) => s.stopType === "PICKUP")
            .map((s: any) => ({
              id: s.id,
              name: s.location,
              value: s.id,
            }));

          // If no trip stops loaded but we have initData (for edit mode), use initData
          if (pickupStops.length === 0 && isEdit && initData?.trip?.tripStops) {
            return initData.trip.tripStops
              .filter((s: any) => s.stopType === "PICKUP")
              .map((s: any) => ({
                id: s.id,
                name: s.location,
                value: s.id,
              }));
          }

          return pickupStops;
        })(),
      },
      {
        name: "dropoffStopId",
        label: "Điểm trả",
        type: "select",
        showSearch: true,
        disabled: !selectedTripId,
        required: true,
        options: (() => {
          // First try to get options from loaded trip stops
          const dropoffStops = (tripStops || [])
            .filter((s: any) => s.stopType === "DROPOFF")
            .map((s: any) => ({
              id: s.id,
              name: s.location,
              value: s.id,
            }));

          // If no trip stops loaded but we have initData (for edit mode), use initData
          if (
            dropoffStops.length === 0 &&
            isEdit &&
            initData?.trip?.tripStops
          ) {
            return initData.trip.tripStops
              .filter((s: any) => s.stopType === "DROPOFF")
              .map((s: any) => ({
                id: s.id,
                name: s.location,
                value: s.id,
              }));
          }

          return dropoffStops;
        })(),
      },
      ...(isEdit
        ? [
            {
              name: "bookingStatus",
              label: "Trạng thái",
              type: "select" as const,
              options: Object.values(BookingStatus).map((status) => ({
                id: status,
                name:
                  status === BookingStatus.NEW
                    ? "Chờ xác nhận"
                    : status === BookingStatus.AWAIT_PAYMENT
                    ? "Chờ thanh toán"
                    : status === BookingStatus.AWAIT_GO
                    ? "Chờ khởi hành"
                    : status === BookingStatus.DEPARTING
                    ? "Đang khởi hành"
                    : status === BookingStatus.COMPLETED
                    ? "Hoàn thành"
                    : status === BookingStatus.CANCELLED
                    ? "Đã hủy"
                    : status,
                value: status,
              })),
              placeholder: "Chọn trạng thái",
            },
          ]
        : []),
      {
        name: "totalPrice",
        label: "Tổng giá (VNĐ)",
        type: "number",
        disabled: true,
        placeholder: "Tự động tính theo số ghế",
      },
      {
        name: "bookingSeats",
        label: "Chọn ghế",
        type: "custom",
        required: true,
        gridColumn: "1 / -1",
        customComponent: (
          <SeatSelector
            seats={seats}
            disabled={!selectedCarId || seats.length === 0}
            heldSeats={heldSeats}
            bookedSeats={bookedSeats}
            reservedSeats={reservedSeats} // backward compatibility
          />
        ),
        onChange: (selectedSeats: string[]) => {
          const allValues = form.getFieldsValue();
          allValues.bookingSeats = selectedSeats;
          updateTotalPrice(allValues);
        },
      },
    ],
    [
      customers,
      trips,
      selectedTripId,
      tripStops,
      seats,
      selectedCarId,
      form,
      updateTotalPrice,
      reservedSeats,
      heldSeats,
      bookedSeats,
      isEdit,
      initData,
    ]
  );

  const handleSubmit = (values: any) => {
    if (!values.bookingSeats || values.bookingSeats.length === 0) {
      message.error("Vui lòng chọn ít nhất một ghế.");
      return;
    }

    const data = {
      ...values,
      bookingStatus: isEdit ? values.bookingStatus : BookingStatus.AWAIT_GO,
      bookingSeats: values.bookingSeats.map((seatId: string) => ({
        seatId,
        price: seatPrice,
      })),
    };

    try {
      if (!isEdit)
        seatSocket.sendHold(
          selectedTripId,
          selectedCarId,
          values.bookingSeats || []
        );
    } catch (e) {
      // ignore if socket not available
    }

    if (isEdit) {
      if (handleUpdate) {
        handleUpdate(data);
      }
    } else {
      createBooking(data);
    }
  };

  const goBack = () => {
    router.back();
  };

  return (
    <BaseView>
      <FormCustom
        title={title}
        fields={formFields}
        loading={isLoading || isLoadingUpdate}
        initialValues={initData}
        onSubmit={handleSubmit}
        onCancel={goBack}
        submitText="Lưu"
        cancelText="Thoát"
        gridColumns="repeat(3, 1fr)"
        gap="20px"
        formStyle={{ marginTop: 16 }}
        form={form}
      />
    </BaseView>
  );
}
