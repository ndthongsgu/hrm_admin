import BaseView from "@/components/base-view/BaseView";
import type { FormField } from "@/components/form-custom";
import FormCustom from "@/components/form-custom";
import type { TripDto } from "@/dto/trip.dto";
import { useSelectCars } from "@/hooks/car";
import { useSelectRoutes } from "@/hooks/route";
import { useCreateTrip } from "@/hooks/trip";
import { useRouter } from "@/routes/hooks";
import { useMemo } from "react";

export default function AddTripScreen({
  initData,
  title = "Thêm mới chuyến đi",
  isEdit = false,
  handleUpdate,
  isLoadingUpdate,
}: {
  initData?: TripDto;
  isEdit?: boolean;
  handleUpdate?: (data: any) => void;
  title?: string;
  isLoadingUpdate?: boolean;
}) {
  const { isLoading, onCreateTrip } = useCreateTrip();
  const router = useRouter();

  const { data: routes, isLoading: routesLoading } = useSelectRoutes();
  const { data: cars, isLoading: carsLoading } = useSelectCars();

  const formFields = useMemo(() => {
    const fields: FormField[] = [
      {
        name: "routeId",
        label: "Tuyến đường",
        type: "select",
        options: routes?.map((r) => ({
          id: r.id,
          name: `${r.startLocation} → ${r.endLocation}`,
          value: r.id,
        })),
        loading: routesLoading,
        required: true,
        placeholder: "Nhập tuyến đường",
      },
      {
        name: "carIds",
        label: "Xe",
        type: "multiselect",
        options: cars?.map((r) => ({
          id: r.id,
          name: `${r.code} - ${r.licensePlate} - ${r.carType?.name}`,
          value: r.id,
        })),
        loading: carsLoading,
        required: true,
        placeholder: "Nhập xe",
      },

      {
        name: "departureTime",
        label: "Thời gian khởi hành",
        type: "datetimepicker",
        required: true,
        placeholder: "Nhập thời gian khởi hành",
      },
      {
        name: "price",
        label: "Giá (VNĐ)",
        type: "number",
        required: true,
        placeholder: "Nhập giá (VNĐ)",
      },
    ];
    return fields;
  }, [cars, carsLoading, routes, routesLoading]);

  const handleSubmit = (values: any) => {
    if (isEdit) {
      if (handleUpdate) {
        handleUpdate(values);
      }
    } else {
      onCreateTrip(values);
    }
  };

  const goBack = () => {
    router.back();
  };

  return (
    <BaseView>
      <FormCustom
        title={title}
        fields={formFields}
        initialValues={initData}
        loading={isLoading || isLoadingUpdate}
        onSubmit={handleSubmit}
        onCancel={goBack}
        submitText="Lưu"
        cancelText="Thoát"
        gap="20px"
        gridColumns="repeat(2, 1fr)"
      />
    </BaseView>
  );
}
