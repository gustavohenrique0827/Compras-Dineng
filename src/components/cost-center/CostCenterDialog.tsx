
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CentroCusto } from '@/utils/auth';

// Schema de validação para centro de custo
const costCenterSchema = z.object({
  codigo: z.string().min(1, "Código é obrigatório"),
  descricao: z.string().min(3, "Descrição deve ter pelo menos 3 caracteres"),
  ativo: z.boolean().default(true)
});

type CostCenterFormValues = z.infer<typeof costCenterSchema>;

// Interface para os props do componente
interface CostCenterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingCenter?: CentroCusto;
}

// Função para criar ou atualizar centro de custo na API
const saveCostCenter = async (data: CostCenterFormValues, id?: number) => {
  const url = id 
    ? `${import.meta.env.VITE_API_URL || ''}/api/cost-centers/${id}` 
    : `${import.meta.env.VITE_API_URL || ''}/api/cost-centers`;
  
  const method = id ? 'PUT' : 'POST';
  
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Erro ao salvar centro de custo');
  }
  
  return response.json();
};

const CostCenterDialog: React.FC<CostCenterDialogProps> = ({ 
  open, 
  onOpenChange, 
  editingCenter 
}) => {
  const queryClient = useQueryClient();
  
  // Configurar formulário com React Hook Form e Zod
  const form = useForm<CostCenterFormValues>({
    resolver: zodResolver(costCenterSchema),
    defaultValues: {
      codigo: editingCenter?.codigo || '',
      descricao: editingCenter?.descricao || '',
      ativo: editingCenter ? editingCenter.ativo : true
    }
  });
  
  // Reset form quando o centro de custo editado muda
  React.useEffect(() => {
    if (open) {
      form.reset({
        codigo: editingCenter?.codigo || '',
        descricao: editingCenter?.descricao || '',
        ativo: editingCenter ? editingCenter.ativo : true
      });
    }
  }, [form, editingCenter, open]);
  
  // Mutation para salvar centro de custo
  const mutation = useMutation({
    mutationFn: (data: CostCenterFormValues) => saveCostCenter(data, editingCenter?.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['costCenters'] });
      toast.success(
        editingCenter 
          ? 'Centro de custo atualizado com sucesso!' 
          : 'Centro de custo criado com sucesso!'
      );
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });
  
  // Handler para submit do formulário
  const onSubmit = (data: CostCenterFormValues) => {
    mutation.mutate(data);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editingCenter ? 'Editar Centro de Custo' : 'Novo Centro de Custo'}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="codigo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: CC001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Departamento Administrativo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="ativo"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Ativo</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button 
                type="submit"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? 'Salvando...' : 'Salvar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CostCenterDialog;
