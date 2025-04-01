
import React from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Save } from 'lucide-react';
import QuoteHeader from '@/components/quote/QuoteHeader';
import SupplierQuoteCard from '@/components/quote/SupplierQuoteCard';
import { useQuoteForm } from '@/hooks/useQuoteForm';

const QuoteForm = () => {
  const isMobile = useIsMobile();
  const {
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
    handleSaveQuote
  } = useQuoteForm();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className={`pb-20 ${isMobile ? 'pt-20' : 'ml-64'}`}>
        <div className="section-padding">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-center">Nova Cotação</h2>
            </div>
            
            <QuoteHeader 
              quoteCode={quoteCode}
              quoteTitle={quoteTitle}
              suppliers={suppliers}
              supplierQuoteIds={supplierQuotes.map(sq => sq.supplierId)}
              addSupplier={addSupplier}
            />
            
            {supplierQuotes.map((supplierQuote) => (
              <SupplierQuoteCard
                key={supplierQuote.supplierId}
                supplierQuote={supplierQuote}
                newItemName={newItemName}
                newItemQuantity={newItemQuantity}
                setNewItemName={setNewItemName}
                setNewItemQuantity={setNewItemQuantity}
                addItemToSupplier={addItemToSupplier}
                removeItemFromSupplier={removeItemFromSupplier}
                updateItemUnitValue={updateItemUnitValue}
                updateItemQuantity={updateItemQuantity}
                removeSupplier={removeSupplier}
              />
            ))}
            
            <div className="flex justify-end mb-6">
              <Button onClick={handleSaveQuote} size="lg" className="min-w-[180px] bg-green-500 hover:bg-green-600">
                <Save className="h-4 w-4 mr-2" /> 
                Salvar Cotação
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default QuoteForm;
