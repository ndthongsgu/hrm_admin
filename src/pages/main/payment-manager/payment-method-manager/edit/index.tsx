import Loading from "@/components/loading/Loading";
import { useDetailPaymentMethod, useUpdatePaymentMethod } from "@/hooks/payment-method";
import { useParams } from "react-router-dom";
import AddPaymentMethodScreen from "../add";

export default function EditPaymentMethodScreen() {
  const { id } = useParams();

  const { data, isLoading } = useDetailPaymentMethod(id || "");

  const { onUpdatePaymentMethod, isLoading: isLoadingUpdate } = useUpdatePaymentMethod(id || "");

  const mappedInitData = data
    ? {
        ...data,
        isDeleted: data.isDeleted,
      }
    : undefined;

  const handleUpdate = (values: any) => {
    onUpdatePaymentMethod({
      ...values,
    });
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <AddPaymentMethodScreen
          isEdit={true}
          isLoadingUpdate={isLoadingUpdate}
          title="Chỉnh sửa phương thức thanh toán"
          initData={mappedInitData}
          handleUpdate={handleUpdate}
        />
      )}
    </>
  );
}
