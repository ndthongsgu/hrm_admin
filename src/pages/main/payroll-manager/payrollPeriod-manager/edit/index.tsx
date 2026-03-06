import Loading from "@/components/loading/Loading";
import { useDetailPayrollPeriod, useUpdatePayrollPeriod } from "@/hooks/payroll";
import { useParams } from "react-router-dom";
import AddPayrollPeriodScreen from "../add";

export default function EditPayrollPeriodScreen() {
  const { id } = useParams();
  const { data, isLoading } = useDetailPayrollPeriod(id ?? "");
  const { onUpdatePayrollPeriod, isLoading: isLoadingUpdate } = useUpdatePayrollPeriod(
    id ?? ""
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <AddPayrollPeriodScreen
      initData={data}
      title="Cập nhật kỳ lương"
      isEdit={true}
      handleUpdate={onUpdatePayrollPeriod}
      isLoadingUpdate={isLoadingUpdate}
    />
  );
}
