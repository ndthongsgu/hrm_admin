import BaseView from "@/components/base-view/BaseView";
import FilterComponent, { type FilterField } from "@/components/filter/FilterCustom";
import TableCustom from "@/components/table/Table";
import { useBookingsByRoute, useBookingsStatusByRoute } from "@/hooks/reports";
import { useAllCustomerTypes } from "@/hooks/customer-type";
import type { BookingsFilterDto } from "@/dto/report.dto";
import { Button, Card, Col, Row, Space, Typography } from "antd";
import { useEffect, useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import * as XLSX from "xlsx";
import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";

const { Title } = Typography;

type UIBookingsFilter = {
  dateRange: [string, string] | null;
  statuses?: ("new" | "await_payment" | "await_go" | "departing" | "completed" | "cancelled")[];
  customerTypeId?: string;
};

const defaultRange = (): [string, string] => {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 29);
  const pad = (n: number) => `${n}`.padStart(2, "0");
  const f = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  return [f(start), f(end)];
};

export default function BookingsByRouteReportPage() {
  const [uiFilters, setUiFilters] = useState<UIBookingsFilter>({ dateRange: defaultRange() });

  const queryFilters: BookingsFilterDto | null = useMemo(() => {
    if (!uiFilters.dateRange) return null;
    const [startDate, endDate] = uiFilters.dateRange;
    return {
      startDate,
      endDate,
      statuses: uiFilters.statuses && uiFilters.statuses.length ? (uiFilters.statuses as any) : undefined,
      customerTypeId: uiFilters.customerTypeId || undefined,
    };
  }, [uiFilters]);

  const { data: customerTypes } = useAllCustomerTypes();
  const { data: topRoutes, isLoading: loadingTop, refetch: refetchTop } = useBookingsByRoute(queryFilters);
  const { data: statusByRoute, isLoading: loadingStatus, refetch: refetchStatus } = useBookingsStatusByRoute(queryFilters);

  useEffect(() => {
    if (!uiFilters.dateRange) setUiFilters((p) => ({ ...p, dateRange: defaultRange() }));
  }, [uiFilters.dateRange]);

  const filterFields: FilterField[] = [
    { key: "dateRange", label: "Khoảng thời gian", type: "dateRange", col: 8 },
    {
      key: "statuses",
      label: "Trạng thái vé",
      type: "multiSelect",
      options: [
        { label: "Chờ xác nhận", value: "new" },
        { label: "Chờ thanh toán", value: "await_payment" },
        { label: "Chờ khởi hành", value: "await_go" },
        { label: "Đang khởi hành", value: "departing" },
        { label: "Hoàn thành", value: "completed" },
        { label: "Đã hủy", value: "cancelled" },
      ],
      col: 8,
    },
    {
      key: "customerTypeId",
      label: "Loại khách hàng",
      type: "select",
      options: customerTypes.map((c) => ({ label: c.name, value: c.id })),
      col: 8,
    },
  ];

  const handleFiltersChange = (next: Record<string, any>) => setUiFilters(next as UIBookingsFilter);
  const onSearch = () => {
    if (!uiFilters.dateRange) setUiFilters((p) => ({ ...p, dateRange: defaultRange() }));
    refetchTop();
    refetchStatus();
  };
  const onClear = () => setUiFilters({ dateRange: defaultRange() });

  const tableData = useMemo(() => {
    const statusMap: Record<string, { cancelled: number; success: number }> = {};
    (statusByRoute || []).forEach((r) => {
      statusMap[r.routeName] = { cancelled: r.cancelled, success: r.success };
    });

    return (topRoutes || []).map((r) => ({
      routeName: r.routeName,
      total: r.totalBookings,
      success: statusMap[r.routeName]?.success ?? 0,
      cancelled: statusMap[r.routeName]?.cancelled ?? 0,
      cancelRate: r.totalBookings ? Math.round(((statusMap[r.routeName]?.cancelled ?? 0) / r.totalBookings) * 1000) / 10 : 0,
    }));
  }, [topRoutes, statusByRoute]);

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(tableData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "TopTuyen");
    XLSX.writeFile(wb, "luot_dat_ve_theo_tuyen.xlsx");
  };

  const exportPDF = async () => {
    if (!queryFilters) return;
    const blob = await rootApiService.postBlob(
      API_ENDPOINTS.REPORTS.PRINT.BOOKINGS_BY_ROUTE,
      queryFilters
    );
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "luot_dat_ve_theo_tuyen.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  return (
    <BaseView>
      <Row gutter={[12, 12]}>
        <Col span={24}>
          <FilterComponent
            title="Bộ lọc lượt đặt vé theo tuyến"
            fields={filterFields}
            filters={uiFilters as any}
            onFiltersChange={handleFiltersChange}
            onSearch={onSearch}
            onClear={onClear}
          />
        </Col>

        <Col span={24}>
          <Card title={<Title level={5}>Top tuyến có lượt đặt vé cao nhất</Title>} extra={<Space><Button onClick={exportExcel}>Xuất Excel</Button><Button onClick={exportPDF}>Xuất PDF</Button></Space>}>
            <div style={{ width: "100%", height: 420 }}>
              <ResponsiveContainer>
                <BarChart data={(topRoutes || []).slice(0, 10)} layout="vertical" margin={{ left: 60, right: 20, top: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tickFormatter={(v) => String(v)} />
                  <YAxis type="category" dataKey="routeName" width={200} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="totalBookings" name="Số lượt đặt" fill="#5B8FF9" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        <Col span={24}>
          <Card title={<Title level={5}>Tỷ lệ vé hủy theo tuyến</Title>}>
            <div style={{ width: "100%", height: 420 }}>
              <ResponsiveContainer>
                <BarChart data={statusByRoute || []} margin={{ left: 20, right: 20, top: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="routeName" tick={{ fontSize: 12 }} interval={0} angle={-15} height={80} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="success" name="Đặt thành công" stackId="a" fill="#5AD8A6" />
                  <Bar dataKey="cancelled" name="Vé hủy" stackId="a" fill="#E86452" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        <Col span={24}>
          <Card title={<Title level={5}>Bảng chi tiết</Title>}>
            <TableCustom<any>
              data={tableData}
              loading={loadingTop || loadingStatus}
              columns={[
                { title: "Tuyến", key: "routeName", dataIndex: "routeName" },
                { title: "Số lượt đặt", key: "total", dataIndex: "total" },
                { title: "Vé thành công", key: "success", dataIndex: "success" },
                { title: "Vé hủy", key: "cancelled", dataIndex: "cancelled" },
                { title: "Tỷ lệ hủy (%)", key: "cancelRate", render: (r: any) => `${r.cancelRate}%` },
              ] as any}
              bordered
              sticky
            />
          </Card>
        </Col>
      </Row>
    </BaseView>
  );
}
