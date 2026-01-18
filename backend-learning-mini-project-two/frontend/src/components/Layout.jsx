import React from "react";

const Layout = ({ children, centered = false }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div
        className={`container mx-auto px-4 ${
          centered ? "flex-1 flex items-center justify-center py-12" : "py-8"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default Layout;
