import { Spin } from "antd";
import React, { useState } from "react";
import "./index.less";

type Tab = {
  key: string;
  title: string;
  content: React.ReactNode;
};

interface BaseViewProps {
  children?: React.ReactNode;
  isLoading?: boolean;
  tabs?: Tab[];
}

const BaseView: React.FC<BaseViewProps> = ({ children, isLoading, tabs }) => {
  const [activeTabKey, setActiveTabKey] = useState(
    tabs && tabs.length > 0 ? tabs[0].key : ""
  );

  if (isLoading) {
    return (
      <div className="base-view" style={{ padding: 12 }}>
        <Spin />
      </div>
    );
  }

  if (tabs && tabs.length > 0) {
    const activeTab = tabs.find((tab) => tab.key === activeTabKey);

    return (
      <div className="base-view" style={{ padding: 10 }}>
        <div className="tabs-child">
          {tabs.map((tab) => (
            <div
              key={tab.key}
              className={`tab-item ${tab.key === activeTabKey ? "active" : ""}`}
              onClick={() => setActiveTabKey(tab.key)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === "Enter" || e.key === " ")
                  setActiveTabKey(tab.key);
              }}
            >
              {tab.title}
            </div>
          ))}
        </div>
        <div className="tab-content">{activeTab?.content}</div>
      </div>
    );
  }

  return (
    <div className="base-view" style={{ padding: 12 }}>
      {children}
    </div>
  );
};

export default BaseView;
