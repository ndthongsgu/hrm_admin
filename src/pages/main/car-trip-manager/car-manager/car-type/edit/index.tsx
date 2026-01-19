import Loading from "@/components/loading/Loading";

import { useDetailCarType, useUpdateCarType } from "@/hooks/car-type";
import { useParams } from "react-router-dom";
import AddCarScreen from "../add";

export default function EditCarTypeScreen() {
  const { id } = useParams();

  const { data, isLoading } = useDetailCarType(id || "");

  const { onUpdateCarType, isLoading: isLoadingUpdate } = useUpdateCarType(
    id || ""
  );

  const handleUpdate = (values: any) => {
    onUpdateCarType({
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
          title="Chỉnh sửa loại xe"
          initData={data}
          handleUpdate={handleUpdate}
        />
      )}
    </>
  );
}
