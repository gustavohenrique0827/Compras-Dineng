
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';

interface SupplierQuickAddButtonProps {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost';
  onSupplierAdded?: () => void;
}

// Este componente oferece duas formas de cadastrar fornecedor:
// 1. Via navegação para a página de fornecedores
// 2. Via Sheet lateral (futura implementação)
const SupplierQuickAddButton: React.FC<SupplierQuickAddButtonProps> = ({ 
  variant = 'outline',
  onSupplierAdded
}) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  
  const handleNavigateToSuppliers = () => {
    // Salvar estado atual da cotação antes de navegar, se necessário
    // ...
    
    // Navegar para a página de fornecedores com parâmetro para indicar retorno
    navigate('/suppliers?fromQuote=true');
  };
  
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button 
          variant={variant} 
          size="sm"
          className="gap-1"
        >
          <UserPlus className="h-4 w-4 mr-1" />
          Novo Fornecedor
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Adicionar Fornecedor</SheetTitle>
          <SheetDescription>
            Você pode adicionar um novo fornecedor de duas maneiras:
          </SheetDescription>
        </SheetHeader>
        
        <div className="grid gap-4 py-6">
          <div className="space-y-2">
            <h3 className="font-medium">Acesso Rápido</h3>
            <p className="text-sm text-muted-foreground">
              Cadastre um novo fornecedor sem perder seu progresso.
            </p>
            <p className="text-xs text-muted-foreground">
              (Funcionalidade em desenvolvimento)
            </p>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium">Cadastro Completo</h3>
            <p className="text-sm text-muted-foreground">
              Acesse a página de fornecedores para um cadastro detalhado.
            </p>
            <Button 
              onClick={() => {
                setOpen(false);
                handleNavigateToSuppliers();
              }}
              className="mt-2 w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ir para Cadastro de Fornecedores
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SupplierQuickAddButton;
