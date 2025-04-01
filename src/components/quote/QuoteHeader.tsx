
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';

interface Supplier {
  id: number;
  nome: string;
  cnpj: string;
}

interface QuoteHeaderProps {
  quoteCode: string;
  quoteTitle: string;
  suppliers: Supplier[];
  supplierQuoteIds: number[];
  addSupplier: (supplierId: number) => void;
}

const QuoteHeader: React.FC<QuoteHeaderProps> = ({ 
  quoteCode, 
  quoteTitle, 
  suppliers, 
  supplierQuoteIds,
  addSupplier
}) => {
  return (
    <Card className="glass-card animate-fadeIn mb-6">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Cotação</h3>
            <div className="flex items-center gap-2">
              <div className="text-base">{quoteCode}</div>
              <div className="text-base">{quoteTitle}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex-grow">
              <Select onValueChange={(value) => addSupplier(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um fornecedor" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers
                    .filter(supplier => !supplierQuoteIds.includes(supplier.id))
                    .map(supplier => (
                      <SelectItem key={supplier.id} value={supplier.id.toString()}>
                        {supplier.nome}
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={() => {
                const selectTrigger = document.querySelector('[id^="radix-:"]');
                if (selectTrigger) {
                  (selectTrigger as HTMLElement).click();
                }
              }}
              className="bg-green-500 hover:bg-green-600"
            >
              <Plus className="h-4 w-4 mr-1" /> Adicionar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuoteHeader;
