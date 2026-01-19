import Loading from "@/components/loading/Loading";
import {
  useDetailCustomerType,
  useUpdateCustomerType,
} from "@/hooks/customer-type";
import { useParams } from "react-router-dom";
import AddCustomerScreen from "../add";

export default function EditCustomerTypeScreen() {
  const { id } = useParams();

  const { data, isLoading } = useDetailCustomerType(id || "");

  const { onUpdateCustomerType, isLoading: isLoadingUpdate } =
    useUpdateCustomerType(id || "");

  const handleUpdate = (values: any) => {
    onUpdateCustomerType({
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
          title="Chỉnh sửa loại khách hàng"
          initData={data}
          handleUpdate={handleUpdate}
        />
      )}
    </>
  );
}
