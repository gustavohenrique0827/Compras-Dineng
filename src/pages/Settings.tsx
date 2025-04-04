
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Settings as SettingsIcon,
  User,
  Building,
  Bell,
  Lock,
  Save,
  Plus,
  Trash2,
  Edit,
  UserPlus,
  ShieldAlert,
  Check,
  X
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import { getCurrentUser, accessLevels, User as UserType } from '@/utils/auth';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

// Mock de usuários para simular banco de dados
const mockUsers: UserType[] = [
  {
    id: 1,
    nome: 'Administrador',
    email: 'admin@dineng.com.br',
    cargo: 'Administrador',
    nivel_acesso: 'admin',
    ativo: true,
    departamento: 'TI',
    telefone: '(11) 99999-9999'
  },
  {
    id: 2,
    nome: 'João Silva',
    email: 'joao.silva@dineng.com.br',
    cargo: 'Gerente de Compras',
    nivel_acesso: 'gerente',
    ativo: true,
    departamento: 'Compras',
    telefone: '(11) 98888-8888'
  },
  {
    id: 3,
    nome: 'Maria Oliveira',
    email: 'maria.oliveira@dineng.com.br',
    cargo: 'Supervisor de Compras',
    nivel_acesso: 'supervisor',
    ativo: true,
    departamento: 'Compras',
    telefone: '(11) 97777-7777'
  }
];

const Settings = () => {
  const isMobile = useIsMobile();
  const currentUser = getCurrentUser();
  const isAdmin = currentUser?.nivel_acesso === 'admin' || currentUser?.nivel_acesso === 'gerente';
  
  const [activeTab, setActiveTab] = useState('perfil');
  const [users, setUsers] = useState<UserType[]>(mockUsers);
  
  // Estado para o formulário de usuário
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [userForm, setUserForm] = useState<Partial<UserType>>({
    nome: '',
    email: '',
    cargo: '',
    nivel_acesso: 'solicitante',
    ativo: true,
    departamento: '',
    telefone: ''
  });
  
  // Estados para os formulários de configuração
  const [perfilForm, setPerfilForm] = useState({
    nome: currentUser?.nome || '',
    email: currentUser?.email || '',
    telefone: currentUser?.telefone || '',
    cargo: currentUser?.cargo || ''
  });
  
  const [empresaForm, setEmpresaForm] = useState({
    empresa: 'Dineng',
    cnpj: '12.345.678/0001-90',
    endereco: 'Rua Exemplo, 123 - São Paulo, SP'
  });
  
  const [notificacoesForm, setNotificacoesForm] = useState({
    emailNotifications: true,
    systemNotifications: true,
    deadlineAlerts: true
  });
  
  const [senhaForm, setsenhaForm] = useState({
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: ''
  });
  
  // Funções para gerenciar usuários
  const handleAddUser = () => {
    setIsEditMode(false);
    setUserForm({
      nome: '',
      email: '',
      cargo: '',
      nivel_acesso: 'solicitante',
      ativo: true,
      departamento: '',
      telefone: ''
    });
    setIsUserDialogOpen(true);
  };
  
  const handleEditUser = (user: UserType) => {
    setIsEditMode(true);
    setUserForm({ ...user });
    setIsUserDialogOpen(true);
  };
  
  const handleSaveUser = () => {
    if (!userForm.nome || !userForm.email || !userForm.cargo || !userForm.nivel_acesso) {
      toast.error('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    if (isEditMode) {
      // Atualizar usuário existente
      setUsers(users.map(user => user.id === userForm.id ? { ...user, ...userForm } as UserType : user));
      toast.success('Usuário atualizado com sucesso!');
    } else {
      // Adicionar novo usuário
      const newUser: UserType = {
        id: users.length + 1,
        nome: userForm.nome!,
        email: userForm.email!,
        cargo: userForm.cargo!,
        nivel_acesso: userForm.nivel_acesso as UserType['nivel_acesso'],
        ativo: userForm.ativo ?? true,
        departamento: userForm.departamento,
        telefone: userForm.telefone
      };
      
      setUsers([...users, newUser]);
      toast.success('Usuário adicionado com sucesso!');
    }
    
    setIsUserDialogOpen(false);
  };
  
  const handleToggleUserStatus = (id: number) => {
    setUsers(users.map(user => 
      user.id === id ? { ...user, ativo: !user.ativo } : user
    ));
    
    const targetUser = users.find(user => user.id === id);
    if (targetUser) {
      toast.success(`Usuário ${targetUser.ativo ? 'desativado' : 'ativado'} com sucesso!`);
    }
  };
  
  // Funções para salvar configurações
  const handleSaveProfile = () => {
    // Aqui entraria a lógica para salvar no banco de dados
    toast.success('Perfil atualizado com sucesso!');
  };
  
  const handleSaveCompany = () => {
    // Aqui entraria a lógica para salvar no banco de dados
    toast.success('Dados da empresa atualizados com sucesso!');
  };
  
  const handleSaveNotifications = () => {
    // Aqui entraria a lógica para salvar no banco de dados
    toast.success('Configurações de notificações atualizadas com sucesso!');
  };
  
  const handleChangePassword = () => {
    if (!senhaForm.senhaAtual || !senhaForm.novaSenha || !senhaForm.confirmarSenha) {
      toast.error('Por favor, preencha todos os campos.');
      return;
    }
    
    if (senhaForm.novaSenha !== senhaForm.confirmarSenha) {
      toast.error('As senhas não coincidem.');
      return;
    }
    
    // Aqui entraria a lógica para validar a senha atual e atualizar no banco de dados
    
    // Limpar formulário
    setsenhaForm({
      senhaAtual: '',
      novaSenha: '',
      confirmarSenha: ''
    });
    
    toast.success('Senha alterada com sucesso!');
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className={`pb-20 ${isMobile ? 'pt-20' : 'ml-64'}`}>
        <div className="section-padding">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold">Configurações</h2>
                <p className="text-muted-foreground">
                  Configurações do sistema e perfil de usuário
                </p>
              </div>
            </div>
            
            <Card className="glass-card animate-fadeIn">
              <CardHeader>
                <CardTitle>Configurações do Sistema</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="perfil" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-8">
                    <TabsTrigger value="perfil">Perfil</TabsTrigger>
                    <TabsTrigger value="empresa">Empresa</TabsTrigger>
                    <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
                    <TabsTrigger value="seguranca">Segurança</TabsTrigger>
                    {isAdmin && <TabsTrigger value="usuarios">Usuários</TabsTrigger>}
                  </TabsList>
                  
                  <TabsContent value="perfil" className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary h-20 w-20 rounded-full flex items-center justify-center text-primary-foreground text-2xl font-bold">
                        {currentUser?.nome?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <h3 className="text-lg font-medium">{currentUser?.nome || 'Usuário Atual'}</h3>
                        <p className="text-muted-foreground">{currentUser?.cargo || 'Cargo'}</p>
                      </div>
                      <Button variant="outline" className="ml-auto">
                        Alterar Imagem
                      </Button>
                    </div>
                    
                    <Separator />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="nome">Nome completo</Label>
                        <Input 
                          id="nome" 
                          value={perfilForm.nome}
                          onChange={(e) => setPerfilForm({...perfilForm, nome: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">E-mail</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={perfilForm.email}
                          onChange={(e) => setPerfilForm({...perfilForm, email: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="telefone">Telefone</Label>
                        <Input 
                          id="telefone" 
                          value={perfilForm.telefone}
                          onChange={(e) => setPerfilForm({...perfilForm, telefone: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cargo">Cargo</Label>
                        <Input 
                          id="cargo" 
                          value={perfilForm.cargo}
                          onChange={(e) => setPerfilForm({...perfilForm, cargo: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <Button onClick={handleSaveProfile}>
                      <Save className="mr-2 h-4 w-4" />
                      Salvar Alterações
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="empresa" className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="empresa-nome">Nome da Empresa</Label>
                      <Input 
                        id="empresa-nome" 
                        value={empresaForm.empresa}
                        onChange={(e) => setEmpresaForm({...empresaForm, empresa: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="empresa-cnpj">CNPJ</Label>
                      <Input 
                        id="empresa-cnpj" 
                        value={empresaForm.cnpj}
                        onChange={(e) => setEmpresaForm({...empresaForm, cnpj: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="empresa-endereco">Endereço</Label>
                      <Input 
                        id="empresa-endereco" 
                        value={empresaForm.endereco}
                        onChange={(e) => setEmpresaForm({...empresaForm, endereco: e.target.value})}
                      />
                    </div>
                    
                    <Button onClick={handleSaveCompany}>
                      <Save className="mr-2 h-4 w-4" />
                      Salvar Alterações
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="notificacoes" className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Notificações por E-mail</h4>
                          <p className="text-muted-foreground text-sm">Receba notificações por e-mail</p>
                        </div>
                        <Switch 
                          checked={notificacoesForm.emailNotifications}
                          onCheckedChange={(checked) => 
                            setNotificacoesForm({...notificacoesForm, emailNotifications: checked})
                          }
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Notificações do Sistema</h4>
                          <p className="text-muted-foreground text-sm">Receba notificações no sistema</p>
                        </div>
                        <Switch 
                          checked={notificacoesForm.systemNotifications}
                          onCheckedChange={(checked) => 
                            setNotificacoesForm({...notificacoesForm, systemNotifications: checked})
                          }
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Alertas de Prazo</h4>
                          <p className="text-muted-foreground text-sm">Receba alertas sobre prazos de entrega</p>
                        </div>
                        <Switch 
                          checked={notificacoesForm.deadlineAlerts}
                          onCheckedChange={(checked) => 
                            setNotificacoesForm({...notificacoesForm, deadlineAlerts: checked})
                          }
                        />
                      </div>
                    </div>
                    
                    <Button onClick={handleSaveNotifications}>
                      <Save className="mr-2 h-4 w-4" />
                      Salvar Alterações
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="seguranca" className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="senha-atual">Senha Atual</Label>
                        <Input 
                          id="senha-atual" 
                          type="password"
                          value={senhaForm.senhaAtual}
                          onChange={(e) => setsenhaForm({...senhaForm, senhaAtual: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="nova-senha">Nova Senha</Label>
                        <Input 
                          id="nova-senha" 
                          type="password"
                          value={senhaForm.novaSenha}
                          onChange={(e) => setsenhaForm({...senhaForm, novaSenha: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirmar-senha">Confirmar Nova Senha</Label>
                        <Input 
                          id="confirmar-senha" 
                          type="password"
                          value={senhaForm.confirmarSenha}
                          onChange={(e) => setsenhaForm({...senhaForm, confirmarSenha: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <Button onClick={handleChangePassword}>
                      <Save className="mr-2 h-4 w-4" />
                      Alterar Senha
                    </Button>
                  </TabsContent>
                  
                  {isAdmin && (
                    <TabsContent value="usuarios" className="space-y-6">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">Gerenciamento de Usuários</h3>
                        <Button onClick={handleAddUser}>
                          <UserPlus className="mr-2 h-4 w-4" />
                          Adicionar Usuário
                        </Button>
                      </div>
                      
                      <Table>
                        <TableCaption>Lista de usuários do sistema</TableCaption>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Cargo</TableHead>
                            <TableHead>Nível de Acesso</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {users.map((user) => (
                            <TableRow key={user.id}>
                              <TableCell className="font-medium">{user.nome}</TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>{user.cargo}</TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <ShieldAlert className="mr-2 h-4 w-4 text-muted-foreground" />
                                  {accessLevels.find(level => level.value === user.nivel_acesso)?.label || user.nivel_acesso}
                                </div>
                              </TableCell>
                              <TableCell>
                                <span className={`px-2 py-1 rounded-full text-xs ${user.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                  {user.ativo ? 'Ativo' : 'Inativo'}
                                </span>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button variant="outline" size="icon" onClick={() => handleEditUser(user)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant={user.ativo ? "destructive" : "outline"} 
                                    size="icon"
                                    onClick={() => handleToggleUserStatus(user.id)}
                                  >
                                    {user.ativo ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TabsContent>
                  )}
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      {/* Dialog para adicionar/editar usuário */}
      <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Editar Usuário' : 'Adicionar Novo Usuário'}</DialogTitle>
            <DialogDescription>
              Preencha os dados do usuário para {isEditMode ? 'atualizar' : 'adicionar'} no sistema.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="user-nome">Nome completo</Label>
              <Input 
                id="user-nome" 
                value={userForm.nome || ''}
                onChange={(e) => setUserForm({...userForm, nome: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="user-email">E-mail</Label>
              <Input 
                id="user-email" 
                type="email" 
                value={userForm.email || ''}
                onChange={(e) => setUserForm({...userForm, email: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="user-cargo">Cargo</Label>
                <Input 
                  id="user-cargo" 
                  value={userForm.cargo || ''}
                  onChange={(e) => setUserForm({...userForm, cargo: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="user-nivel">Nível de Acesso</Label>
                <Select 
                  value={userForm.nivel_acesso || 'solicitante'}
                  onValueChange={(value) => setUserForm({
                    ...userForm, 
                    nivel_acesso: value as UserType['nivel_acesso']
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o nível" />
                  </SelectTrigger>
                  <SelectContent>
                    {accessLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="user-departamento">Departamento</Label>
                <Input 
                  id="user-departamento" 
                  value={userForm.departamento || ''}
                  onChange={(e) => setUserForm({...userForm, departamento: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="user-telefone">Telefone</Label>
                <Input 
                  id="user-telefone" 
                  value={userForm.telefone || ''}
                  onChange={(e) => setUserForm({...userForm, telefone: e.target.value})}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="user-ativo"
                checked={userForm.ativo ?? true}
                onCheckedChange={(checked) => setUserForm({...userForm, ativo: checked})}
              />
              <Label htmlFor="user-ativo">Usuário ativo</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUserDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveUser}>
              {isEditMode ? 'Salvar alterações' : 'Adicionar usuário'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Settings;
