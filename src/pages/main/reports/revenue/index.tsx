import { formatCurrency, formatDate } from "@/common/helpers/format";
import BaseView from "@/components/base-view/BaseView";
import FilterComponent, { type FilterField } from "@/components/filter/FilterCustom";
import TableCustom from "@/components/table/Table";
import { useSelectPaymentMethods } from "@/hooks/payment-method";
import { useSelectRoutes } from "@/hooks/route";
import { useRevenueByMethod, useRevenueTime } from "@/hooks/reports";
import type { RevenueFilterDto, RevenueTimePoint } from "@/dto/report.dto";
import { Button, Card, Col, Row, Space, Statistic, Typography } from "antd";
import { useEffect, useMemo, useState } from "react";
import { Area, AreaChart, Brush, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell } from "recharts";
import * as XLSX from "xlsx";
import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";

const { Title } = Typography;

type UIRevenueFilter = {
  dateRange: [string, string] | null;
  routeId?: string;
  methodId?: string;
  status?: "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";
};

const defaultRange = () => {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 29);
  const pad = (n: number) => `${n}`.padStart(2, "0");
  const f = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  return [f(start), f(end)] as [string, string];
};

export default function RevenueReportPage() {
  const [uiFilters, setUiFilters] = useState<UIRevenueFilter>({ dateRange: defaultRange() });
  const queryFilters: RevenueFilterDto | null = useMemo(() => {
    if (!uiFilters.dateRange) return null;
    const [startDate, endDate] = uiFilters.dateRange;
    return {
      startDate,
      endDate,
      routeId: uiFilters.routeId || undefined,
      methodId: uiFilters.methodId || undefined,
      status: uiFilters.status || undefined,
    };
  }, [uiFilters]);

  const { data: timeSeries, isLoading: loadingTime, refetch: refetchTime } = useRevenueTime(queryFilters);
  const { data: byMethod, isLoading: loadingMethod, refetch: refetchMethod } = useRevenueByMethod(queryFilters);
  const { data: routes } = useSelectRoutes();
  const { data: methods } = useSelectPaymentMethods();

  useEffect(() => {
    if (!uiFilters.dateRange) setUiFilters((p) => ({ ...p, dateRange: defaultRange() }));
  }, [uiFilters.dateRange]);

  const filterFields: FilterField[] = [
    {
      key: "dateRange",
      label: "Từ ngày / Đến ngày",
      type: "dateRange",
      col: 8,
    },
    {
      key: "routeId",
      label: "Tuyến xe",
      type: "select",
      options: routes.map((r) => ({ label: `${r.startLocation} → ${r.endLocation}`, value: r.id })),
      col: 8,
    },
    {
      key: "methodId",
      label: "Phương thức thanh toán",
      type: "select",
      options: methods.map((m) => ({ label: m.name, value: m.id })),
      col: 8,
    },
    {
      key: "status",
      label: "Trạng thái thanh toán",
      type: "select",
      options: [
        { label: "Tất cả", value: "" },
        { label: "Chờ xử lý", value: "PENDING" },
        { label: "Thành công", value: "SUCCESS" },
        { label: "Thất bại", value: "FAILED" },
        { label: "Đã hoàn tiền", value: "REFUNDED" },
      ],
      col: 8,
    },
  ];

  const handleFiltersChange = (next: Record<string, any>) => {
    setUiFilters(next as UIRevenueFilter);
  };

  const onSearch = () => {
    if (!uiFilters.dateRange) setUiFilters((p) => ({ ...p, dateRange: defaultRange() }));
    refetchTime();
    refetchMethod();
  };
  const onClear = () => setUiFilters({ dateRange: defaultRange() });

  const totalRevenue = useMemo(() => (timeSeries || []).reduce((s, d) => s + (d.totalRevenue || 0), 0), [timeSeries]);
  const totalTransactions = useMemo(() => (timeSeries || []).reduce((s, d) => s + (d.transactionCount || 0), 0), [timeSeries]);

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      (timeSeries || []).map((d) => ({
        Ngay: d.date,
        TongDoanhThu: d.totalRevenue,
        SoGiaoDich: d.transactionCount || 0,
        TrungBinh: d.transactionCount && d.transactionCount > 0 ? Math.round(d.totalRevenue / d.transactionCount) : 0,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "DoanhThu");
    XLSX.writeFile(wb, "doanh_thu_theo_thoi_gian.xlsx");
  };

  const exportPDF = async () => {
    if (!queryFilters) return;
    const blob = await rootApiService.postBlob(
      API_ENDPOINTS.REPORTS.PRINT.REVENUE_TIME,
      queryFilters
    );
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "doanh_thu_theo_thoi_gian.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  const colors = ["#5B8FF9", "#5AD8A6", "#5D7092", "#F6BD16", "#E86452", "#6DC8EC"];

  const columns = [
    { title: "Ngày", key: "date", render: (r: RevenueTimePoint) => formatDate(r.date) },
    { title: "Số giao dịch", key: "count", render: (r: RevenueTimePoint) => r.transactionCount || 0 },
    { title: "Tổng tiền", key: "total", render: (r: RevenueTimePoint) => formatCurrency(r.totalRevenue) },
    { title: "Trung bình/đơn", key: "avg", render: (r: RevenueTimePoint) => formatCurrency((r.transactionCount && r.transactionCount > 0) ? r.totalRevenue / r.transactionCount : 0) },
  ];

  return (
    <BaseView>
      <Row gutter={[12, 12]}>
        <Col span={24}>
          <FilterComponent
            title="Bộ lọc doanh thu theo thời gian"
            fields={filterFields}
            filters={uiFilters as any}
            onFiltersChange={handleFiltersChange}
            onSearch={onSearch}
            onClear={onClear}
          />
        </Col>
        <Col span={24}>
          <Row gutter={[12, 12]}>
            <Col xs={24} md={8}>
              <Card>
                <Statistic title="Tổng doanh thu" value={formatCurrency(totalRevenue)} />
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card>
                <Statistic title="Số giao dịch" value={totalTransactions} />
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card>
                <Statistic title="Trung bình/đơn" value={formatCurrency(totalTransactions > 0 ? totalRevenue / totalTransactions : 0)} />
              </Card>
            </Col>
          </Row>
        </Col>

        <Col span={24}>
          <Card title={<Title level={5}>Doanh thu theo thời gian</Title>} extra={<Space><Button onClick={exportExcel}>Xuất Excel</Button><Button onClick={exportPDF}>Xuất PDF</Button></Space>}>
            <div style={{ width: "100%", height: 360 }}>
              <ResponsiveContainer>
                <AreaChart data={timeSeries} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#5B8FF9" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="#5B8FF9" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={(d) => formatDate(d)} />
                  <YAxis tickFormatter={(v) => `${Math.round(Number(v) / 1000)}k`} />
                  <Tooltip formatter={(v: any) => formatCurrency(Number(v))} labelFormatter={(l) => `Ngày: ${formatDate(l as string)}`} />
                  <Legend />
                  <Area type="monotone" dataKey="totalRevenue" name="Tổng doanh thu" stroke="#5B8FF9" fillOpacity={1} fill="url(#colorRev)" />
                  <Brush dataKey="date" height={20} stroke="#5B8FF9" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        <Col span={24}>
          <Card title={<Title level={5}>Phân bổ theo phương thức thanh toán</Title>}>
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={byMethod as any} dataKey="total" nameKey="method" outerRadius={120} label>{(byMethod || []).map((_, idx) => (
                    <Cell key={idx} fill={colors[idx % colors.length]} />
                  ))}</Pie>
                  <Tooltip formatter={(v: any) => formatCurrency(Number(v))} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        <Col span={24}>
          <Card title={<Title level={5}>Chi tiết doanh thu</Title>}>
            <TableCustom<RevenueTimePoint>
              data={timeSeries}
              loading={loadingTime || loadingMethod}
              columns={columns as any}
              bordered
              sticky
            />
          </Card>
        </Col>
      </Row>
    </BaseView>
  );
}
