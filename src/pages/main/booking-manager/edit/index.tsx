import Loading from "@/components/loading/Loading";
import { useDetailBooking, useUpdateBooking } from "@/hooks/booking";
import { useParams } from "react-router-dom";
import AddBookingScreen from "../add";

export default function EditBookingScreen() {
  const { id } = useParams();

  const { data, isLoading } = useDetailBooking(id || "");

  const mappedInitData = data
    ? {
        ...data,
        customerId: data.customer?.id,
        tripId: data.trip?.id,
        carId: data.trip?.tripCars?.[0]?.car?.id,
        pickupStopId: data.pickupStop?.id,
        dropoffStopId: data.dropoffStop?.id,
      }
    : undefined;

  const { updateBooking, isLoading: isLoadingUpdate } = useUpdateBooking(
    id || ""
  );

  const handleUpdate = (values: any) => {
    updateBooking({
      ...values,
    });
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <AddBookingScreen
          isEdit={true}
          isLoadingUpdate={isLoadingUpdate}
          title="Chỉnh sửa đặt xe"
          initData={mappedInitData}
          handleUpdate={handleUpdate}
        />
      )}
    </>
  );
}
