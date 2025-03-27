
import React from 'react';
import { 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  FileCheck, 
  ShoppingCart, 
  Package 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  color,
  trend,
  className 
}) => {
  return (
    <div className={cn(
      'glass-card rounded-xl p-5 animate-fadeIn',
      className
    )}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-semibold mt-1">{value}</h3>
          
          {trend && (
            <p className={cn(
              "text-xs mt-1 flex items-center",
              trend.isPositive ? "text-green-600" : "text-red-600"
            )}>
              {trend.isPositive ? '+' : ''}{trend.value}%
              <span className="text-muted-foreground ml-1">vs. mês anterior</span>
            </p>
          )}
        </div>
        
        <div className={cn(
          'rounded-full p-3',
          `bg-${color}-50 text-${color}-600`
        )}>
          {icon}
        </div>
      </div>
    </div>
  );
};

const DashboardStats: React.FC = () => {
  return (
    <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <StatCard
        title="Solicitações Pendentes"
        value="12"
        icon={<Clock className="h-6 w-6" />}
        color="blue"
        className="animate-slideInUp delay-100"
      />
      
      <StatCard
        title="Aprovações Necessárias"
        value="5"
        icon={<AlertCircle className="h-6 w-6" />}
        color="amber"
        trend={{ value: 12, isPositive: false }}
        className="animate-slideInUp delay-200"
      />
      
      <StatCard
        title="Compras Finalizadas"
        value="28"
        icon={<CheckCircle2 className="h-6 w-6" />}
        color="green"
        trend={{ value: 8, isPositive: true }}
        className="animate-slideInUp delay-300"
      />
      
      <StatCard
        title="Orçamentos em Análise"
        value="7"
        icon={<FileCheck className="h-6 w-6" />}
        color="purple"
        className="animate-slideInUp delay-400"
      />
      
      <StatCard
        title="Total de Compras (Mês)"
        value="R$ 45.280,00"
        icon={<ShoppingCart className="h-6 w-6" />}
        color="indigo"
        trend={{ value: 15, isPositive: true }}
        className="animate-slideInUp delay-500"
      />
      
      <StatCard
        title="Itens Comprados"
        value="142"
        icon={<Package className="h-6 w-6" />}
        color="teal"
        className="animate-slideInUp delay-500"
      />
    </div>
  );
};

export default DashboardStats;
