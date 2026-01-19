import Loading from "@/components/loading/Loading";
import { useDetailEmployee, useUpdateEmployee } from "@/hooks/employee";
import { useParams } from "react-router-dom";
import AddEmployeeScreen from "../add";

export default function EditEmployeeScreen() {
  const { id } = useParams();

  const { data, isLoading } = useDetailEmployee(id || "");

  const { onUpdateEmployee, isLoading: isLoadingUpdate } = useUpdateEmployee(
    id || ""
  );

  const handleUpdate = (values: any) => {
    onUpdateEmployee({
      ...values,
    });
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <AddEmployeeScreen
          isEdit={true}
          isLoadingUpdate={isLoadingUpdate}
          title="Chỉnh sửa nhân viên"
          initData={data}
          handleUpdate={handleUpdate}
        />
      )}
    </>
  );
}
