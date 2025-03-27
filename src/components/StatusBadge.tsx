
import React from 'react';
import { getStatusColor, getPriorityColor, getCategoryColor, Status, Priority, Category } from '@/utils/mockData';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  type: 'status' | 'priority' | 'category';
  value: Status | Priority | Category;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ type, value, className }) => {
  const getColorClass = () => {
    switch (type) {
      case 'status':
        return getStatusColor(value as Status);
      case 'priority':
        return getPriorityColor(value as Priority);
      case 'category':
        return getCategoryColor(value as Category);
      default:
        return '';
    }
  };

  return (
    <span 
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        getColorClass(),
        className
      )}
    >
      {value}
    </span>
  );
};

export default StatusBadge;
