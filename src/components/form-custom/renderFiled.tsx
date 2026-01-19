import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Spin,
  Switch,
  TimePicker,
} from "antd";
import dayjs from "dayjs";
import React from "react";
import type { FormField } from ".";
import FileUpload from "../file-upload";
import RichText from "../rich-text";

const { Option } = Select;

function useRenderFormCustom(form: any, initialValues: any) {
  const renderField = (field: FormField) => {
    const rules: any[] = [];

    if (field.required) {
      rules.push({
        required: true,
        message: `Vui lòng ${
          field.type === "select" || field.type === "multiselect"
            ? "chọn"
            : "nhập"
        } ${field.label.toLowerCase()}!`,
      });
    }

    if (field.maxLength) {
      rules.push({
        max: field.maxLength,
        message: `${field.label} không được vượt quá ${field.maxLength} ký tự!`,
      });
    }

    if (field.rules && Array.isArray(field.rules)) {
      rules.push(...field.rules);
    }

    switch (field.type) {
      /** ------------------------- INPUT ------------------------- */
      case "input":
        return (
          <Form.Item
            key={field.name}
            label={field.label}
            name={field.name}
            rules={rules}
            style={{ gridColumn: field.gridColumn, ...field.style }}
          >
            <Input
              placeholder={field.placeholder}
              style={field.inputStyle}
              disabled={field.disabled}
              onChange={(e) => field?.onChange?.(e.target.value, form)}
              size="large"
            />
          </Form.Item>
        );

      /** ------------------------- NUMBER ------------------------- */
      case "number":
        return (
          <Form.Item
            key={field.name}
            label={field.label}
            name={field.name}
            rules={rules}
            style={{ gridColumn: field.gridColumn, ...field.style }}
          >
            <InputNumber
              placeholder={field.placeholder}
              style={field.style || { width: "100%" }}
              min={field.min}
              max={field.max}
              step={field.step}
              disabled={field.disabled}
              addonAfter={field.addonAfter}
              value={form.getFieldValue(field.name)}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => (value ? Number(value.replace(/,/g, "")) : 0)}
              onChange={(value) => {
                form.setFieldsValue({ [field.name]: value });
                field?.onChange?.(value, form);
              }}
              size="large"
            />
          </Form.Item>
        );

      /** ------------------------- SELECT ------------------------- */
      case "select":
      case "multiselect":
        return (
          <Form.Item
            key={field.name}
            label={field.label}
            name={field.name}
            rules={rules}
            style={{ gridColumn: field.gridColumn, ...field.style }}
          >
            <Select
              mode={field.type === "multiselect" ? "multiple" : undefined}
              placeholder={field.placeholder}
              style={field.inputStyle}
              disabled={field.disabled}
              loading={field.loading}
              allowClear={field.allowClear !== false}
              showSearch={field.showSearch || false}
              optionFilterProp={field.optionFilterProp || "children"}
              filterOption={field.filterOption}
              onChange={(value) => field?.onChange?.(value, form)}
              {...(field.showSearch &&
                field.onSearch && {
                  onSearch: (value) => field.onSearch?.(value),
                })}
              onClear={() => field?.onClear?.()}
              notFoundContent={
                field?.loading ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: "12px 0",
                    }}
                  >
                    <Spin size="small" />
                  </div>
                ) : null
              }
              size="large"
            >
              {field.options?.map((option) => (
                <Option
                  key={option.id || option.value}
                  value={
                    field.optionValue
                      ? option[field.optionValue as keyof typeof option]
                      : option.value || option.id
                  }
                >
                  {option.node ||
                    option.name ||
                    (field.optionLabel
                      ? option[field.optionLabel as keyof typeof option]
                      : "")}
                </Option>
              ))}
            </Select>
          </Form.Item>
        );

      /** ------------------------- DATEPICKER & DATETIMEPICKER ------------------------- */
      case "datetimepicker":
        return (
          <Form.Item
            key={field.name}
            label={field.label}
            name={field.name}
            rules={rules}
            style={{ gridColumn: field.gridColumn, ...field.style }}
            getValueProps={(value) => {
              return {
                value:
                  value && dayjs.isDayjs(value) && value.isValid()
                    ? value
                    : null,
              };
            }}
          >
            <DatePicker
              placeholder={field.placeholder}
              format={field.dateFormat || "DD/MM/YYYY HH:mm"}
              style={{ width: "100%", ...field.inputStyle }}
              disabled={field.disabled}
              showTime={{
                format: "HH:mm",
                defaultValue: dayjs("00:00", "HH:mm"),
              }}
              onChange={(date) => {
                const newDate = date ? date.second(0) : null;
                form.setFieldsValue({ [field.name]: newDate });
                field?.onChange?.(newDate, form);
              }}
              size="large"
              disabledDate={field.disabledDate}
              disabledTime={field.disabledTime}
            />
          </Form.Item>
        );

      case "datepicker":
        return (
          <Form.Item
            key={field.name}
            label={field.label}
            name={field.name}
            rules={rules}
            style={{ gridColumn: field.gridColumn, ...field.style }}
            getValueProps={(value) => ({
              value:
                value && dayjs.isDayjs(value) && value.isValid() ? value : null,
            })}
          >
            <DatePicker
              placeholder={field.placeholder}
              format={field.dateFormat || "DD/MM/YYYY"}
              style={{ width: "100%", ...field.inputStyle }}
              disabled={field.disabled}
              onChange={(date) => {
                form.setFieldsValue({ [field.name]: date });
                field?.onChange?.(date, form);
              }}
              size="large"
              disabledDate={field.disabledDate}
            />
          </Form.Item>
        );

      /** ------------------------- TIMEPICKER ------------------------- */
      case "timePicker":
        return (
          <Form.Item
            key={field.name}
            label={field.label}
            name={field.name}
            rules={rules}
            style={{ gridColumn: field.gridColumn, ...field.style }}
          >
            <TimePicker
              style={{ width: "100%", ...field.inputStyle }}
              format={field.dateFormat || "HH:mm"}
              disabledTime={field.disabledTime}
              disabled={field.disabled}
              onChange={(time) => field?.onChange?.(time, form)}
              size="large"
            />
          </Form.Item>
        );

      /** ------------------------- TIMERANGEPICKER ------------------------- */
      case "timeRangePicker":
        return (
          <Form.Item
            key={field.name}
            label={field.label}
            name={field.name}
            rules={rules}
            style={{ gridColumn: field.gridColumn, ...field.style }}
          >
            <TimePicker.RangePicker
              format={field.dateFormat || "HH:mm"}
              style={{ width: "100%", ...field.inputStyle }}
              disabledTime={field.disabledTime}
              onChange={(times) => field?.onChange?.(times, form)}
              size="large"
            />
          </Form.Item>
        );

      /** ------------------------- TEXTAREA ------------------------- */
      case "textarea":
        return (
          <Form.Item
            key={field.name}
            label={field.label}
            name={field.name}
            rules={rules}
            style={{ gridColumn: field.gridColumn, ...field.style }}
          >
            <Input.TextArea
              placeholder={field.placeholder}
              rows={4}
              style={field.inputStyle}
              size="large"
            />
          </Form.Item>
        );

      /** ------------------------- RICHTEXT ------------------------- */
      case "richtext":
        return (
          <RichText
            key={field.name}
            field={field}
            initialValue={initialValues?.[field.name]}
            form={form}
          />
        );

      /** ------------------------- SWITCH ------------------------- */
      case "switch":
        return (
          <Form.Item
            key={field.name}
            label={field.label}
            name={field.name}
            valuePropName="checked"
            rules={rules}
            style={{ gridColumn: field.gridColumn, ...field.style }}
          >
            <Switch
              defaultChecked={true}
              onChange={(checked) => field?.onChange?.(checked, form)}
            />
          </Form.Item>
        );

      /** ------------------------- CHECKBOX ------------------------- */
      case "checkbox":
        return (
          <Form.Item
            key={field.name}
            label={field.label}
            name={field.name}
            valuePropName="checked"
            rules={rules}
            style={{ gridColumn: field.gridColumn, ...field.style }}
          >
            <Checkbox
              onChange={(e) => field?.onChange?.(e.target.checked, form)}
            >
              {field.label}
            </Checkbox>
          </Form.Item>
        );

      /** ------------------------- RADIOGROUP ------------------------- */
      case "radioGroup":
        return (
          <Form.Item
            key={field.name}
            label={field.label}
            name={field.name}
            rules={rules}
            style={{ gridColumn: field.gridColumn, ...field.style }}
          >
            <Radio.Group
              style={field.inputStyle}
              disabled={field.disabled}
              onChange={(e) => field?.onChange?.(e.target.value, form)}
            >
              {field.options?.map((option) => (
                <Radio
                  key={option.id || option.value}
                  value={
                    field.optionValue
                      ? option[field.optionValue as keyof typeof option]
                      : option.value || option.id
                  }
                >
                  {option.name ||
                    (field.optionLabel
                      ? option[field.optionLabel as keyof typeof option]
                      : "")}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>
        );

      /** ------------------------- FILE / IMAGE ------------------------- */
      case "file":
      case "image":
        return (
          <FileUpload
            key={field.name}
            mode={field.isSingle ? "single" : "multi"}
            initValue={initialValues?.[field.name]}
            onFileUploaded={(file) =>
              form.setFieldsValue({ [field.name]: file })
            }
            style={{ gridColumn: field.gridColumn, ...field.style }}
            type={field.type === "image" ? "image" : "document"}
            label={field.label}
            name={field.name}
          />
        );

      /** ------------------------- ACTION BUTTON ------------------------- */
      case "action":
        return (
          <Form.Item
            key={field.name}
            label={field.label}
            name={field.name}
            rules={rules}
            style={{ gridColumn: field.gridColumn, ...field.style }}
          >
            <Button
              type="primary"
              loading={field.buttonLoading}
              disabled={field.disabled}
              onClick={() => field?.onAction?.(form.getFieldsValue(), form)}
              size="large"
            >
              {field.buttonText || field.label || "Action"}
            </Button>
          </Form.Item>
        );

      /** ------------------------- CUSTOM COMPONENT ------------------------- */
      case "custom":
        if (!field.customComponent) return null;
        return (
          <Form.Item
            key={field.name}
            label={field.label}
            name={field.name}
            rules={rules}
            style={{ gridColumn: field.gridColumn, ...field.style }}
          >
            {React.isValidElement(field.customComponent)
              ? React.cloneElement(field.customComponent as any, {
                  form,
                  field,
                  initialValue: initialValues?.[field.name],
                  value: form.getFieldValue(field.name), // Add current form value
                  onChange: (value: any) => {
                    form.setFieldsValue({ [field.name]: value });
                    field.onChange?.(value, form);
                  },
                })
              : field.customComponent}
          </Form.Item>
        );

      /** ------------------------- DEFAULT ------------------------- */
      default:
        return null;
    }
  };

  return { renderField };
}

export default useRenderFormCustom;
