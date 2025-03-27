
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Settings as SettingsIcon,
  User,
  Building,
  Bell,
  Lock,
  Save
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';

const Settings = () => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('perfil');
  
  const handleSaveSettings = () => {
    toast.success('Configurações salvas com sucesso');
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
                  <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
                    <TabsTrigger value="perfil">Perfil</TabsTrigger>
                    <TabsTrigger value="empresa">Empresa</TabsTrigger>
                    <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
                    <TabsTrigger value="seguranca">Segurança</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="perfil" className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary h-20 w-20 rounded-full flex items-center justify-center text-primary-foreground text-2xl font-bold">
                        U
                      </div>
                      <div>
                        <h3 className="text-lg font-medium">Usuário Atual</h3>
                        <p className="text-muted-foreground">Gerente de Compras</p>
                      </div>
                      <Button variant="outline" className="ml-auto">
                        Alterar Imagem
                      </Button>
                    </div>
                    
                    <Separator />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="nome">Nome completo</Label>
                        <Input id="nome" defaultValue="Usuário Atual" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">E-mail</Label>
                        <Input id="email" type="email" defaultValue="usuario@empresa.com" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="telefone">Telefone</Label>
                        <Input id="telefone" defaultValue="(11) 98765-4321" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cargo">Cargo</Label>
                        <Input id="cargo" defaultValue="Gerente de Compras" />
                      </div>
                    </div>
                    
                    <Button onClick={handleSaveSettings}>
                      <Save className="mr-2 h-4 w-4" />
                      Salvar Alterações
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="empresa" className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="empresa-nome">Nome da Empresa</Label>
                      <Input id="empresa-nome" defaultValue="Dineng" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="empresa-cnpj">CNPJ</Label>
                      <Input id="empresa-cnpj" defaultValue="12.345.678/0001-90" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="empresa-endereco">Endereço</Label>
                      <Input id="empresa-endereco" defaultValue="Rua Exemplo, 123 - São Paulo, SP" />
                    </div>
                    
                    <Button onClick={handleSaveSettings}>
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
                        <Switch defaultChecked />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Notificações do Sistema</h4>
                          <p className="text-muted-foreground text-sm">Receba notificações no sistema</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Alertas de Prazo</h4>
                          <p className="text-muted-foreground text-sm">Receba alertas sobre prazos de entrega</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                    
                    <Button onClick={handleSaveSettings}>
                      <Save className="mr-2 h-4 w-4" />
                      Salvar Alterações
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="seguranca" className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="senha-atual">Senha Atual</Label>
                        <Input id="senha-atual" type="password" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="nova-senha">Nova Senha</Label>
                        <Input id="nova-senha" type="password" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirmar-senha">Confirmar Nova Senha</Label>
                        <Input id="confirmar-senha" type="password" />
                      </div>
                    </div>
                    
                    <Button onClick={handleSaveSettings}>
                      <Save className="mr-2 h-4 w-4" />
                      Alterar Senha
                    </Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
