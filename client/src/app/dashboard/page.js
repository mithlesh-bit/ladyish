import Dashboard from "@/components/shared/layouts/Dashboard";
import React from "react";

const ControlPanel = () => {
  return (
    <Dashboard>
      <div className="w-full h-full flex justify-center items-center !rounded" style={{ padding: 0, margin: 0 }}>
        <iframe
          title="Portfolio"
          src="https://bento.me/nikhil2002"
          style={{ width: "100%", height: "100%", borderRadius: "10px", border: "none" }}
          frameBorder="0"
          scrolling="auto"
        ></iframe>
      </div>
    </Dashboard>
  );
};

export default ControlPanel;
