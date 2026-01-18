import React from "react";

const Input = ({
  label,
  error,
  icon: Icon,
  rightIcon,
  onRightIconClick,
  className = "",
  ...props
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
            <Icon size={20} />
          </div>
        )}
        <input
          className={`input-clean ${Icon ? "pl-10" : ""} ${
            rightIcon ? "pr-10" : ""
          } ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-200"
              : ""
          }`}
          {...props}
        />
        {rightIcon && (
          <div
            className={`absolute inset-y-0 right-0 pr-3 flex items-center ${
              onRightIconClick
                ? "cursor-pointer hover:text-gray-700"
                : "pointer-events-none"
            } text-gray-500`}
            onClick={onRightIconClick}
          >
            {/* If it's a valid React element (like <span>...</span>), render it directly. 
                Otherwise assume it's a component (function or forwardRef) and create an element. */}
            {React.isValidElement(rightIcon)
              ? rightIcon
              : React.createElement(rightIcon, { size: 20 })}
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Input;
