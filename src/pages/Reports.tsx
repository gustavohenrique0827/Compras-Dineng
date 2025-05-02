
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Download
} from 'lucide-react';
import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { toast } from 'sonner';

const Reports = () => {
  const isMobile = useIsMobile();
  const [reportType, setReportType] = useState('solicitacoes');
  const [period, setPeriod] = useState('mes');
  
  const data = [
    { name: 'Jan', valor: 4000 },
    { name: 'Fev', valor: 3000 },
    { name: 'Mar', valor: 2000 },
    { name: 'Abr', valor: 2780 },
    { name: 'Mai', valor: 1890 },
    { name: 'Jun', valor: 2390 },
  ];
  
  const handleDownloadReport = () => {
    toast.success('Relatório gerado com sucesso');
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className={`pb-20-1 ${isMobile ? 'pt-20-1' : 'ml-64-1'}`}>
        <div className="section-padding">
          <div className="max-w-6xl-1 mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold">Relatórios</h2>
                <p className="text-muted-foreground">
                  Acesse relatórios e análises do sistema
                </p>
              </div>
              
              <Button onClick={handleDownloadReport}>
                <Download className="mr-2 h-4 w-4" />
                Exportar Relatório
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card className="glass-card animate-fadeIn">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Solicitações</CardTitle>
                  <CardDescription>Total de solicitações</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">428</div>
                  <p className="text-sm text-green-600">+12% em relação ao mês anterior</p>
                </CardContent>
              </Card>
              
              <Card className="glass-card animate-fadeIn">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Compras</CardTitle>
                  <CardDescription>Total de compras</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">R$ 256.890,00</div>
                  <p className="text-sm text-red-600">-5% em relação ao mês anterior</p>
                </CardContent>
              </Card>
              
              <Card className="glass-card animate-fadeIn">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Economia</CardTitle>
                  <CardDescription>Economia gerada</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">R$ 32.450,00</div>
                  <p className="text-sm text-green-600">+8% em relação ao mês anterior</p>
                </CardContent>
              </Card>
            </div>
            
            <Card className="glass-card animate-fadeIn">
              <CardHeader>
                <CardTitle>Análise Gráfica</CardTitle>
                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Tipo de relatório" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solicitacoes">Solicitações</SelectItem>
                      <SelectItem value="compras">Compras</SelectItem>
                      <SelectItem value="fornecedores">Fornecedores</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={period} onValueChange={setPeriod}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="semana">Última semana</SelectItem>
                      <SelectItem value="mes">Último mês</SelectItem>
                      <SelectItem value="trimestre">Último trimestre</SelectItem>
                      <SelectItem value="ano">Último ano</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={data}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="valor" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Reports;
