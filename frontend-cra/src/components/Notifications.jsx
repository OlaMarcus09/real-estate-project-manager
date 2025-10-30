import React from 'react';
import { Bell, AlertTriangle, CheckCircle, Info } from 'lucide-react';

export const Notification = ({ type, message }) => {
  const icons = {
    success: CheckCircle,
    warning: AlertTriangle,
    info: Info,
    error: AlertTriangle
  };
  
  const colors = {
    success: 'text-green-500 bg-green-50 border-green-200',
    warning: 'text-yellow-500 bg-yellow-50 border-yellow-200',
    info: 'text-blue-500 bg-blue-50 border-blue-200',
    error: 'text-red-500 bg-red-50 border-red-200'
  };
  
  const IconComponent = icons[type] || Info;
  
  return (
    <div className={`flex items-center p-4 border rounded-lg ${colors[type]}`}>
      <IconComponent size={20} className="mr-3" />
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
};
