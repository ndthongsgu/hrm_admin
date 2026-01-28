import Loading from "@/components/loading/Loading";
import { useDetailDepartment, useUpdateDepartment } from "@/hooks/department";
import { useParams } from "react-router-dom";
import AddDepartmentScreen from "../add";

export default function EditDepartmentScreen() {
  const { id } = useParams();
  const { data, isLoading } = useDetailDepartment(id ?? "");
  const { onUpdateDepartment, isLoading: isLoadingUpdate } = useUpdateDepartment(
    id ?? ""
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <AddDepartmentScreen
      initData={data}
      title="Cập nhật phòng ban"
      isEdit={true}
      handleUpdate={onUpdateDepartment}
      isLoadingUpdate={isLoadingUpdate}
    />
  );
}
