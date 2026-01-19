import { useLoading } from "@/context/LoadingContext";
import { Button, Checkbox, Form, Input, Divider, Alert } from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLogin } from "@/hooks/auth/auth";

// Field type for the form values
type FieldType = {
  username: string;
  password: string;
  remember?: boolean;
  // loginAsAdmin?: boolean;
};

// Props for the LoginForm component
interface LoginFormProps {
  // When true, the form renders in "admin mode"
  // Customer login form is used when false
  adminMode?: boolean;
}

export default function LoginForm({ adminMode = false }: LoginFormProps) {
  const { showLoading, hideLoading } = useLoading();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const message = searchParams.get("message");

  const loginMutation = useLogin();

  // If adminMode is true, show a UI cue (title/subtitle) indicating admin login
  // The actual admin-only behavior is controlled by the backend/auth hook; we simply reflect the mode in UI
  const onFinish = async (values: FieldType) => {
    showLoading();
    try {
      await loginMutation.mutateAsync({
        username: values.username,
        password: values.password,
        // retain existing shape; admin mode is conveyed via loginAsAdmin if needed
        // loginAsAdmin: values.loginAsAdmin,
        loginAsAdmin: adminMode,
      });
    } finally {
      hideLoading();
    }
  };

  // Google login remains the same
  const handleGoogleLogin = () => {
    // Redirect to Google OAuth
    window.location.href = `${
      import.meta.env.VITE_API_BASE_URL || "hhttp://localhost:8080/bookvexe-be-j2e"
    }/oauth2/authorization/google`;
  };

  return (
    <div
      style={{
        padding: "2rem",
        borderRadius: "16px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
        background: "white",
        minWidth: 400,
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "1.5rem",
          color: adminMode ? "#06498B" : "#06498B",
        }}
      >
        {adminMode ? "Đăng nhập quản trị" : "Đăng nhập khách hàng"}
      </h2>

      {/* Optional message banner from query params */}
      {message && (
        <Alert
          message={message}
          type="warning"
          showIcon
          style={{ marginBottom: "1rem" }}
        />
      )}

      {loginMutation.isError && (
        <Alert
          message={loginMutation.error.message}
          type="error"
          showIcon
          style={{ marginBottom: "1rem" }}
        />
      )}

      <Form
        name="login"
        layout="vertical"
        initialValues={{
          remember: true,
          // Do not render a customer/admin toggle; adminMode controls the mode
          loginAsAdmin: adminMode,
        }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label={adminMode ? "Tên đăng nhập (Admin)" : "Tên đăng nhập"}
          name="username"
          rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập!" }]}
        >
          <Input size="large" />
        </Form.Item>

        <Form.Item<FieldType>
          label="Mật khẩu"
          name="password"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
        >
          <Input.Password size="large" />
        </Form.Item>

        {/* Do not render admin/customer toggle for admin mode */}
        {/* {!adminMode && (
          <Form.Item<FieldType> name="loginAsAdmin" valuePropName="checked">
            <Checkbox>Đăng nhập với tư cách quản trị viên</Checkbox>
          </Form.Item>
        )} */}

        {/* Remember me checkbox is kept for customer mode; omit if not desired in admin mode */}
        {!adminMode && (
          <Form.Item<FieldType> name="remember" valuePropName="checked">
            <Checkbox>Nhớ mật khẩu</Checkbox>
          </Form.Item>
        )}

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            style={{ width: "100%" }}
            loading={loginMutation.isPending}
          >
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>
      {!adminMode && (
        <>
          <Divider>Hoặc</Divider>
          <Button
            icon={<GoogleOutlined />}
            size="large"
            style={{ width: "100%" }}
            onClick={handleGoogleLogin}
          >
            Đăng nhập với Google
          </Button>
          <div style={{ textAlign: "center", marginTop: "1rem" }}>
            {/* FIX: Use onClick and navigate instead of href for internal link */}
            <Button
              type="link"
              onClick={() => navigate("/forgot-password")}
              style={{ padding: 0 }}
            >
              Quên mật khẩu?
            </Button>
            {/* NEW: Conditionally show a separator and Register link */}
            <Divider type="vertical" />
            <Button
              type="link"
              onClick={() => navigate("/register")}
              style={{ padding: 0 }}
            >
              Đăng ký
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
