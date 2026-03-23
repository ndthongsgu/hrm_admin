import Loading from "@/components/loading/Loading";
import { useDetailDependent, useUpdateDependent } from "@/hooks/dependent";
import { useParams } from "react-router-dom";
import AddDependentScreen from "../add";

export default function EditDependentScreen() {
  const { dependentId } = useParams<{ dependentId: string }>();

  const { data, isLoading } = useDetailDependent(dependentId || "");
  const { onUpdateDependent, isLoading: isLoadingUpdate } = useUpdateDependent(
    dependentId || ""
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <AddDependentScreen
      isEdit={true}
      title="Chỉnh sửa thân nhân"
      initData={data}
      isLoadingUpdate={isLoadingUpdate}
      handleUpdate={(values) => onUpdateDependent(values)}
    />
  );
}
