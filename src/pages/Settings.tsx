import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users,
  Building2,
  CreditCard,
  FileText,
  Settings as SettingsIcon,
  UserPlus
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { accessLevels, hasAccess } from '@/utils/auth';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import CostCenterDialog from '@/components/cost-center/CostCenterDialog';

const userFormSchema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  cargo: z.string().min(3, "Cargo deve ter pelo menos 3 caracteres"),
  nivel_acesso: z.enum(["amarelo", "azul", "marrom", "verde"]),
  departamento: z.string().optional(),
  matricula: z.string().min(1, "Matrícula é obrigatória"),
  ativo: z.boolean().default(true),
  senha: z.string().min(6, "Senha deve ter pelo menos 6 caracteres")
});

type UserFormValues = z.infer<typeof userFormSchema>;

const Settings = () => {
  const isMobile = useIsMobile();
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [costCenterDialogOpen, setCostCenterDialogOpen] = useState(false);
  const isAdmin = true;

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/users`);
      if (!response.ok) {
        throw new Error('Erro ao carregar usuários');
      }
      return response.json();
    },
    enabled: isAdmin
  });

  const { data: costCenters = [], isLoading: isLoadingCostCenters } = useQuery({
    queryKey: ['costCenters'],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/cost-centers`);
      if (!response.ok) {
        throw new Error('Erro ao carregar centros de custo');
      }
      return response.json();
    }
  });

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      nome: '',
      email: '',
      cargo: '',
      nivel_acesso: 'amarelo',
      departamento: '',
      matricula: '',
      ativo: true,
      senha: ''
    }
  });

  const onSubmitUser = async (data: UserFormValues) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Erro ao criar usuário');
      }

      toast.success('Usuário criado com sucesso!');
      setUserDialogOpen(false);
      form.reset();

      // Recarregar lista de usuários
      // queryClient.invalidateQueries({ queryKey: ['users'] });
    } catch (error: any) {
      toast.error(error.message || 'Erro ao criar usuário');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className={`pb-20 ${isMobile ? 'pt-20' : 'ml-64'}`}>
        <div className="p-4 sm:p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Configurações</h2>
            <p className="text-muted-foreground">Gerencie as configurações do sistema</p>
          </div>
          
          <Tabs defaultValue="users" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden md:inline">Usuários</span>
              </TabsTrigger>
              <TabsTrigger value="cost-centers" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                <span className="hidden md:inline">Centros de Custo</span>
              </TabsTrigger>
              <TabsTrigger value="approvals" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="hidden md:inline">Aprovações</span>
              </TabsTrigger>
              <TabsTrigger value="general" className="flex items-center gap-2">
                <SettingsIcon className="h-4 w-4" />
                <span className="hidden md:inline">Geral</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="users" className="mt-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Usuários</CardTitle>
                    <CardDescription>Gerencie os usuários do sistema</CardDescription>
                  </div>
                  <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="flex items-center gap-2">
                        <UserPlus className="h-4 w-4" />
                        Novo Usuário
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Novo Usuário</DialogTitle>
                        <DialogDescription>
                          Preencha os dados para criar um novo usuário no sistema
                        </DialogDescription>
                      </DialogHeader>
                      
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmitUser)} className="space-y-4 py-4">
                          <FormField
                            control={form.control}
                            name="nome"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nome</FormLabel>
                                <FormControl>
                                  <Input placeholder="Nome completo" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email</FormLabel>
                                  <FormControl>
                                    <Input placeholder="email@dineng.com.br" type="email" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="matricula"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Matrícula</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Número de matrícula" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <FormField
                            control={form.control}
                            name="senha"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Senha</FormLabel>
                                <FormControl>
                                  <Input placeholder="Senha" type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="cargo"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Cargo</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Cargo do usuário" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="departamento"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Departamento</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Departamento" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <FormField
                            control={form.control}
                            name="nivel_acesso"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nível de Acesso</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Selecione um nível de acesso" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {accessLevels.map((level) => (
                                      <SelectItem key={level.value} value={level.value}>
                                        <div className="flex items-center gap-2">
                                          <div className={`w-3 h-3 rounded-full ${level.color}`}></div>
                                          <span>{level.label}</span>
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormDescription>
                                  Define as permissões do usuário no sistema
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="ativo"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">Usuário Ativo</FormLabel>
                                  <FormDescription>
                                    Desative para impedir o acesso do usuário ao sistema
                                  </FormDescription>
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
                          
                          <div className="flex justify-end space-x-4 pt-4">
                            <Button 
                              type="button" 
                              variant="outline" 
                              onClick={() => setUserDialogOpen(false)}
                            >
                              Cancelar
                            </Button>
                            <Button type="submit">Salvar</Button>
                          </div>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                    </div>
                  ) : (
                    <div className="rounded-md border">
                      <div className="overflow-x-auto">
                        <table className="w-full divide-y divide-gray-200">
                          <thead className="bg-muted/50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Nome
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Email
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Cargo
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Acesso
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Status
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Ações
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((user: any) => (
                              <tr key={user.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                      {user.nome.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="ml-4">
                                      <div className="text-sm font-medium text-gray-900">
                                        {user.nome}
                                      </div>
                                      <div className="text-sm text-gray-500">
                                        {user.departamento || '-'}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{user.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{user.cargo}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full items-center gap-1">
                                    {(() => {
                                      const level = accessLevels.find(level => level.value === user.nivel_acesso);
                                      return (
                                        <>
                                          <div className={`w-2 h-2 rounded-full ${level ? level.color : 'bg-gray-400'}`}></div>
                                          <span>{level ? level.label : user.nivel_acesso}</span>
                                        </>
                                      );
                                    })()}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {user.ativo ? 'Ativo' : 'Inativo'}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <Button variant="ghost" size="sm">Editar</Button>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button variant="ghost" size="sm" className="text-destructive">
                                        {user.ativo ? 'Desativar' : 'Ativar'}
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>
                                          {user.ativo ? 'Desativar usuário' : 'Ativar usuário'}
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                          {user.ativo 
                                            ? `Tem certeza que deseja desativar o usuário ${user.nome}? Ele não poderá mais acessar o sistema.`
                                            : `Tem certeza que deseja ativar o usuário ${user.nome}? Ele poderá acessar o sistema novamente.`
                                          }
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction
                                          className={user.ativo ? 'bg-destructive hover:bg-destructive/90' : ''}
                                        >
                                          {user.ativo ? 'Desativar' : 'Ativar'}
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="cost-centers" className="mt-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Centros de Custo</CardTitle>
                    <CardDescription>Gerencie os centros de custo para solicitações</CardDescription>
                  </div>
                  <CostCenterDialog 
                    open={costCenterDialogOpen} 
                    onOpenChange={setCostCenterDialogOpen} 
                  />
                  <Button onClick={() => setCostCenterDialogOpen(true)}>
                    Novo Centro de Custo
                  </Button>
                </CardHeader>
                <CardContent>
                  {isLoadingCostCenters ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                    </div>
                  ) : (
                    <div className="rounded-md border">
                      <div className="overflow-x-auto">
                        <table className="w-full divide-y divide-gray-200">
                          <thead className="bg-muted/50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Código
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Descrição
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Status
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Ações
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {costCenters.map((center: any) => (
                              <tr key={center.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">{center.codigo}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{center.descricao}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${center.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {center.ativo ? 'Ativo' : 'Inativo'}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => {
                                      setCostCenterDialogOpen(true);
                                      // setEditingCenter(center);
                                    }}
                                  >
                                    Editar
                                  </Button>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button variant="ghost" size="sm" className="text-destructive">
                                        Excluir
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Excluir centro de custo</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Tem certeza que deseja excluir o centro de custo {center.codigo}? 
                                          Esta ação não pode ser desfeita.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction className="bg-destructive hover:bg-destructive/90">
                                          Excluir
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="approvals" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações de Aprovação</CardTitle>
                  <CardDescription>
                    Gerencie os fluxos de aprovação e limites de autorizações
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Níveis de Autorização</h3>
                    <p className="text-sm text-muted-foreground">
                      Defina os valores máximos para cada tipo de compra por nível de autorização
                    </p>
                    
                    <div className="rounded-md border">
                      <div className="overflow-x-auto">
                        <table className="w-full divide-y divide-gray-200">
                          <thead className="bg-muted/50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Nível
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Compras Impeditivas
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Compras de Consumo
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Compras para Estoque
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Compras Locais
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Investimentos
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Alojamentos
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  Levantador / Encarregado
                                </div>
                                <div className="text-xs text-yellow-500 font-medium">
                                  Amarelo
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">R$ 100,00</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">R$ 0,00</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">R$ 0,00</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">R$ 100,00</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">R$ 0,00</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">R$ 0,00</div>
                              </td>
                            </tr>
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  Supervisão / Segurança
                                </div>
                                <div className="text-xs text-blue-500 font-medium">
                                  Azul
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">R$ 200,00</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">R$ 200,00</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">R$ 200,00</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">R$ 200,00</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">R$ 0,00</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">R$ 0,00</div>
                              </td>
                            </tr>
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  Coordenação
                                </div>
                                <div className="text-xs text-amber-800 font-medium">
                                  Marrom
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">R$ 1.000,00</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">R$ 1.000,00</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">R$ 1.000,00</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">R$ 1.000,00</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">R$ 1.000,00</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">R$ 1.000,00</div>
                              </td>
                            </tr>
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  Gerência / Diretoria
                                </div>
                                <div className="text-xs text-green-500 font-medium">
                                  Verde
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">R$ 10.000,00+</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">R$ 10.000,00+</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">R$ 10.000,00+</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">R$ 10.000,00+</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">R$ 10.000,00+</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">R$ 10.000,00+</div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="general" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações Gerais</CardTitle>
                  <CardDescription>Preferências e configurações gerais do sistema</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex flex-col space-y-1.5">
                      <h3 className="text-lg font-medium">Configurações da Empresa</h3>
                      <p className="text-sm text-muted-foreground">
                        Informações básicas da empresa que serão exibidas nos relatórios e documentos
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Nome da Empresa</label>
                        <Input value="DinEng Construção e Manutenção LTDA" disabled />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">CNPJ</label>
                        <Input value="XX.XXX.XXX/0001-XX" disabled />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Endereço</label>
                        <Input value="Rua Exemplo, 123 - Cidade" disabled />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <Input value="contato@dineng.com.br" disabled />
                      </div>
                    </div>
                    
                    <div className="space-y-4 pt-4">
                      <div className="flex flex-col space-y-1.5">
                        <h3 className="text-lg font-medium">Configurações do Sistema</h3>
                        <p className="text-sm text-muted-foreground">
                          Ajuste as configurações de funcionamento do sistema
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between border p-4 rounded-lg">
                        <div>
                          <h4 className="font-medium">URL Personalizada</h4>
                          <p className="text-sm text-muted-foreground">
                            URL para acesso ao sistema
                          </p>
                        </div>
                        <div className="w-64">
                          <Input value="dinengcompras.com.br" disabled />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between border p-4 rounded-lg">
                        <div>
                          <h4 className="font-medium">Notificações por Email</h4>
                          <p className="text-sm text-muted-foreground">
                            Enviar emails de notificação para aprovações e novos registros
                          </p>
                        </div>
                        <Switch checked={true} disabled />
                      </div>
                      
                      <div className="flex items-center justify-between border p-4 rounded-lg">
                        <div>
                          <h4 className="font-medium">Backup Automático</h4>
                          <p className="text-sm text-muted-foreground">
                            Realizar backup automático diário dos dados
                          </p>
                        </div>
                        <Switch checked={true} disabled />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Settings;
