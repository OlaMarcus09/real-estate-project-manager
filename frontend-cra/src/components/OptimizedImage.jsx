import React from 'react';
import { Package, User, Folder, Truck } from 'lucide-react';

// Use Lucide icons instead of images for better performance
export const OptimizedIcon = ({ type, ...props }) => {
  const icons = {
    project: Folder,
    worker: User,
    vendor: Truck,
    inventory: Package
  };
  const IconComponent = icons[type] || Package;
  return <IconComponent {...props} />;
};
