import { Form } from "antd";
import JoditEditor from "jodit-react";
import { useRef, useState } from "react";
import type { FormField } from "../form-custom";

function RichText({
  field,
  initialValue,
  form,
}: {
  field: FormField;
  initialValue: string;
  form: any;
}) {
  const editor = useRef<any>(null);
  const [content, setContent] = useState(initialValue);

  return (
    <Form.Item
      key={field.name}
      label={field.label}
      name={field.name}
      initialValue={initialValue}
    >
      <div
        style={{
          borderRadius: "10px",
          overflow: "hidden",
          backgroundColor: "#ffffff",
          padding: "2px",
        }}
      >
        <JoditEditor
          ref={editor}
          value={content}
          config={{
            readonly: false,
            placeholder: field.placeholder,
            height: 350,
            toolbarSticky: true,
            toolbarStickyOffset: 0,
            toolbarAdaptive: false,
            toolbarButtonSize: "middle",
            uploader: {
              insertImageAsBase64URI: true,
            },
            buttons: [
              "source",
              "fullsize",
              "preview",
              "print",
              "undo",
              "redo",
              "cut",
              "copy",
              "paste",
              "selectall",
              "hr",
              "superscript",
              "subscript",
              "bold",
              "underline",
              "italic",
              "strikethrough",
              "eraser",
              "ul",
              "ol",
              "outdent",
              "indent",
              "align",
              "font",
              "fontsize",
              "paragraph",
              "image",
              "video",
              "table",
              "link",
              "unlink",
              "symbol",
              "spellcheck",
              "copyformat",
              "removeformat",
              "about",
            ],
          }}
          onBlur={(newContent) => {
            setContent(newContent);
            form.setFieldsValue({ [field.name]: newContent });
          }}
        />
      </div>
    </Form.Item>
  );
}

export default RichText;
