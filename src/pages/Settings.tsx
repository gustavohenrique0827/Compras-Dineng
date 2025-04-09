import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { PlusCircle, Save, UserPlus } from 'lucide-react';
import { availablePositions, accessLevelOptions, getNivelAcessoColorClass, getNivelAcessoLabel } from '@/utils/auth';
import { toast } from 'sonner';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { userService } from '@/utils/apiClient';

const userSchema = z.object({
  nome: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  cargo: z.string().min(1, 'Selecione um cargo'),
  nivelAcesso: z.string().min(1, 'Selecione um nível de acesso'),
  departamento: z.string().optional(),
  matricula: z.string().min(1, 'Informe a matrícula'),
  ativo: z.boolean().default(true),
  senha: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres')
});

type UserFormValues = z.infer<typeof userSchema>;

// Componente principal
const Settings = () => {
  const [openNewUserDialog, setOpenNewUserDialog] = useState(false);
  const [userToToggle, setUserToToggle] = useState<{ id: number, active: boolean } | null>(null);
  
  const queryClient = useQueryClient();
  
  // Consulta para obter usuários
  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      console.log('Fetching users from: /api/users');
      const userData = await userService.getAllUsers();
      return userData || [];
    },
  });
  
  // Mutação para criar um novo usuário
  const createUserMutation = useMutation({
    mutationFn: (userData: UserFormValues) => {
      return userService.createUser(userData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setOpenNewUserDialog(false);
      toast.success("Usuário criado com sucesso!");
      form.reset();
    },
    onError: (error) => {
      console.error('Erro ao criar usuário:', error);
      toast.error("Erro ao criar usuário. Tente novamente.");
    }
  });
  
  // Mutação para alternar o status do usuário
  const toggleUserStatusMutation = useMutation({
    mutationFn: ({ id, active }: { id: number, active: boolean }) => {
      return userService.toggleUserStatus(id, active);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setUserToToggle(null);
      toast.success("Status do usuário atualizado com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao atualizar status do usuário.");
    }
  });
  
  // Form para novo usuário
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      nome: '',
      email: '',
      cargo: '',
      nivelAcesso: '',
      departamento: '',
      matricula: '',
      ativo: true,
      senha: ''
    }
  });
  
  // Manipulador para enviar o formulário de novo usuário
  const onSubmitUser: SubmitHandler<UserFormValues> = async (data) => {
    try {
      console.log('Submitting user to: /api/users');
      console.log('User data:', data);
      
      await createUserMutation.mutateAsync(data);
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
    }
  };
  
  // Manipulador para fechar o diálogo e redefinir o formulário
  const handleCloseDialog = () => {
    setOpenNewUserDialog(false);
    form.reset();
  };
  
  // Manipulador para alternar o status do usuário
  const handleToggleUserStatus = (id: number, currentStatus: boolean) => {
    setUserToToggle({ id, active: !currentStatus });
  };
  
  // Renderizar a interface
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Configurações</h1>
      </div>
      
      <Tabs defaultValue="users">
        <TabsList className="mb-4">
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="system">Sistema</TabsTrigger>
          <TabsTrigger value="database">Banco de Dados</TabsTrigger>
          <TabsTrigger value="integration">Integrações</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-semibold">Gerenciamento de Usuários</h2>
              <p className="text-muted-foreground">Gerencie os usuários e suas permissões no sistema</p>
            </div>
            
            <Dialog open={openNewUserDialog} onOpenChange={setOpenNewUserDialog}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Novo Usuário
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Usuário</DialogTitle>
                  <DialogDescription>
                    Preencha os campos abaixo para adicionar um novo usuário ao sistema.
                  </DialogDescription>
                </DialogHeader>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmitUser)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="nome"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome Completo</FormLabel>
                            <FormControl>
                              <Input placeholder="Nome do usuário" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="email@exemplo.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="cargo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cargo</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione um cargo" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Cargos</SelectLabel>
                                  {availablePositions.map((position) => (
                                    <SelectItem key={position.value} value={position.value}>
                                      {position.label}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="nivelAcesso"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nível de Acesso</FormLabel>
                            <Select 
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione um nível" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Níveis de Acesso</SelectLabel>
                                  {accessLevelOptions.map((level) => (
                                    <SelectItem key={level.value} value={level.value}>
                                      <div className="flex items-center gap-2">
                                        <div className={`w-3 h-3 rounded-full ${level.color}`} />
                                        <span>{level.label}</span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="departamento"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Departamento</FormLabel>
                            <FormControl>
                              <Input placeholder="Departamento (opcional)" {...field} />
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
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="senha"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Senha</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Senha" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="ativo"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-md border p-3 shadow-sm">
                            <div className="space-y-0.5">
                              <FormLabel>Status</FormLabel>
                              <FormDescription>
                                Usuário ativo no sistema
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
                    </div>
                    
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={handleCloseDialog}>
                        Cancelar
                      </Button>
                      <Button type="submit" disabled={createUserMutation.isPending}>
                        {createUserMutation.isPending ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Salvando...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Salvar
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="border rounded-md">
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : error ? (
              <div className="flex justify-center items-center h-32 text-destructive">
                Erro ao carregar usuários. Tente novamente.
              </div>
            ) : users.length === 0 ? (
              <div className="flex flex-col justify-center items-center h-32">
                <p className="text-muted-foreground mb-4">Nenhum usuário encontrado</p>
                <Button onClick={() => setOpenNewUserDialog(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Adicionar Usuário
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-muted border-b">
                      <th className="px-4 py-3 text-left font-medium">Nome</th>
                      <th className="px-4 py-3 text-left font-medium">Email</th>
                      <th className="px-4 py-3 text-left font-medium">Cargo</th>
                      <th className="px-4 py-3 text-left font-medium">Nível</th>
                      <th className="px-4 py-3 text-left font-medium">Matrícula</th>
                      <th className="px-4 py-3 text-left font-medium">Status</th>
                      <th className="px-4 py-3 text-left font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user: any) => (
                      <tr key={user.id} className="border-b hover:bg-muted/50">
                        <td className="px-4 py-3">{user.nome}</td>
                        <td className="px-4 py-3">{user.email}</td>
                        <td className="px-4 py-3">{user.cargo}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${getNivelAcessoColorClass(user.nivel)}`} />
                            <span>{getNivelAcessoLabel(user.nivel)}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">{user.matricula}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {user.ativo ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex space-x-2">
                            <AlertDialog 
                              open={userToToggle?.id === user.id} 
                              onOpenChange={() => setUserToToggle(null)}
                            >
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleToggleUserStatus(user.id, !!user.ativo)}
                                >
                                  {user.ativo ? 'Desativar' : 'Ativar'}
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    {userToToggle?.active 
                                      ? 'Ativar Usuário' 
                                      : 'Desativar Usuário'}
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    {userToToggle?.active 
                                      ? 'Tem certeza que deseja ativar este usuário?' 
                                      : 'Tem certeza que deseja desativar este usuário? Ele não poderá acessar o sistema.'}
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => {
                                      if (userToToggle) {
                                        toggleUserStatusMutation.mutate(userToToggle);
                                      }
                                    }}
                                  >
                                    Confirmar
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações do Sistema</CardTitle>
              <CardDescription>Gerenciar configurações gerais do sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company-name">Nome da Empresa</Label>
                <Input id="company-name" defaultValue="Dineng Engenharia" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-logo">Logo da Empresa</Label>
                <Input id="company-logo" type="file" />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="notifications" />
                <Label htmlFor="notifications">Ativar notificações por email</Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Salvar Configurações</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="database" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Banco de Dados</CardTitle>
              <CardDescription>Gerenciar configurações de conexão</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="db-host">Host</Label>
                <Input id="db-host" defaultValue="localhost" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="db-name">Nome do Banco</Label>
                <Input id="db-name" defaultValue="dineng_db" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="db-user">Usuário</Label>
                <Input id="db-user" defaultValue="admin" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="db-password">Senha</Label>
                <Input id="db-password" type="password" value="********" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Testar Conexão</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="integration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Integrações</CardTitle>
              <CardDescription>Configurar integrações com outros sistemas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <h3 className="font-medium">API Ext. Sistema Contratos</h3>
                  <p className="text-sm text-muted-foreground">Integração com sistema de contratos</p>
                </div>
                <Switch id="api-toggle" />
              </div>
              <div className="flex items-center justify-between py-2 border-t">
                <div>
                  <h3 className="font-medium">API Fornecedores</h3>
                  <p className="text-sm text-muted-foreground">Importação automática de fornecedores</p>
                </div>
                <Switch id="supplier-toggle" />
              </div>
              <div className="flex items-center justify-between py-2 border-t">
                <div>
                  <h3 className="font-medium">API Bancária</h3>
                  <p className="text-sm text-muted-foreground">Integração com sistema bancário</p>
                </div>
                <Switch id="bank-toggle" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Salvar Configurações</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
