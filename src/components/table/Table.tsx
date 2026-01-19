import { EyeOutlined } from "@ant-design/icons";
import {
  Button,
  ConfigProvider,
  Empty,
  Pagination,
  Spin,
  Table,
  type TableColumnsType,
  type TableProps,
  Tooltip,
  Typography,
} from "antd";
import type { SizeType } from "antd/es/config-provider/SizeContext";
import {
  type Key,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

const { Text } = Typography;

export interface TableAction {
  key: string;
  label?: ReactNode;
  icon?: ReactNode;
  onClick?: (record: any, index: number) => void;
  render?: (record: any, index: number) => ReactNode;
  type?: "primary" | "default" | "dashed" | "link" | "text";
  danger?: boolean;
  showKey?: string;
  disabled?: boolean | ((record: any) => boolean);
  tooltip?: string;
}

export interface PaginationConfig {
  current: number;
  pageSize: number;
  total: number;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  showTotal?: boolean | ((total: number, range: [number, number]) => ReactNode);
  pageSizeOptions?: string[];
}

export interface TableCustomProps<T = any>
  extends Omit<TableProps<T>, "pagination"> {
  data: T[];
  loading?: boolean;
  pagination?: PaginationConfig;
  onPageChange?: (page: number, pageSize: number) => void;
  enableSelection?: boolean;
  selectedRowKeys?: Key[];
  onSelectionChange?: (selectedRowKeys: Key[], selectedRows: T[]) => void;
  selectionType?: "checkbox" | "radio";
  actions?: TableAction[];
  actionsWidth?: number;
  actionsTitle?: string;
  actionsFixed?: "left" | "right";
  columns: TableColumnsType<T>;
  size?: SizeType;
  bordered?: boolean;
  showHeader?: boolean;
  sticky?: boolean;
  columnWidths?: Record<string, number>;
  emptyText?: ReactNode;
  showRefreshButton?: boolean;
  onRefresh?: () => void;
  customToolbar?: ReactNode;
}

function TableCustom<T extends Record<string, any>>({
  data = [],
  loading = false,
  pagination,
  onPageChange,
  enableSelection = false,
  selectedRowKeys = [],
  onSelectionChange,
  selectionType = "checkbox",
  actions = [],
  actionsWidth = 120,
  actionsTitle = "Tác vụ",
  actionsFixed = "right",
  columns,
  bordered = false,
  showHeader = true,
  sticky = false,
  columnWidths = {},
  emptyText,
  showRefreshButton = false,
  onRefresh,
  customToolbar,
  ...tableProps
}: TableCustomProps<T>) {
  const [visibleColumns] = useState<string[]>(
    columns.map((col: any) => col.key || col.dataIndex).filter(Boolean)
  );

  const [internalColumnWidths, setInternalColumnWidths] =
    useState<Record<string, number>>(columnWidths);

  useEffect(() => {
    if (JSON.stringify(columnWidths) !== JSON.stringify(internalColumnWidths)) {
      setInternalColumnWidths(columnWidths);
    }
  }, [columnWidths, internalColumnWidths]);

  const rowSelection = enableSelection
    ? {
        type: selectionType,
        selectedRowKeys,
        onChange: (keys: Key[], rows: T[]) => onSelectionChange?.(keys, rows),
        getCheckboxProps: (record: T) => ({
          disabled: (record as any).disabled,
        }),
      }
    : undefined;

  const handlePageChange = useCallback(
    (page: number, pageSize: number) => onPageChange?.(page, pageSize),
    [onPageChange]
  );

  const actionsColumn = useMemo(() => {
    if (!actions.length) return null;

    const renderActions = (record: T, index: number) => {
      const visibleActions = actions.filter((action) => {
        if (!action.showKey) return true;
        return record[action.showKey] !== false;
      });

      if (!visibleActions.length) return null;

      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
          }}
        >
          {visibleActions.map((action, idx) => {
            const isDisabled =
              typeof action.disabled === "function"
                ? action.disabled(record)
                : !!action.disabled;

            const handleClick = () => {
              if (!isDisabled) {
                action.onClick?.(record, index);
              }
            };

            const button = action.render ? (
              <span
                onClick={
                  !isDisabled
                    ? () => action.onClick?.(record, index)
                    : undefined
                }
                style={{
                  cursor: isDisabled ? "not-allowed" : "pointer",
                  opacity: isDisabled ? 0.5 : 1,
                }}
              >
                {action.render(record, index)}
              </span>
            ) : (
              <Button
                key={action.key}
                type={action.type || "text"}
                icon={action.icon}
                danger={action.danger}
                disabled={isDisabled}
                onClick={handleClick}
                style={{
                  padding: 4,
                  minWidth: 32,
                  opacity: isDisabled ? 0.5 : 1,
                  cursor: isDisabled ? "not-allowed" : "pointer",
                }}
              >
                {action.label}
              </Button>
            );

            const wrappedButton = (
              <span key={action.key} style={{ display: "inline-flex" }}>
                {button}
              </span>
            );

            return action.tooltip ? (
              <Tooltip key={action.key + idx} title={action.tooltip}>
                {wrappedButton}
              </Tooltip>
            ) : (
              wrappedButton
            );
          })}
        </div>
      );
    };

    return {
      title: actionsTitle,
      key: "actions",
      width: actionsWidth,
      fixed: actionsFixed,
      align: "center" as const,
      render: renderActions,
    };
  }, [actions, actionsTitle, actionsWidth, actionsFixed]);

  const finalColumns = useMemo(
    () => [
      ...columns
        .filter((col) => {
          return col.key && visibleColumns.includes(String(col.key));
        })
        .map((col) => ({ ...col })),
      ...(actionsColumn ? [actionsColumn] : []),
    ],
    [columns, visibleColumns, actionsColumn]
  );

  const paginationComponent = pagination ? (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 16,
        padding: "12px 0",
        width: "100%",
      }}
    >
      <Text type="secondary">
        {pagination.showTotal && typeof pagination.showTotal === "function"
          ? pagination.showTotal(pagination.total, [
              (pagination.current - 1) * pagination.pageSize + 1,
              Math.min(
                pagination.current * pagination.pageSize,
                pagination.total
              ),
            ])
          : `${(pagination.current - 1) * pagination.pageSize + 1}-${Math.min(
              pagination.current * pagination.pageSize,
              pagination.total
            )} of ${pagination.total}`}
      </Text>
      <Pagination
        {...pagination}
        onChange={handlePageChange}
        onShowSizeChange={(current, size) => handlePageChange(current, size)}
        showQuickJumper={false}
        showTotal={undefined}
        pageSizeOptions={
          pagination.pageSizeOptions || ["10", "20", "50", "100"]
        }
      />
    </div>
  ) : null;

  return (
    <ConfigProvider
      theme={{
        components: {
          Table: {
            headerBg: "#F5F7FA",
          },
        },
      }}
    >
      <style>{`
        .ant-table {
          font-family: "Inter", "Roboto", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          font-size: 12px;
        }

        .ant-table-thead > tr > th {
          background: #F5F7FA !important;
          color: #0D6EFD !important;
          position: sticky !important;
          top: 0 !important;
          z-index: 100 !important;
        }

        .custom-table-wrapper {
          border-radius: 6px;
          border: 0.5px solid #DDE1E6;
          overflow: hidden;
        }

        .ant-table-tbody > tr > td {
          border-bottom: 0.5px solid #DDE1E6;
        }

        .ant-table-tbody > tr:nth-child(odd) > td {
          background-color: #ffffff;
        }

        .ant-table-tbody > tr:nth-child(even) > td {
          background-color: #fafafa;
        }
      `}</style>

      <div>
        {(customToolbar || showRefreshButton) && (
          <div
            style={{
              display: "flex",
              gap: 10,
              margin: "16px 0",
              alignItems: "center",
            }}
          >
            {customToolbar}
            {showRefreshButton && (
              <Tooltip title="Làm mới">
                <Button
                  type="primary"
                  icon={<EyeOutlined />}
                  onClick={onRefresh}
                >
                  Làm mới
                </Button>
              </Tooltip>
            )}
          </div>
        )}

        <div className="custom-table-wrapper">
          <Spin spinning={loading}>
            <Table
              {...tableProps}
              columns={finalColumns as any}
              dataSource={data}
              rowSelection={rowSelection}
              bordered={bordered}
              showHeader={showHeader}
              sticky={sticky}
              pagination={false}
              rowKey={(record) =>
                record.id ||
                record.key ||
                record._id ||
                record.uuid ||
                `row-${JSON.stringify(record).slice(0, 50)}`
              }
              locale={{
                emptyText: emptyText || (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="Không có dữ liệu"
                  />
                ),
              }}
            />
          </Spin>
        </div>
        {paginationComponent}
      </div>
    </ConfigProvider>
  );
}

export default TableCustom;
