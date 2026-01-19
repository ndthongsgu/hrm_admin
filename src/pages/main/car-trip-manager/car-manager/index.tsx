import BaseView from "@/components/base-view/BaseView";
import CarPage from "./car";
import CarEmployeeManager from "./car-employee";
import CarTypePage from "./car-type";

export default function CarManager() {
  return (
    <BaseView
      tabs={[
        { key: "customer", title: "Xe", content: <CarPage /> },
        {
          key: "customerType",
          title: "Loại xe",
          content: <CarTypePage />,
        },
        {
          key: "carEmployee",
          title: "Nhân viên lái xe",
          content: <CarEmployeeManager />,
        },
      ]}
    />
  );
}
