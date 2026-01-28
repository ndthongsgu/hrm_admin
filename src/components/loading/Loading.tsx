import "./index.less";
import { Typography } from "antd";

export default function GlobalLoading() {
  return (
    <div className="hrm-loading-overlay">
      <div className="hrm-loader-card">
        <div className="hrm-logo">HRM</div>

        <div className="hrm-dots" aria-hidden>
          <span />
          <span />
          <span />
        </div>

        <Typography.Text className="hrm-loading-text">
          Đang tải hệ thống HRM... Vui lòng chờ.
        </Typography.Text>
      </div>
    </div>
  );
}
