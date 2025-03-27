
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { createNewRequest } from '@/api/requests';
import { useIsMobile } from '@/hooks/use-mobile';

// Validation schema
const requestFormSchema = z.object({
  requesterName: z.string().min(3, {
    message: "Nome do solicitante deve ter pelo menos 3 caracteres.",
  }),
  application: z.string().min(3, {
    message: "Aplicação deve ter pelo menos 3 caracteres.",
  }),
  costCenter: z.string().min(1, {
    message: "Centro de custo é obrigatório.",
  }),
  deliveryLocation: z.string().min(3, {
    message: "Local de entrega deve ter pelo menos 3 caracteres.",
  }),
  deliveryDeadline: z.string().min(1, {
    message: "Prazo de entrega é obrigatório.",
  }),
  category: z.string().min(1, {
    message: "Categoria é obrigatória.",
  }),
  priority: z.string().min(1, {
    message: "Prioridade é obrigatória.",
  }),
  reason: z.string().min(10, {
    message: "Motivo deve ter pelo menos 10 caracteres.",
  }),
  items: z.array(
    z.object({
      description: z.string().min(3, {
        message: "Descrição deve ter pelo menos 3 caracteres.",
      }),
      quantity: z.number().min(1, {
        message: "Quantidade deve ser pelo menos 1.",
      }),
    })
  ).min(1, {
    message: "Adicione pelo menos um item à solicitação.",
  }),
});

type FormValues = z.infer<typeof requestFormSchema>;

const RequestForm = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  // Define form
  const form = useForm<FormValues>({
    resolver: zodResolver(requestFormSchema),
    defaultValues: {
      requesterName: "",
      application: "",
      costCenter: "",
      deliveryLocation: "",
      deliveryDeadline: new Date().toISOString().split('T')[0],
      category: "",
      priority: "",
      reason: "",
      items: [{ description: "", quantity: 1 }],
    },
  });

  // Use useFieldArray to manage items array
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items"
  });

  // Mutation for form submission
  const mutation = useMutation({
    mutationFn: (data: FormValues) => createNewRequest(data, data.items),
    onSuccess: () => {
      toast.success("Solicitação criada com sucesso!");
      navigate("/requests");
    },
    onError: (error) => {
      console.error("Erro ao criar solicitação:", error);
      toast.error("Erro ao criar a solicitação. Tente novamente.");
    }
  });

  // Submit handler
  const onSubmit = async (data: FormValues) => {
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className={`pb-20 ${isMobile ? 'pt-20' : 'ml-64'}`}>
        <div className="section-padding">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Nova Solicitação</h2>
              <p className="text-muted-foreground">
                Preencha os dados abaixo para criar uma nova solicitação de compra
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Informações Gerais</CardTitle>
                    <CardDescription>
                      Detalhes básicos sobre a solicitação
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="requesterName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome do Solicitante</FormLabel>
                          <FormControl>
                            <Input placeholder="Digite seu nome completo" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="application"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Aplicação</FormLabel>
                          <FormControl>
                            <Input placeholder="Para que será utilizado?" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="costCenter"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Centro de Custo</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: CC-001" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="deliveryLocation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Local de Entrega</FormLabel>
                            <FormControl>
                              <Input placeholder="Onde será entregue?" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Categoria</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione" />
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
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Urgente">Urgente (5 dias)</SelectItem>
                                <SelectItem value="Moderada">Moderada (10 dias)</SelectItem>
                                <SelectItem value="Básica">Básica (15 dias)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Define o prazo para aprovação
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
                              placeholder="Descreva detalhadamente o motivo desta solicitação..."
                              className="min-h-[120px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Itens Solicitados</CardTitle>
                    <CardDescription>
                      Adicione todos os itens necessários para esta solicitação
                    </CardDescription>
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
                                  <FormLabel>Descrição do Item {index + 1}</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Nome/descrição do item" {...field} />
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
                                  <FormLabel>Qtd.</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="number" 
                                      min={1}
                                      {...field}
                                      onChange={(e) => field.onChange(Number(e.target.value))}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          {fields.length > 1 && (
                            <div className="pt-8">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => remove(index)}
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                      
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => append({ description: "", quantity: 1 })}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Adicionar Item
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/requests")}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit"
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>Enviar Solicitação</>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RequestForm;
