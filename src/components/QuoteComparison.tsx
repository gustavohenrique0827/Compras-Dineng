
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

interface QuoteItem {
  id: number;
  itemName: string;
  quantity: number;
  price: number;
  supplierId: number;
}

interface Supplier {
  id: number;
  name: string;
  items: QuoteItem[];
}

interface QuoteComparisonProps {
  suppliers: Supplier[];
  onFinish: (selectedItems: QuoteItem[]) => void;
  onCancel: () => void;
}

const QuoteComparison: React.FC<QuoteComparisonProps> = ({ 
  suppliers, 
  onFinish, 
  onCancel 
}) => {
  const [selectedItems, setSelectedItems] = useState<QuoteItem[]>([]);
  const [totalSelected, setTotalSelected] = useState<number>(0);
  
  // Find all unique items across all suppliers
  const uniqueItems = React.useMemo(() => {
    const allItems = suppliers.flatMap(supplier => supplier.items);
    const uniqueItemNames = [...new Set(allItems.map(item => item.itemName))];
    return uniqueItemNames;
  }, [suppliers]);
  
  // Toggle item selection
  const toggleItem = (item: QuoteItem) => {
    // Remove any existing selection for this item (from any supplier)
    const newSelection = selectedItems.filter(
      selectedItem => selectedItem.itemName !== item.itemName
    );
    
    // Add the new item if it's not being deselected
    if (!selectedItems.some(selected => 
      selected.id === item.id && selected.supplierId === item.supplierId
    )) {
      newSelection.push(item);
    }
    
    setSelectedItems(newSelection);
  };
  
  // Select all items from a specific supplier
  const selectAllFromSupplier = (supplierId: number) => {
    // First, remove any items that are already selected for the unique item names
    const itemsFromSupplier = suppliers
      .find(s => s.id === supplierId)?.items || [];
    
    // Get the item names from this supplier
    const itemNamesFromSupplier = itemsFromSupplier.map(item => item.itemName);
    
    // Remove any existing selections for these items
    const filteredSelection = selectedItems.filter(
      item => !itemNamesFromSupplier.includes(item.itemName)
    );
    
    // Add all items from this supplier
    setSelectedItems([...filteredSelection, ...itemsFromSupplier]);
    
    toast.success(`Todos os itens do fornecedor ${suppliers.find(s => s.id === supplierId)?.name} selecionados`);
  };
  
  // Calculate the total value of selected items
  useEffect(() => {
    const total = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotalSelected(total);
  }, [selectedItems]);
  
  // Handle the quote finalization
  const handleFinishQuote = () => {
    if (selectedItems.length === 0) {
      toast.error("Selecione pelo menos um item para finalizar a cotação");
      return;
    }
    
    onFinish(selectedItems);
  };
  
  return (
    <div className="px-1">
      <h3 className="text-lg font-semibold bg-blue-600 text-white p-2 mb-4">
        Comparativo de fornecedores
      </h3>
      
      <div className="grid grid-cols-3 gap-2 mb-4">
        {suppliers.map(supplier => (
          <div 
            key={supplier.id} 
            className="bg-blue-600 text-white p-2 flex justify-between items-center"
          >
            <span>Fornecedor {supplier.id}</span>
            <Button 
              variant="secondary" 
              size="sm" 
              className="text-xs"
              onClick={() => selectAllFromSupplier(supplier.id)}
            >
              Selecionar Todos
            </Button>
          </div>
        ))}
      </div>
      
      {uniqueItems.map(itemName => (
        <div key={itemName} className="grid grid-cols-3 gap-2 mb-4 border-b pb-2">
          {suppliers.map(supplier => {
            const supplierItem = supplier.items.find(item => item.itemName === itemName);
            
            if (!supplierItem) return (
              <div key={`empty-${supplier.id}-${itemName}`} className="p-2 flex justify-between">
                <span>Não disponível</span>
              </div>
            );
            
            const isSelected = selectedItems.some(
              item => item.id === supplierItem.id && item.supplierId === supplier.id
            );
            
            return (
              <div key={`${supplier.id}-${supplierItem.id}`} className="flex justify-between items-center">
                <div>
                  <div className="bg-blue-600 text-white p-1">{supplierItem.itemName}</div>
                  <div className="bg-blue-600 text-white p-1">R$ {supplierItem.price.toFixed(2)}</div>
                </div>
                <Checkbox 
                  checked={isSelected}
                  onCheckedChange={() => toggleItem(supplierItem)}
                />
              </div>
            );
          })}
        </div>
      ))}
      
      <div className="grid grid-cols-3 gap-2 mb-6">
        {suppliers.map(supplier => {
          const supplierTotal = supplier.items.reduce(
            (sum, item) => sum + (item.price * item.quantity), 0
          );
          
          return (
            <div key={`total-${supplier.id}`} className="bg-blue-600 text-white p-2">
              Valor total: R$ {supplierTotal.toFixed(2)}
            </div>
          );
        })}
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <div className="bg-blue-600 text-white p-2">
          Valor total selecionado: R$ {totalSelected.toFixed(2)}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handleFinishQuote}
          >
            Finalizar Cotação
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuoteComparison;
