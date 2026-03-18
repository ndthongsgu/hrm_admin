import Loading from "@/components/loading/Loading";
import { useDetailOfficeLocation, useUpdateOfficeLocation } from "@/hooks/officeLocation";
import { useParams } from "react-router-dom";
import AddOfficeLocationScreen from "../add";

export default function EditOfficeLocationScreen() {
  const { id } = useParams();
  const { data, isLoading } = useDetailOfficeLocation(id ?? "");
  const { onUpdateOfficeLocation, isLoading: isLoadingUpdate } = useUpdateOfficeLocation();

  if (isLoading) {
    return <Loading />;
  }

  const handleUpdate = (values: any) => {
    onUpdateOfficeLocation({
      id: id ?? "",
      data: values,
    });
  };

  return (
    <AddOfficeLocationScreen
      initData={data}
      title="Cập nhật địa điểm văn phòng"
      isEdit={true}
      handleUpdate={handleUpdate}
      isLoadingUpdate={isLoadingUpdate}
    />
  );
}
