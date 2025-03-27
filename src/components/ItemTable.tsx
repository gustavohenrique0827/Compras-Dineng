
import React from 'react';
import { RequestItem } from '@/utils/mockData';
import { cn } from '@/lib/utils';

interface ItemTableProps {
  items: RequestItem[];
  className?: string;
}

const ItemTable: React.FC<ItemTableProps> = ({ items, className }) => {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-muted/50">
            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">ID</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Descrição</th>
            <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Quantidade</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr 
              key={item.id} 
              className={cn(
                "border-b border-border transition-colors",
                index % 2 === 0 ? 'bg-background' : 'bg-muted/20',
                "hover:bg-muted/30"
              )}
            >
              <td className="px-4 py-3 text-sm">{item.id}</td>
              <td className="px-4 py-3 text-sm font-medium">{item.description}</td>
              <td className="px-4 py-3 text-sm text-right">{item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ItemTable;
