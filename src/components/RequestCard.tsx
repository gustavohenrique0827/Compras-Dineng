
import React from 'react';
import { Link } from 'react-router-dom';
import { PurchaseRequest, formatDate, getDaysRemaining } from '@/utils/mockData';
import StatusBadge from './StatusBadge';
import { Clock, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RequestCardProps {
  request: PurchaseRequest;
  className?: string;
}

const RequestCard: React.FC<RequestCardProps> = ({ request, className }) => {
  // Safely calculate days remaining if deadlineDate exists and is valid
  const daysRemaining = React.useMemo(() => {
    try {
      if (!request.deadlineDate) return 0;
      
      // Validate date before calculating days remaining
      const testDate = new Date(request.deadlineDate);
      if (isNaN(testDate.getTime())) {
        console.warn(`Invalid deadline date found: ${request.deadlineDate}`);
        return 0;
      }
      
      return getDaysRemaining(request.deadlineDate);
    } catch (error) {
      console.error("Error calculating days remaining:", error);
      return 0;
    }
  }, [request.deadlineDate]);
  
  // Safely format dates
  const safeFormatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Não informado';
    
    try {
      // Validate date before formatting
      const testDate = new Date(dateString);
      if (isNaN(testDate.getTime())) {
        console.warn(`Invalid date found: ${dateString}`);
        return 'Data inválida';
      }
      
      return formatDate(dateString);
    } catch (error) {
      console.error("Error formatting date:", error);
      return 'Data inválida';
    }
  };
  
  return (
    <Link 
      to={`/requests/${request.id}`}
      className={cn(
        'block w-full glass-card rounded-xl p-5 transition-all duration-300',
        'hover:shadow-elevated hover:translate-y-[-2px]',
        'animate-fadeIn',
        className
      )}
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex gap-2 mb-2">
              {request.category && <StatusBadge type="category" value={request.category} />}
              {request.priority && <StatusBadge type="priority" value={request.priority} />}
            </div>
            <h3 className="text-lg font-semibold line-clamp-1">{request.aplicacao ||'Sem título'}</h3>
            <p className="text-sm text-muted-foreground line-clamp-1">
              Solicitante: {request.nome_solicitante|| 'Não informado'}
            </p>
          </div>
          {request.status && <StatusBadge type="status" value={request.status} />}
        </div>
        
        <div className="border-t border-border pt-3 mt-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-muted-foreground">
              <FileText className="mr-1 h-4 w-4" />
              <span>CC: { request.centro_custo|| 'N/A'}</span>
            </div>
            <div className="flex items-center text-sm">
              <Clock className="mr-1 h-4 w-4" />
              <span className={cn(
                daysRemaining < 0 ? 'text-red-600' : 
                daysRemaining <= 2 ? 'text-amber-600' : 
                'text-muted-foreground'
              )}>
                {daysRemaining < 0 
                  ? `Atrasado: ${Math.abs(daysRemaining)} dias` 
                  : daysRemaining === 0 
                    ? 'Vence hoje'
                    : `${daysRemaining} dias restantes`}
              </span>
            </div>
          </div>
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <span>Solicitado: {safeFormatDate(request.requestDate)}</span>
            <span className="mx-2">•</span>
            <span>Entrega: {safeFormatDate(request.deliveryDeadline)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RequestCard;
