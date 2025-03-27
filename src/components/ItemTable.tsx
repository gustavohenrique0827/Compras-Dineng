
import React from 'react';
import { cn } from '@/lib/utils';

interface Item {
  id: number;
  descricao: string;
  quantidade: number;
  solicitacao_id?: number;
  id_solicitante?: number;
}

interface ItemTableProps {
  items: Item[];
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
          {items.length > 0 ? (
            items.map((item, index) => (
              <tr 
                key={item.id} 
                className={cn(
                  "border-b border-border transition-colors",
                  index % 2 === 0 ? 'bg-background' : 'bg-muted/20',
                  "hover:bg-muted/30"
                )}
              >
                <td className="px-4 py-3 text-sm">{item.id}</td>
                <td className="px-4 py-3 text-sm font-medium">{item.descricao}</td>
                <td className="px-4 py-3 text-sm text-right">{item.quantidade}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">
                Nenhum item encontrado
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ItemTable;
