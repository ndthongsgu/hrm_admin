import { Typography } from "antd";

function Title({ children }: { children?: React.ReactNode }) {
  return (
    <Typography.Title
      level={2}
      style={{
        margin: 0,
        fontStyle: "italic",
        width: "100%",
        textAlign: "center",
        color: "#06498B",
      }}
    >
      {children}
    </Typography.Title>
  );
}

export default Title;
