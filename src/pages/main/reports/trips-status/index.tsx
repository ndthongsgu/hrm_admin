import BaseView from "@/components/base-view/BaseView";
import FilterComponent, { type FilterField } from "@/components/filter/FilterCustom";
import TableCustom from "@/components/table/Table";
import { useTripsStatus, useTripsTrend } from "@/hooks/reports";
import { useSelectRoutes } from "@/hooks/route";
import { useSelectCarTypes } from "@/hooks/car-type";
import type { TripsFilterDto } from "@/dto/report.dto";
import { Button, Card, Col, Row, Space, Typography } from "antd";
import { useEffect, useMemo, useState } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, LineChart, Line, CartesianGrid, XAxis, YAxis, Brush } from "recharts";
import * as XLSX from "xlsx";
import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";

const { Title } = Typography;

type UITripsFilter = {
  dateRange: [string, string] | null;
  routeId?: string;
  carTypeId?: string;
};

const defaultRange = (): [string, string] => {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 29);
  const pad = (n: number) => `${n}`.padStart(2, "0");
  const f = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  return [f(start), f(end)];
};

export default function TripsStatusReportPage() {
  const [uiFilters, setUiFilters] = useState<UITripsFilter>({ dateRange: defaultRange() });

  const queryFilters: TripsFilterDto | null = useMemo(() => {
    if (!uiFilters.dateRange) return null;
    const [startDate, endDate] = uiFilters.dateRange;
    return {
      startDate,
      endDate,
      routeId: uiFilters.routeId || undefined,
      carTypeId: uiFilters.carTypeId || undefined,
    };
  }, [uiFilters]);

  const { data: routes } = useSelectRoutes();
  const { data: carTypes } = useSelectCarTypes();
  const { data: donutData, isLoading: loadingDonut, refetch: refetchDonut } = useTripsStatus(queryFilters);
  const { data: trendData, isLoading: loadingTrend, refetch: refetchTrend } = useTripsTrend(queryFilters);

  useEffect(() => {
    if (!uiFilters.dateRange) setUiFilters((p) => ({ ...p, dateRange: defaultRange() }));
  }, [uiFilters.dateRange]);

  const filterFields: FilterField[] = [
    { key: "dateRange", label: "Khoảng thời gian", type: "dateRange", col: 8 },
    {
      key: "routeId",
      label: "Tuyến xe",
      type: "select",
      options: routes.map((r) => ({ label: `${r.startLocation} → ${r.endLocation}`, value: r.id })),
      col: 8,
    },
    {
      key: "carTypeId",
      label: "Loại xe",
      type: "select",
      options: carTypes.map((c) => ({ label: c.name, value: c.id })),
      col: 8,
    },
  ];

  const handleFiltersChange = (next: Record<string, any>) => setUiFilters(next as UITripsFilter);
  const onSearch = () => {
    if (!uiFilters.dateRange) setUiFilters((p) => ({ ...p, dateRange: defaultRange() }));
    refetchDonut();
    refetchTrend();
  };
  const onClear = () => setUiFilters({ dateRange: defaultRange() });

  const tableData = useMemo(() => {
    return (trendData || []).map((d) => ({
      date: d.date,
      completed: d.completedTrips,
      cancelled: d.cancelledTrips,
      total: d.completedTrips + d.cancelledTrips,
      cancelRate: (d.completedTrips + d.cancelledTrips) ? Math.round((d.cancelledTrips / (d.completedTrips + d.cancelledTrips)) * 1000) / 10 : 0,
    }));
  }, [trendData]);

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(tableData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Chuyen");
    XLSX.writeFile(wb, "so_chuyen_da_chay_bi_huy.xlsx");
  };

  const exportPDF = async () => {
    if (!queryFilters) return;
    const blob = await rootApiService.postBlob(
      API_ENDPOINTS.REPORTS.PRINT.TRIPS_STATUS,
      queryFilters
    );
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "so_chuyen_da_chay_bi_huy.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  const colors = ["#5AD8A6", "#E86452"];

  return (
    <BaseView>
      <Row gutter={[12, 12]}>
        <Col span={24}>
          <FilterComponent
            title="Bộ lọc tình trạng chuyến chạy / hủy"
            fields={filterFields}
            filters={uiFilters as any}
            onFiltersChange={handleFiltersChange}
            onSearch={onSearch}
            onClear={onClear}
          />
        </Col>

        <Col span={24}>
          <Space style={{ width: "100%", justifyContent: "flex-end" }}>
            <Button onClick={exportExcel}>Xuất Excel</Button>
            <Button onClick={exportPDF}>Xuất PDF</Button>
          </Space>
        </Col>

        <Col span={24}>
          <Card title={<Title level={5}>Tỷ lệ chuyến chạy / hủy</Title>}>
            <div style={{ width: "100%", height: 420 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={donutData as any} dataKey="total" nameKey="status" outerRadius={120} label>
                    {(donutData || []).map((_, idx) => (
                      <Cell key={idx} fill={colors[idx % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        <Col span={24}>
          <Card title={<Title level={5}>Xu hướng hủy chuyến theo thời gian</Title>}>
            <div style={{ width: "100%", height: 420 }}>
              <ResponsiveContainer>
                <LineChart data={trendData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="completedTrips" name="Đã chạy" stroke="#5AD8A6" />
                  <Line type="monotone" dataKey="cancelledTrips" name="Bị hủy" stroke="#E86452" />
                  <Brush dataKey="date" height={20} stroke="#5B8FF9" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        <Col span={24}>
          <Card title={<Title level={5}>Bảng chi tiết</Title>}>
            <TableCustom<any>
              data={tableData}
              loading={loadingDonut || loadingTrend}
              columns={[
                { title: "Ngày", key: "date", dataIndex: "date" },
                { title: "Tổng chuyến", key: "total", dataIndex: "total" },
                { title: "Đã chạy", key: "completed", dataIndex: "completed" },
                { title: "Bị hủy", key: "cancelled", dataIndex: "cancelled" },
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
