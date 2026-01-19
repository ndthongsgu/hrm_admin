import BaseView from "@/components/base-view/BaseView";
import CustomerPage from "./customer";
import CustomerTypePage from "./customer-type";

export default function CustomerManager() {
  return (
    <BaseView
      tabs={[
        { key: "customer", title: "Khách hàng", content: <CustomerPage /> },
        {
          key: "customerType",
          title: "Loại khách hàng",
          content: <CustomerTypePage />,
        },
      ]}
    />
  );
}
