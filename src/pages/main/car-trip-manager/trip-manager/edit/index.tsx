import Loading from "@/components/loading/Loading";
import { useDetailTrip, useUpdateTrip } from "@/hooks/trip";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import AddTripScreen from "../add";

export default function EditTripScreen() {
  const { id } = useParams();

  const { data, isLoading } = useDetailTrip(id || "");
  const { onUpdateTrip, isLoading: isLoadingUpdate } = useUpdateTrip(id || "");

  const mappedInitData = data
    ? {
        ...data,
        carIds: data.tripCars?.map((tripCar) => tripCar.car?.id) || [],
        routeId: data.route?.id || "",
        departureTime: data.departureTime
          ? dayjs(data.departureTime).format("YYYY-MM-DDTHH:mm:ss")
          : "",
      }
    : undefined;

  const handleUpdate = (values: any) => {
    onUpdateTrip({
      ...values,
    });
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <AddTripScreen
          isEdit={true}
          isLoadingUpdate={isLoadingUpdate}
          title="Chỉnh sửa chuyến đi"
          initData={mappedInitData}
          handleUpdate={handleUpdate}
        />
      )}
    </>
  );
}
