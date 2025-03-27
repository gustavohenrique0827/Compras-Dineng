
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useIsMobile } from '@/hooks/use-mobile';

// Define schema for form validation
const formSchema = z.object({
  requesterName: z.string().min(3, {
    message: "Nome do solicitante deve ter pelo menos 3 caracteres",
  }),
  application: z.string().min(5, {
    message: "Aplicação deve ter pelo menos 5 caracteres",
  }),
  costCenter: z.string().min(2, {
    message: "Centro de custo é obrigatório",
  }),
  deliveryLocation: z.string().min(3, {
    message: "Local de entrega deve ter pelo menos 3 caracteres",
  }),
  deliveryDeadline: z.string().min(1, {
    message: "Prazo de entrega é obrigatório",
  }),
  category: z.enum(["Materiais", "Serviços", "Outros"], {
    message: "Categoria é obrigatória",
  }),
  priority: z.enum(["Urgente", "Moderada", "Básica"], {
    message: "Prioridade é obrigatória",
  }),
  reason: z.string().min(10, {
    message: "Motivo deve ter pelo menos 10 caracteres",
  }),
  items: z.array(
    z.object({
      description: z.string().min(3, { message: "Descrição é obrigatória" }),
      quantity: z.coerce.number().positive({ message: "Quantidade deve ser positiva" }),
    })
  ).min(1, { message: "Pelo menos um item é obrigatório" }),
});

type FormValues = z.infer<typeof formSchema>;

const RequestForm: React.FC = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      requesterName: "",
      application: "",
      costCenter: "",
      deliveryLocation: "",
      deliveryDeadline: new Date().toISOString().split('T')[0],
      category: "Materiais",
      priority: "Moderada",
      reason: "",
      items: [{ description: "", quantity: 1 }],
    },
  });

  // Use useFieldArray instead of accessing control._formValues directly
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items"
  });

  // Submit handler
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Form submitted:", data);
      toast.success("Solicitação criada com sucesso!");
      setIsSubmitting(false);
      navigate("/");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className={`pb-20 ${isMobile ? 'pt-20' : 'ml-64'}`}>
        <div className="section-padding">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 animate-fadeIn">Nova Solicitação de Compra</h2>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <Card className="glass-card animate-slideInUp">
                  <CardHeader>
                    <CardTitle>Informações da Solicitação</CardTitle>
                    <CardDescription>
                      Preencha os dados básicos da sua solicitação de compra
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="requesterName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome do Solicitante</FormLabel>
                            <FormControl>
                              <Input placeholder="João Silva" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="costCenter"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Centro de Custo</FormLabel>
                            <FormControl>
                              <Input placeholder="CC-001" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="application"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Aplicação (Para que será usado)</FormLabel>
                          <FormControl>
                            <Input placeholder="Manutenção de equipamentos" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="deliveryLocation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Local de Entrega</FormLabel>
                            <FormControl>
                              <Input placeholder="Almoxarifado Central" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="deliveryDeadline"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Prazo de Entrega</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Categoria</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione a categoria" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Materiais">Materiais</SelectItem>
                                <SelectItem value="Serviços">Serviços</SelectItem>
                                <SelectItem value="Outros">Outros</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="priority"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Prioridade</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione a prioridade" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Urgente">Urgente (5 dias)</SelectItem>
                                <SelectItem value="Moderada">Moderada (10 dias)</SelectItem>
                                <SelectItem value="Básica">Básica (15 dias)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Define o prazo máximo para atendimento da solicitação
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="reason"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Motivo da Compra</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Descreva o motivo da necessidade desta compra"
                              className="resize-none min-h-[100px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
                
                <Card className="glass-card animate-slideInUp delay-100">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Itens da Solicitação</CardTitle>
                        <CardDescription>
                          Adicione todos os itens que deseja solicitar
                        </CardDescription>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => append({ description: "", quantity: 1 })}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Adicionar
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {fields.map((item, index) => (
                        <div key={item.id} className="flex items-start gap-4">
                          <div className="flex-1">
                            <FormField
                              control={form.control}
                              name={`items.${index}.description`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className={index !== 0 ? "sr-only" : ""}>
                                    Descrição
                                  </FormLabel>
                                  <FormControl>
                                    <Input placeholder="Descrição do item" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div className="w-24">
                            <FormField
                              control={form.control}
                              name={`items.${index}.quantity`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className={index !== 0 ? "sr-only" : ""}>
                                    Qtd
                                  </FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="number" 
                                      min="1"
                                      step="1"
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div className="pt-8">
                            {index > 0 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => remove(index)}
                              >
                                <Trash2 className="h-4 w-4 text-muted-foreground" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                      
                      {form.formState.errors.items?.message && (
                        <p className="text-sm font-medium text-destructive">
                          {form.formState.errors.items.message}
                        </p>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/')}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Enviando..." : "Enviar Solicitação"}
                    </Button>
                  </CardFooter>
                </Card>
              </form>
            </Form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RequestForm;
