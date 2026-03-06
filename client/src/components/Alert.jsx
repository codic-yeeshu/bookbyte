import React from 'react';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';
import { clsx } from 'clsx';

const Alert = ({ type = 'info', message, className }) => {
  const styles = {
    info: 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-200 dark:border-blue-800',
    success: 'bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-200 dark:border-green-800',
    warning: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-200 dark:border-amber-800',
    error: 'bg-red-50 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-200 dark:border-red-800',
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
      "flex items-center p-4 mb-4 text-sm border rounded-lg animate-in fade-in slide-in-from-top-1",
      styles[type],
      className
    )}>
      {icons[type]}
      <span className="font-medium">{message}</span>
    </div>
  );
};

export default Alert;
