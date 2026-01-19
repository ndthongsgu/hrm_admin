import Loading from "@/components/loading/Loading";
import { useDetailCustomer, useUpdateCustomer } from "@/hooks/customer";
import { useParams } from "react-router-dom";
import AddCustomerScreen from "../add";

export default function EditCustomerScreen() {
  const { id } = useParams();

  const { data, isLoading } = useDetailCustomer(id || "");

  const { onUpdateCustomer, isLoading: isLoadingUpdate } = useUpdateCustomer(
    id || ""
  );

  const handleUpdate = (values: any) => {
    onUpdateCustomer({
      ...values,
    });
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <AddCustomerScreen
          isEdit={true}
          isLoadingUpdate={isLoadingUpdate}
          title="Chỉnh sửa khách hàng"
          initData={data}
          handleUpdate={handleUpdate}
        />
      )}
    </>
  );
}
