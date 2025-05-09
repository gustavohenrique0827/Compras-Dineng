
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { finalizeQuote, QuoteItem, Supplier } from '@/api/quotes';
import { useNavigate } from 'react-router-dom';

interface QuoteComparisonProps {
  suppliers: Supplier[];
  onFinish: (selectedItems: QuoteItem[]) => void;
  onCancel: () => void;
  viewOnly?: boolean;
  requestId?: number;
}

const QuoteComparison: React.FC<QuoteComparisonProps> = ({ 
  suppliers, 
  onFinish, 
  onCancel,
  viewOnly = false,
  requestId
}) => {
  const [selectedItems, setSelectedItems] = useState<QuoteItem[]>([]);
  const [totalSelected, setTotalSelected] = useState<number>(0);
  const navigate = useNavigate();
  
  // Find all unique items across all suppliers
  const uniqueItems = React.useMemo(() => {
    const allItems = suppliers.flatMap(supplier => supplier.items);
    const uniqueItemNames = [...new Set(allItems.map(item => item.itemName))];
    return uniqueItemNames;
  }, [suppliers]);
  
  // Toggle item selection
  const toggleItem = (item: QuoteItem) => {
    if (viewOnly) return;
    
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
    if (viewOnly) return;
    
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
    
    const supplierName = suppliers.find(s => s.id === supplierId)?.name || supplierId.toString();
    toast.success(`Todos os itens do fornecedor ${supplierName} selecionados`);
  };
  
  // Calculate the total value of selected items
  useEffect(() => {
    const total = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotalSelected(total);
  }, [selectedItems]);
  
  // Handle the quote finalization
  const handleFinishQuote = async () => {
    if (selectedItems.length === 0) {
      toast.error("Selecione pelo menos um item para finalizar a cotação");
      return;
    }
    
    if (requestId) {
      try {
        // Enviar para API com finalizeQuote
        const result = await finalizeQuote(requestId, selectedItems);
        toast.success("Cotação finalizada com sucesso!");
        
        // Redirecionar para a página de cotações
        setTimeout(() => {
          navigate('/purchases');
        }, 1500);
      } catch (error) {
        console.error("Erro ao finalizar cotação:", error);
        toast.error("Erro ao finalizar cotação");
      }
    } else {
      // Método antigo (callback)
      onFinish(selectedItems);
    }
  };

  const handleRejectQuote = () => {
    toast.error("Cotação rejeitada");
    onCancel();
  };
  
  return (
    <div className="px-1">
      <h3 className="text-lg font-semibold p-2 mb-4 rounded-md border-b">
        {viewOnly ? "Detalhes da Cotação" : "Comparativo de fornecedores"}
      </h3>
      
      <div className="grid grid-cols-3 gap-2 mb-4">
        {suppliers.map(supplier => (
          <Card key={supplier.id} className="p-0">
            <CardHeader className="pb-2 pt-3">
              <CardTitle className="text-sm flex justify-between items-center">
                <span>Fornecedor: {supplier.name}</span>
                {!viewOnly && (
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="text-xs"
                    onClick={() => selectAllFromSupplier(supplier.id)}
                  >
                    Selecionar Todos
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
          </Card>
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
              <div 
                key={`${supplier.id}-${supplierItem.id}`} 
                className={`flex justify-between items-center p-2 rounded-md border ${
                  isSelected ? 'border-green-500 bg-green-50' : ''
                }`}
              >
                <div>
                  <div className="font-medium">{supplierItem.itemName}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">R$ {supplierItem.price.toFixed(2)}</div>
                  <div className="text-xs text-slate-500">Quantidade: {supplierItem.quantity}</div>
                </div>
                {!viewOnly ? (
                  <Checkbox 
                    checked={isSelected}
                    onCheckedChange={() => toggleItem(supplierItem)}
                  />
                ) : null}
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
            <div key={`total-${supplier.id}`} className="p-2 rounded-md border">
              Valor total: R$ {supplierTotal.toFixed(2)}
            </div>
          );
        })}
      </div>
      
      {!viewOnly && (
        <div className="flex justify-between items-center mb-4">
          <div className="p-2 rounded-md border">
            Valor total selecionado: R$ {totalSelected.toFixed(2)}
          </div>
          <div className="flex gap-2">
            <Button variant="destructive" onClick={handleRejectQuote}>
              Negar Cotação
            </Button>
            <Button variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button 
              onClick={handleFinishQuote}
              className="bg-green-500 hover:bg-green-600"
            >
              Aprovar Cotação
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuoteComparison;
