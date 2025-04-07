
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Check, ChevronsUpDown, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CentroCusto } from '@/utils/auth';
import CostCenterDialog from './CostCenterDialog';
import { toast } from 'sonner';

interface CostCenterComboboxProps {
  value: string;
  onChange: (value: string) => void;
}

// Função para buscar centros de custo da API
const fetchCostCenters = async (): Promise<CentroCusto[]> => {
  try {
    const apiUrl = `${import.meta.env.VITE_API_URL || ''}/api/cost-centers`;
    console.log('Fetching cost centers from:', apiUrl);
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      console.error('Response not OK:', response.status, response.statusText);
      throw new Error(`Falha ao carregar centros de custo: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Cost centers data received:', data);
    
    // Garantir que o retorno seja sempre um array
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Erro ao buscar centros de custo:', error);
    // Mostrar notificação de erro de forma amigável
    toast.error('Não foi possível carregar os centros de custo. Usando dados locais.');
    // Retornar array vazio em caso de erro
    return [];
  }
};

// Mock de dados para uso offline ou fallback
const mockCostCenters: CentroCusto[] = [
  { id: 1, codigo: 'CC001', descricao: 'Administrativo', ativo: true },
  { id: 2, codigo: 'CC002', descricao: 'Produção', ativo: true },
  { id: 3, codigo: 'CC003', descricao: 'Vendas', ativo: true },
  { id: 4, codigo: 'CC004', descricao: 'Financeiro', ativo: true },
  { id: 5, codigo: 'CC005', descricao: 'RH', ativo: true },
];

const CostCenterCombobox: React.FC<CostCenterComboboxProps> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Buscar centros de custo da API com fallback para dados mock em caso de erro
  const { data: costCenters = mockCostCenters, isLoading, isError } = useQuery({
    queryKey: ['costCenters'],
    queryFn: fetchCostCenters,
    meta: {
      onSettled: (data: any, error: any) => {
        if (error) {
          console.error('Error in useQuery:', error);
        }
      }
    }
  });
  
  useEffect(() => {
    if (isError) {
      console.log('Usando dados mock como fallback devido a erro na API');
    }
  }, [isError]);
  
  // Encontrar centro de custo pelo código
  const findCostCenterName = (code: string) => {
    if (!code) return "Selecione um centro de custo...";
    if (!costCenters || !Array.isArray(costCenters) || costCenters.length === 0) return code;
    
    const center = costCenters.find(c => c.codigo === code);
    return center ? `${center.codigo} - ${center.descricao}` : code;
  };
  
  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {value ? findCostCenterName(value) : "Selecione um centro de custo..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Buscar centro de custo..." />
            <CommandEmpty>
              Nenhum centro de custo encontrado.
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-2 w-full"
                onClick={() => {
                  setOpen(false);
                  setDialogOpen(true);
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Adicionar novo centro de custo
              </Button>
            </CommandEmpty>
            <CommandGroup>
              {Array.isArray(costCenters) && costCenters.map((center) => (
                <CommandItem
                  key={center.id}
                  value={center.codigo}
                  onSelect={(currentValue) => {
                    onChange(currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === center.codigo ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {center.codigo} - {center.descricao}
                </CommandItem>
              ))}
              <CommandItem
                value="new-center"
                onSelect={() => {
                  setOpen(false);
                  setDialogOpen(true);
                }}
                className="text-primary"
              >
                <Plus className="mr-2 h-4 w-4" />
                Adicionar novo centro de custo
              </CommandItem>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      
      <CostCenterDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
};

export default CostCenterCombobox;
