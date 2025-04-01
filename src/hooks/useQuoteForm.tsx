
import { useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { QuoteItem, SupplierQuote } from '@/components/quote/SupplierQuoteCard';

interface UseQuoteFormResult {
  quoteTitle: string;
  quoteCode: string;
  newItemName: string;
  newItemQuantity: number;
  supplierQuotes: SupplierQuote[];
  suppliers: any[];
  setNewItemName: (name: string) => void;
  setNewItemQuantity: (quantity: number) => void;
  addSupplier: (supplierId: number) => void;
  removeSupplier: (supplierId: number) => void;
  addItemToSupplier: (supplierId: number) => void;
  removeItemFromSupplier: (supplierId: number, itemId: number) => void;
  updateItemUnitValue: (supplierId: number, itemId: number, value: number) => void;
  updateItemQuantity: (supplierId: number, itemId: number, quantity: number) => void;
  getTotalValue: () => number;
  handleSaveQuote: () => void;
}

export const useQuoteForm = (): UseQuoteFormResult => {
  const navigate = useNavigate();
  const [quoteTitle, setQuoteTitle] = useState('Reparo de moto');
  const [quoteCode, setQuoteCode] = useState('CC-3308');
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState(1);
  
  const [supplierQuotes, setSupplierQuotes] = useState<SupplierQuote[]>([]);

  const [suppliers] = useState([
    { id: 1, nome: 'Fornecedor A Ltda', cnpj: '12.345.678/0001-90' },
    { id: 2, nome: 'Fornecedor B S.A.', cnpj: '23.456.789/0001-01' },
    { id: 3, nome: 'Fornecedor C ME', cnpj: '34.567.890/0001-12' },
    { id: 4, nome: 'Fornecedor D EPP', cnpj: '45.678.901/0001-23' },
  ]);

  const addSupplier = (supplierId: number) => {
    const selectedSupplier = suppliers.find(s => s.id === supplierId);
    if (!selectedSupplier) return;

    if (supplierQuotes.some(sq => sq.supplierId === supplierId)) {
      toast.error('Este fornecedor já foi adicionado à cotação.');
      return;
    }

    const newSupplierQuote: SupplierQuote = {
      supplierId: selectedSupplier.id,
      supplierName: selectedSupplier.nome,
      items: []
    };

    setSupplierQuotes([...supplierQuotes, newSupplierQuote]);
    toast.success(`Fornecedor ${selectedSupplier.nome} adicionado à cotação.`);
  };

  const removeSupplier = (supplierId: number) => {
    setSupplierQuotes(supplierQuotes.filter(sq => sq.supplierId !== supplierId));
    toast.info('Fornecedor removido da cotação.');
  };

  const addItemToSupplier = (supplierId: number) => {
    if (!newItemName.trim()) {
      toast.error('Por favor, informe o nome do item.');
      return;
    }

    setSupplierQuotes(supplierQuotes.map(sq => {
      if (sq.supplierId === supplierId) {
        const newItem: QuoteItem = {
          id: sq.items.length > 0 ? Math.max(...sq.items.map(item => item.id)) + 1 : 1,
          name: newItemName,
          quantity: newItemQuantity,
          unitValue: 0,
          totalValue: 0
        };
        return {
          ...sq,
          items: [...sq.items, newItem]
        };
      }
      return sq;
    }));

    setNewItemName('');
    setNewItemQuantity(1);
  };

  const removeItemFromSupplier = (supplierId: number, itemId: number) => {
    setSupplierQuotes(supplierQuotes.map(sq => {
      if (sq.supplierId === supplierId) {
        return {
          ...sq,
          items: sq.items.filter(item => item.id !== itemId)
        };
      }
      return sq;
    }));
  };

  const updateItemUnitValue = (supplierId: number, itemId: number, value: number) => {
    setSupplierQuotes(supplierQuotes.map(sq => {
      if (sq.supplierId === supplierId) {
        return {
          ...sq,
          items: sq.items.map(item => {
            if (item.id === itemId) {
              return {
                ...item,
                unitValue: value,
                totalValue: value * item.quantity
              };
            }
            return item;
          })
        };
      }
      return sq;
    }));
  };

  const updateItemQuantity = (supplierId: number, itemId: number, quantity: number) => {
    setSupplierQuotes(supplierQuotes.map(sq => {
      if (sq.supplierId === supplierId) {
        return {
          ...sq,
          items: sq.items.map(item => {
            if (item.id === itemId) {
              return {
                ...item,
                quantity,
                totalValue: item.unitValue * quantity
              };
            }
            return item;
          })
        };
      }
      return sq;
    }));
  };

  const getTotalValue = () => {
    let total = 0;
    supplierQuotes.forEach(sq => {
      sq.items.forEach(item => {
        total += item.totalValue;
      });
    });
    return total;
  };

  const handleSaveQuote = () => {
    if (supplierQuotes.length === 0) {
      toast.error('Adicione pelo menos um fornecedor para salvar a cotação.');
      return;
    }

    const anyItems = supplierQuotes.some(sq => sq.items.length > 0);
    if (!anyItems) {
      toast.error('Adicione pelo menos um item para algum fornecedor.');
      return;
    }

    const quote = {
      code: quoteCode,
      title: quoteTitle,
      date: new Date().toISOString(),
      suppliers: supplierQuotes,
      totalValue: getTotalValue()
    };

    console.log('Cotação salva:', quote);
    toast.success('Cotação salva com sucesso!');
    
    // Navegar de volta para a página de cotações
    setTimeout(() => {
      navigate('/purchases');
    }, 1500);
  };

  return {
    quoteTitle,
    quoteCode,
    newItemName,
    newItemQuantity,
    supplierQuotes,
    suppliers,
    setNewItemName,
    setNewItemQuantity,
    addSupplier,
    removeSupplier,
    addItemToSupplier,
    removeItemFromSupplier,
    updateItemUnitValue,
    updateItemQuantity,
    getTotalValue,
    handleSaveQuote
  };
};
