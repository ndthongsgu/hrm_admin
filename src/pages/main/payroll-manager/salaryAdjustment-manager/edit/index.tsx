import Loading from "@/components/loading/Loading";
import { useDetailSalaryAdjustment, useUpdateSalaryAdjustment } from "@/hooks/payroll";
import { useParams } from "react-router-dom";
import AddSalaryAdjustmentScreen from "../add";

export default function EditSalaryAdjustmentScreen() {
  const { id } = useParams();
  const { data, isLoading } = useDetailSalaryAdjustment(id ?? "");
  const { onUpdateSalaryAdjustment, isLoading: isLoadingUpdate } = useUpdateSalaryAdjustment(id ?? "");

  if (isLoading) {
    return <Loading />;
  }

  return (
    <AddSalaryAdjustmentScreen
      initData={data}
      title="Cập nhật điều chỉnh lương"
      isEdit={true}
      handleUpdate={onUpdateSalaryAdjustment}
      isLoadingUpdate={isLoadingUpdate}
    />
  );
}