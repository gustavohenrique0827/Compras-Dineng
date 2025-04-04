
import React, { useState } from 'react';
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

interface CostCenterComboboxProps {
  value: string;
  onChange: (value: string) => void;
}

// Função para buscar centros de custo da API
const fetchCostCenters = async (): Promise<CentroCusto[]> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/cost-centers`);
    if (!response.ok) {
      throw new Error('Falha ao carregar centros de custo');
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Erro ao buscar centros de custo:', error);
    return []; // Retorna array vazio em caso de erro
  }
};

const CostCenterCombobox: React.FC<CostCenterComboboxProps> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Buscar centros de custo da API
  const { data: costCenters = [], isLoading } = useQuery({
    queryKey: ['costCenters'],
    queryFn: fetchCostCenters
  });
  
  // Encontrar centro de custo pelo código
  const findCostCenterName = (code: string) => {
    if (!costCenters || costCenters.length === 0) return code;
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
