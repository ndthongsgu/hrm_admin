import Loading from "@/components/loading/Loading";
import { useDetailCar, useUpdateCar } from "@/hooks/car";
import { useParams } from "react-router-dom";
import AddCarScreen from "../add";

export default function EditCarScreen() {
  const { id } = useParams();

  const { data, isLoading } = useDetailCar(id || "");

  const { onUpdateCar, isLoading: isLoadingUpdate } = useUpdateCar(id || "");

  const mappedInitData = data
    ? {
        ...data,
        carTypeId: data.carType?.id,
      }
    : undefined;

  const handleUpdate = (values: any) => {
    onUpdateCar({
      ...values,
    });
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <AddCarScreen
          isEdit={true}
          isLoadingUpdate={isLoadingUpdate}
          title="Chỉnh sửa xe"
          initData={mappedInitData}
          handleUpdate={handleUpdate}
        />
      )}
    </>
  );
}
