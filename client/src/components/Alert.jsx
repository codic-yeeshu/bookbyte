import React from 'react';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';
import { clsx } from 'clsx';

const Alert = ({ type = 'info', message, className }) => {
  const styles = {
    info: 'bg-accent-100 text-accent-800 border-accent/40',
    success: 'bg-success/10 text-success border-success/40',
    warning: 'bg-accent-100 text-accent-800 border-accent',
    error: 'bg-danger/10 text-danger border-danger/40',
  };

  const icons = {
    info: <Info className="w-5 h-5 mr-3" />,
    success: <CheckCircle className="w-5 h-5 mr-3" />,
    warning: <AlertCircle className="w-5 h-5 mr-3" />,
    error: <XCircle className="w-5 h-5 mr-3" />,
  };

  if (!message) return null;

  return (
    <div className={clsx(
      "flex items-center p-4 mb-4 text-sm border rounded-md",
      styles[type],
      className
    )}>
      {icons[type]}
      <span className="font-medium">{message}</span>
    </div>
  );
};

export default Alert;
