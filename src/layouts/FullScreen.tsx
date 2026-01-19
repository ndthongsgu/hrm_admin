import { FullscreenExitOutlined, FullscreenOutlined } from "@ant-design/icons";
import { message, Tooltip } from "antd";
import { useEffect, useState } from "react";
import screenfull from "screenfull";

const FullScreen = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const change = () => {
    setIsFullscreen(!screenfull.isEnabled);
  };
  const click = () => {
    if (!screenfull.isEnabled) {
      message.warning("you browser can not work");
      return false;
    }
    screenfull.toggle();
    return true;
  };
  useEffect(() => {
    if (screenfull.isEnabled) {
      screenfull.on("change", change);
    }
    return () => {
      if (screenfull.isEnabled) {
        screenfull.off("change", change);
      }
    };
  }, []);
  const title = isFullscreen ? "Cancel full screen" : "Full screen";
  return (
    <Tooltip title={title}>
      {isFullscreen ? (
        <FullscreenExitOutlined onClick={click} />
      ) : (
        <FullscreenOutlined onClick={click} />
      )}
    </Tooltip>
  );
};

export default FullScreen;
