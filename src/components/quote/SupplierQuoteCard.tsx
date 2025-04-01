
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash } from 'lucide-react';
import { toast } from 'sonner';

export interface QuoteItem {
  id: number;
  name: string;
  quantity: number;
  unitValue: number;
  totalValue: number;
}

export interface SupplierQuote {
  supplierId: number;
  supplierName: string;
  items: QuoteItem[];
}

interface SupplierQuoteCardProps {
  supplierQuote: SupplierQuote;
  newItemName: string;
  newItemQuantity: number;
  setNewItemName: (name: string) => void;
  setNewItemQuantity: (quantity: number) => void;
  addItemToSupplier: (supplierId: number) => void;
  removeItemFromSupplier: (supplierId: number, itemId: number) => void;
  updateItemUnitValue: (supplierId: number, itemId: number, value: number) => void;
  updateItemQuantity: (supplierId: number, itemId: number, quantity: number) => void;
  removeSupplier: (supplierId: number) => void;
}

const SupplierQuoteCard: React.FC<SupplierQuoteCardProps> = ({
  supplierQuote,
  newItemName,
  newItemQuantity,
  setNewItemName,
  setNewItemQuantity,
  addItemToSupplier,
  removeItemFromSupplier,
  updateItemUnitValue,
  updateItemQuantity,
  removeSupplier
}) => {
  return (
    <Card className="glass-card animate-fadeIn mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Fornecedor: {supplierQuote.supplierName}</CardTitle>
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={() => removeSupplier(supplierQuote.supplierId)}
          className="h-8"
        >
          <Trash className="h-4 w-4 mr-1" /> Remover
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-4 space-y-4">
          <div className="flex gap-2">
            <Input 
              placeholder="Nome do item" 
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
            />
            <Input 
              type="number" 
              placeholder="Quantidade" 
              value={newItemQuantity}
              onChange={(e) => setNewItemQuantity(parseInt(e.target.value) || 1)}
              className="w-24"
              min="1"
            />
            <Button onClick={() => addItemToSupplier(supplierQuote.supplierId)}>
              <Plus className="h-4 w-4 mr-1" /> Item
            </Button>
          </div>
        </div>

        <ItemTable 
          items={supplierQuote.items}
          supplierId={supplierQuote.supplierId}
          updateItemQuantity={updateItemQuantity}
          updateItemUnitValue={updateItemUnitValue}
          removeItemFromSupplier={removeItemFromSupplier}
        />
      </CardContent>
    </Card>
  );
};

interface ItemTableProps {
  items: QuoteItem[];
  supplierId: number;
  updateItemQuantity: (supplierId: number, itemId: number, quantity: number) => void;
  updateItemUnitValue: (supplierId: number, itemId: number, value: number) => void;
  removeItemFromSupplier: (supplierId: number, itemId: number) => void;
}

const ItemTable: React.FC<ItemTableProps> = ({ 
  items, 
  supplierId, 
  updateItemQuantity, 
  updateItemUnitValue, 
  removeItemFromSupplier 
}) => {
  return (
    <Table className="border">
      <TableHeader className="bg-blue-800 text-white">
        <TableRow>
          <TableHead className="text-white">Item</TableHead>
          <TableHead className="text-center text-white">Quant</TableHead>
          <TableHead className="text-center text-white">Valor unitário</TableHead>
          <TableHead className="text-center text-white">Valor total</TableHead>
          <TableHead className="text-center text-white w-20">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-4">
              Nenhum item adicionado para este fornecedor.
            </TableCell>
          </TableRow>
        ) : (
          items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell className="text-center">
                <Input 
                  type="number" 
                  value={item.quantity} 
                  onChange={(e) => updateItemQuantity(
                    supplierId,
                    item.id,
                    parseInt(e.target.value) || 1
                  )}
                  className="max-w-[80px] mx-auto text-center"
                  min="1"
                />
              </TableCell>
              <TableCell>
                <Input 
                  type="number" 
                  value={item.unitValue === 0 ? '' : item.unitValue}
                  onChange={(e) => updateItemUnitValue(
                    supplierId, 
                    item.id, 
                    parseFloat(e.target.value) || 0
                  )}
                  className="max-w-[150px] mx-auto text-right"
                  placeholder="0,00"
                  step="0.01"
                  min="0"
                />
              </TableCell>
              <TableCell className="text-center">
                {item.totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </TableCell>
              <TableCell className="text-center">
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => removeItemFromSupplier(supplierId, item.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
        {items.length > 0 && (
          <TableRow>
            <TableCell colSpan={3} className="text-right font-medium">
              Subtotal:
            </TableCell>
            <TableCell className="text-center font-medium">
              {items
                .reduce((sum, item) => sum + item.totalValue, 0)
                .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
              }
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default SupplierQuoteCard;
