import React, { useState, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";

interface CostCenterOption {
  id: string;
  value: string;
  label: string;
}

interface CostCenterComboboxProps {
  value: string;
  onChange: (value: string) => void;
}

// Default fallback data in case API fails
const fallbackOptions = [
  { id: "1", value: "CC001", label: "CC001 - Administração" },
  { id: "2", value: "CC002", label: "CC002 - Produção" },
  { id: "3", value: "CC003", label: "CC003 - Marketing" },
  { id: "4", value: "CC004", label: "CC004 - Vendas" },
  { id: "5", value: "CC005", label: "CC005 - Compras" },
];

const CostCenterCombobox: React.FC<CostCenterComboboxProps> = ({
  value,
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<CostCenterOption[]>(fallbackOptions);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCostCenters = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
        console.log("Fetching cost centers from:", `${apiUrl}/api/cost-centers`);
        
        const response = await fetch(`${apiUrl}/api/cost-centers`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Cost centers data:", data);
        
        // Ensure data is an array before mapping
        if (Array.isArray(data) && data.length > 0) {
          const costCenterOptions = data.map((cc: any) => ({
            id: cc.id?.toString() || "",
            value: cc.codigo || cc.id_cc || "",
            label: `${cc.codigo || cc.id_cc || ""} - ${cc.nome || cc.descricao || ""}`,
          }));
          
          setOptions(costCenterOptions);
        } else {
          // If data is empty or not an array, keep using fallback
          console.warn("API returned empty or invalid data, using fallback options");
        }
      } catch (error) {
        console.error("Erro ao buscar centros de custo:", error);
        toast.error("Erro ao carregar centros de custo. Usando dados simulados.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCostCenters();
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? options.find((option) => option.value === value)?.label || value
            : "Selecionar Centro de Custo"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        {isLoading ? (
          <div className="flex items-center justify-center p-4">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            <span className="ml-2">Carregando...</span>
          </div>
        ) : (
          <Command>
            <CommandInput placeholder="Buscar centro de custo..." />
            <CommandEmpty>Nenhum centro de custo encontrado.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.id}
                  value={option.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default CostCenterCombobox;
