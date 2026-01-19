import { useUserInfo, useIsAdmin } from "@/hooks/auth/useUserInfo";
import { Alert, Descriptions, Tag } from "antd";
import { isAdmin } from "@/common/helpers/permissions";

/**
 * Component debug để kiểm tra permission state
 * Chỉ dùng trong development
 */
export default function PermissionDebug() {
  const userInfo = useUserInfo();
  const isAdminHook = useIsAdmin();

  if (!userInfo) {
    return (
      <Alert
        type="warning"
        message="User Info Not Loaded"
        description="UserInfo is null. User may not be logged in."
        showIcon
      />
    );
  }

  return (
    <div style={{ padding: 16, background: "#f5f5f5", marginBottom: 16 }}>
      <h3>🔍 Permission Debug Info</h3>
      
      <Descriptions bordered size="small" column={2}>
        <Descriptions.Item label="User ID">{userInfo.userId}</Descriptions.Item>
        <Descriptions.Item label="Username">{userInfo.username}</Descriptions.Item>
        <Descriptions.Item label="Email">{userInfo.email}</Descriptions.Item>
        <Descriptions.Item label="Name">{userInfo.name}</Descriptions.Item>
        
        <Descriptions.Item label="Is Admin (from userInfo)">
          {userInfo.isAdmin ? (
            <Tag color="green">TRUE ✓</Tag>
          ) : (
            <Tag color="red">FALSE ✗</Tag>
          )}
        </Descriptions.Item>
        
        <Descriptions.Item label="Is Admin (from hook)">
          {isAdminHook ? (
            <Tag color="green">TRUE ✓</Tag>
          ) : (
            <Tag color="red">FALSE ✗</Tag>
          )}
        </Descriptions.Item>
        
        <Descriptions.Item label="Is Admin (from helper)">
          {isAdmin(userInfo) ? (
            <Tag color="green">TRUE ✓</Tag>
          ) : (
            <Tag color="red">FALSE ✗</Tag>
          )}
        </Descriptions.Item>

        <Descriptions.Item label="Is Google">
          {userInfo.isGoogle ? "Yes" : "No"}
        </Descriptions.Item>

        <Descriptions.Item label="Permissions Count" span={2}>
          {Object.keys(userInfo.permissions || {}).length} modules
        </Descriptions.Item>
      </Descriptions>

      <div style={{ marginTop: 16 }}>
        <h4>Permissions:</h4>
        <pre style={{ 
          background: "#fff", 
          padding: 12, 
          borderRadius: 4,
          maxHeight: 300,
          overflow: "auto"
        }}>
          {JSON.stringify(userInfo.permissions, null, 2)}
        </pre>
      </div>

      <div style={{ marginTop: 16 }}>
        <h4>Full UserInfo:</h4>
        <pre style={{ 
          background: "#fff", 
          padding: 12, 
          borderRadius: 4,
          maxHeight: 300,
          overflow: "auto"
        }}>
          {JSON.stringify(userInfo, null, 2)}
        </pre>
      </div>
    </div>
  );
}
