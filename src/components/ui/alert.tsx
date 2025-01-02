import React from "react";

interface AlertProps {
  variant?: "default" | "destructive";
  className?: string;
  children: React.ReactNode;
}

export const Alert: React.FC<AlertProps> = ({ 
  variant = "default", 
  className = "", 
  children 
}) => {
  return (
    <div className={`rounded-lg border p-4 ${
      variant === "destructive" ? "border-red-500 text-red-500" : "border-gray-200"
    } ${className}`}>
      {children}
    </div>
  );
};

export const AlertDescription: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  return <div className="text-sm">{children}</div>;
}; 