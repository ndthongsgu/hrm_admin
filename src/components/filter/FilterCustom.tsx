import { ClearOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Collapse,
  DatePicker,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Switch,
} from "antd";
import dayjs from "dayjs";
import type { ReactNode } from "react";

const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const { Panel } = Collapse;

export interface FilterField {
  key: string;
  label: string;
  type:
    | "input"
    | "textarea"
    | "select"
    | "multiSelect"
    | "number"
    | "numberRange"
    | "switch"
    | "date"
    | "dateRange"
    | "datetime"
    | "datetimeRange"
    | "customButton"
    | "custom";
  placeholder?: string;
  options?: { label: string; value: any }[];
  onClick?: () => void;
  buttonText?: string;
  disabled?: boolean;
  col?: number;
  rangeKeys?: { from: string; to: string };
  render?: (value: any, onChange: (next: any) => void) => ReactNode;
}

export interface FilterComponentProps {
  title?: string | ReactNode;
  fields: FilterField[];
  filters: Record<string, any>;
  onFiltersChange: (filters: Record<string, any>) => void;
  onSearch?: () => void;
  onClear?: () => void;
  showSearchButton?: boolean;
  showClearButton?: boolean;
}

function FilterComponent({
  title = "Tìm kiếm",
  fields,
  filters,
  onFiltersChange,
  onSearch,
  onClear,
  showSearchButton = true,
  showClearButton = true,
}: FilterComponentProps) {
  const handleFilterChange = (key: string, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const handleRangeChange = (
    fromKey: string,
    toKey: string,
    fromValue: any,
    toValue: any
  ) => {
    onFiltersChange({
      ...filters,
      [fromKey]: fromValue,
      [toKey]: toValue,
    });
  };

  const handleSearch = () => onSearch && onSearch();
  const handleClear = () => {
    onFiltersChange({});
    if (onClear) onClear();
  };

  const renderField = (field: FilterField) => {
    const value = filters[field.key];
    const fullWidth = { width: "100%" };

    switch (field.type) {
      case "input":
        return (
          <Input
            placeholder={field.placeholder || `Nhập ${field.label}`}
            value={value}
            disabled={field.disabled}
            style={fullWidth}
            onChange={(e) => handleFilterChange(field.key, e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        );
      case "textarea":
        return (
          <TextArea
            placeholder={field.placeholder || `Nhập ${field.label}`}
            value={value}
            disabled={field.disabled}
            style={fullWidth}
            rows={3}
            onChange={(e) => handleFilterChange(field.key, e.target.value)}
          />
        );
      case "number":
        return (
          <InputNumber
            placeholder={field.placeholder || `Nhập ${field.label}`}
            value={value}
            disabled={field.disabled}
            style={fullWidth}
            onChange={(val) => handleFilterChange(field.key, val)}
          />
        );
      case "numberRange": {
        if (!field.rangeKeys) return null;
        const fromValue = filters[field.rangeKeys.from];
        const toValue = filters[field.rangeKeys.to];
        return (
          <Space.Compact style={fullWidth}>
            <InputNumber
              placeholder="Từ"
              value={fromValue}
              disabled={field.disabled}
              style={{ width: "50%" }}
              min={0}
              onChange={(val) =>
                handleRangeChange(
                  field.rangeKeys!.from,
                  field.rangeKeys!.to,
                  val,
                  toValue
                )
              }
            />
            <InputNumber
              placeholder="Đến"
              value={toValue}
              disabled={field.disabled}
              style={{ width: "50%" }}
              min={fromValue || 0}
              onChange={(val) =>
                handleRangeChange(
                  field.rangeKeys!.from,
                  field.rangeKeys!.to,
                  fromValue,
                  val
                )
              }
            />
          </Space.Compact>
        );
      }
      case "select":
        return (
          <Select
            placeholder={field.placeholder || `Chọn ${field.label}`}
            value={value}
            disabled={field.disabled}
            style={fullWidth}
            onChange={(val) => handleFilterChange(field.key, val)}
            allowClear
          >
            {field.options?.map((opt) => (
              <Option key={opt.value} value={opt.value}>
                {opt.label}
              </Option>
            ))}
          </Select>
        );
      case "multiSelect":
        return (
          <Select
            placeholder={field.placeholder || `Chọn ${field.label}`}
            value={value || []}
            disabled={field.disabled}
            mode="multiple"
            style={fullWidth}
            onChange={(val) => handleFilterChange(field.key, val)}
            allowClear
          >
            {field.options?.map((opt) => (
              <Option key={opt.value} value={opt.value}>
                {opt.label}
              </Option>
            ))}
          </Select>
        );
      case "switch":
        return (
          <div
            style={{ ...fullWidth, display: "flex", justifyContent: "center" }}
          >
            <Switch
              checked={!!value}
              disabled={field.disabled}
              onChange={(val) => handleFilterChange(field.key, val)}
            />
          </div>
        );
      case "date":
        return (
          <DatePicker
            value={value ? dayjs(value) : null}
            disabled={field.disabled}
            style={fullWidth}
            onChange={(date) =>
              handleFilterChange(
                field.key,
                date ? date.format("YYYY-MM-DD") : null
              )
            }
          />
        );
      case "dateRange":
        return (
          <RangePicker
            value={
              value && Array.isArray(value) && value.length === 2
                ? [dayjs(value[0]), dayjs(value[1])]
                : null
            }
            style={fullWidth}
            disabled={field.disabled}
            onChange={(dates) =>
              handleFilterChange(
                field.key,
                dates && dates[0] && dates[1]
                  ? [
                      dates[0].format("YYYY-MM-DD"),
                      dates[1].format("YYYY-MM-DD"),
                    ]
                  : null
              )
            }
          />
        );
      case "datetime":
        return (
          <DatePicker
            showTime={{ format: "HH:mm" }}
            value={value ? dayjs(value) : null}
            disabled={field.disabled}
            style={{ width: "100%" }}
            format="YYYY-MM-DD HH:mm"
            onChange={(date) =>
              handleFilterChange(field.key, date ? date.toISOString() : null)
            }
          />
        );

      case "datetimeRange":
        return (
          <RangePicker
            showTime={{ format: "HH:mm" }}
            value={
              value && Array.isArray(value) && value.length === 2
                ? [dayjs(value[0]), dayjs(value[1])]
                : null
            }
            style={fullWidth}
            disabled={field.disabled}
            format="YYYY-MM-DD HH:mm"
            onChange={(dates) =>
              handleFilterChange(
                field.key,
                dates && dates[0] && dates[1]
                  ? [dates[0].toISOString(), dates[1].toISOString()]
                  : null
              )
            }
          />
        );

      case "customButton":
        return (
          <Button
            type="default"
            disabled={field.disabled}
            onClick={field.onClick}
            style={fullWidth}
          >
            {field.buttonText || field.label}
          </Button>
        );
      case "custom":
        return field.render
          ? field.render(value, (v) => handleFilterChange(field.key, v))
          : null;
      default:
        return null;
    }
  };

  return (
    <Collapse
      defaultActiveKey={["1"]}
      bordered={true}
      style={{ padding: 0, marginBottom: 3, background: "#C4D7E9" }}
    >
      <Panel header={title} key="1" style={{ padding: 0 }}>
        <Row gutter={[16, 16]}>
          {fields.map((field) => (
            <Col
              key={field.key}
              xs={24}
              sm={field.col || 12}
              md={field.col || 8}
              lg={field.col || 6}
              xl={field.col || 6}
            >
              <div>
                <label style={{ display: "block", marginBottom: 4 }}>
                  {field.label}
                </label>
                {renderField(field)}
              </div>
            </Col>
          ))}
        </Row>

        {(showSearchButton || showClearButton) && (
          <Row justify="center" style={{ marginTop: 16 }}>
            <Space>
              {showSearchButton && (
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  onClick={handleSearch}
                >
                  Tìm kiếm
                </Button>
              )}
              {showClearButton && (
                <Button icon={<ClearOutlined />} onClick={handleClear}>
                  Xóa bộ lọc
                </Button>
              )}
            </Space>
          </Row>
        )}
      </Panel>
    </Collapse>
  );
}

export default FilterComponent;
