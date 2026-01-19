import { CloseCircleOutlined, SaveOutlined } from "@ant-design/icons";
import { Button, Divider, Form, Spin, type FormInstance } from "antd";
import dayjs, { Dayjs } from "dayjs";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  type ReactNode,
} from "react";
import Title from "../title";
import useRenderFormCustom from "./renderFiled";

export interface FormRef {
  form: FormInstance<any>;
  validateFields: () => void;
  getFieldsValue: () => Record<string, any>;
  resetFields: () => void;
  setFieldsValue: (values: any) => void;
}

export interface FormField {
  name: string;
  label: string;
  isSingle?: boolean;
  type:
    | "input"
    | "select"
    | "multiselect"
    | "textarea"
    | "richtext"
    | "file"
    | "switch"
    | "datepicker"
    | "datetimepicker"
    | "daterangepicker"
    | "timePicker"
    | "number"
    | "image"
    | "checkbox"
    | "action"
    | "radioGroup"
    | "timeRangePicker"
    | "custom";
  formatString?: string;
  required?: boolean;
  placeholder?: string;
  maxLength?: number;
  options?: { id: string; name: string; value?: any; node?: any }[];
  gridColumn?: string;
  fileType?: "image" | "document";
  optionLabel?: string;
  optionValue?: string;
  toggleFields?: FormField[];
  dateFormat?: string;
  rangePlaceholder?: [string, string];
  style?: React.CSSProperties;
  inputStyle?: React.CSSProperties;
  render?: (fieldProps: {
    value: any;
    onChange: (val: any) => void;
  }) => React.ReactNode;
  onChange?: (value: any, form?: any) => void;
  onClear?: () => void;
  disabledDate?: (current: Dayjs) => boolean;
  disabledTime?: (current: Dayjs) => any;
  disabled?: boolean;
  defaultValue?: Dayjs;
  step?: number;
  min?: number;
  max?: number;
  addonAfter?: string;
  customComponent?: ReactNode;
  multiple?: boolean;
  maxCount?: number;
  rules?: any[];
  accept?: string;
  maxSize?: number;
  showSearch?: boolean;
  onSearch?: (value: any) => void;
  loading?: boolean;
  onAction?: (value: any, form?: any) => void;
  buttonLoading?: boolean;
  buttonText?: string;
  showUploadList?: boolean;
  listType?: "text" | "picture" | "picture-card" | "picture-circle";
  allowClear?: boolean;
  showTime?: boolean;
  optionFilterProp?: string;
  filterOption?: (input: string, option: any) => boolean;
}

export interface FormCustomProps {
  title?: string;
  fields: any[];
  loading?: boolean;
  initialValues?: Record<string, any>;
  onSubmit?: (values: any) => void;
  onCancel?: () => void;
  submitText?: string;
  cancelText?: string;
  showDivider?: boolean;
  formStyle?: React.CSSProperties;
  gridColumns?: string;
  gap?: string;
  onChangeValue?: (allValues: any) => void;
  form?: FormInstance<any>;
}

const FormCustom = forwardRef<FormRef, FormCustomProps>(function FormCustom(
  {
    title,
    fields,
    loading = false,
    initialValues,
    onSubmit,
    onCancel,
    onChangeValue,
    submitText = "Lưu",
    cancelText = "Thoát",
    showDivider = true,
    formStyle,
    gridColumns = "1fr 1fr 1fr 1fr",
    gap = "16px",
    form: externalForm,
  },
  ref
) {
  const [internalForm] = Form.useForm();
  const form = externalForm || internalForm;
  const { renderField } = useRenderFormCustom(form, initialValues);
  const handleValuesChange = () => {
    onChangeValue?.(form.getFieldsValue());
  };
  const handleError = async () => {
    try {
      const formError = await form.validateFields();
      return formError;
    } catch (error: any) {
      if (error && error.errorFields) {
        form.scrollToField(error.errorFields[0].name);
      }
      return false;
    }
  };
  useImperativeHandle(ref, () => ({
    validateFields: handleError,
    getFieldsValue: () => ({ ...form.getFieldsValue() }),
    resetFields: () => form.resetFields(),
    setFieldsValue: (values: any) => form.setFieldsValue(values),
    form,
  }));

  useEffect(() => {
    if (!initialValues) return;
    const valuesWithDayjs: Record<string, any> = { ...initialValues };

    fields.forEach((field) => {
      const value = initialValues[field.name];
      if (field.type === "datepicker" || field.type === "datetimepicker") {
        if (!value) {
          valuesWithDayjs[field.name] = null;
        } else if (dayjs.isDayjs(value)) {
          valuesWithDayjs[field.name] = value;
        } else if (typeof value === "string") {
          const converted = dayjs(value);
          if (converted.isValid()) {
            valuesWithDayjs[field.name] = converted;
          } else {
            valuesWithDayjs[field.name] = null;
          }
        } else {
          valuesWithDayjs[field.name] = null;
        }
      }

      if (field.type === "daterangepicker") {
        if (Array.isArray(value) && value.length === 2) {
          valuesWithDayjs[field.name] = value.map((d) => {
            if (dayjs.isDayjs(d)) return d;
            if (typeof d === "string") {
              const converted = dayjs(d);
              return converted.isValid() ? converted : null;
            }
            return null;
          });
        }
      }

      if (field.type === "richtext") {
        valuesWithDayjs[field.name] = value || "";
      }
    });

    form.setFieldsValue(valuesWithDayjs);
  }, [initialValues, fields, form]);

  const handleSubmitButton = async () => {
    if (!onSubmit) return form.submit();

    try {
      await form.validateFields();
    } catch (error: any) {
      if (error && error.errorFields) {
        form.scrollToField(error.errorFields[0].name);
      }
      return;
    }

    const values = { ...form.getFieldsValue() };

    fields.forEach((field) => {
      const val = values[field.name];
      if (!val) return;

      if (field.type === "datepicker") {
        if (dayjs.isDayjs(val)) values[field.name] = val.format("YYYY-MM-DD");
      }

      if (field.type === "datetimepicker") {
        if (dayjs.isDayjs(val))
          values[field.name] = val.format("YYYY-MM-DDTHH:mm:ss");
      }

      if (field.type === "daterangepicker") {
        if (Array.isArray(val) && val.length === 2) {
          values[field.name] = val.map((d) =>
            dayjs.isDayjs(d) ? d.format("YYYY-MM-DD") : d
          );
        }
      }
    });

    onSubmit(values);
  };

  const onFinish = () => {
    handleSubmitButton();
  };

  const gridFields = fields.filter(
    (field) => field.type !== "richtext" && field.type !== "file"
  );
  const fullWidthFields = fields.filter(
    (field) => field.type === "richtext" || field.type === "file"
  );

  return (
    <>
      {title && (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#06498B",
            }}
          >
            <Title>{title}</Title>
          </div>
          {showDivider && <Divider />}
        </>
      )}

      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onFinish={onFinish}
        onFinishFailed={handleError}
        onValuesChange={handleValuesChange}
        style={{
          maxWidth: "2400px",
          width: "100%",
          margin: "0 auto",
          background: "#fff",
          padding: "24px",
          borderRadius: "6px",
          position: "relative",
          ...formStyle,
        }}
      >
        {gridFields.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: gridColumns,
              gap,
            }}
          >
            {gridFields.map(renderField)}
          </div>
        )}
        {fullWidthFields.map(renderField)}

        <Form.Item
          style={{
            textAlign: "center",
            display: !onCancel && !onSubmit ? "none" : "block",
          }}
        >
          <div
            style={{ display: "flex", gap: "12px", justifyContent: "center" }}
          >
            {onCancel && (
              <Button
                size="large"
                danger
                style={{ minWidth: "100px" }}
                onClick={onCancel}
              >
                <CloseCircleOutlined />
                {cancelText}
              </Button>
            )}
            {onSubmit && (
              <Button
                loading={loading}
                type="primary"
                size="large"
                style={{ minWidth: "100px" }}
                onClick={handleSubmitButton}
              >
                <SaveOutlined />
                {submitText}
              </Button>
            )}
          </div>
        </Form.Item>

        {loading && (
          <div className="loading-overlay" style={{ textAlign: "center" }}>
            <Spin size="large" style={{ display: "block", margin: "0 auto" }} />
          </div>
        )}
      </Form>
    </>
  );
});

export default FormCustom;
