
import React from 'react';
import { Approval, PurchaseRequest, formatDate } from '@/utils/mockData';
import { cn } from '@/lib/utils';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';

interface ApprovalStepProps {
  title: string;
  status?: 'approved' | 'rejected' | 'pending' | 'inactive';
  description?: string;
  date?: string;
  person?: string;
  level?: string;
  rejectionReason?: string;
  isLast?: boolean;
}

const ApprovalStep: React.FC<ApprovalStepProps> = ({
  title,
  status = 'inactive',
  description,
  date,
  person,
  level,
  rejectionReason,
  isLast
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="h-6 w-6 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-6 w-6 text-red-500" />;
      case 'pending':
        return <Clock className="h-6 w-6 text-amber-500" />;
      default:
        return <div className="h-6 w-6 rounded-full border-2 border-muted-foreground" />;
    }
  };

  return (
    <div className="flex">
      <div className="flex flex-col items-center">
        <div className="flex items-center justify-center z-10 bg-card">
          {getStatusIcon()}
        </div>
        {!isLast && (
          <div className={cn(
            "w-0.5 h-full mt-1",
            status === 'approved' ? "bg-green-200" : 
            status === 'rejected' ? "bg-red-200" : 
            status === 'pending' ? "bg-amber-200" : "bg-muted"
          )} />
        )}
      </div>
      
      <div className="ml-4 mb-8">
        <h4 className="text-sm font-medium">{title}</h4>
        
        {status !== 'inactive' && (
          <div className="mt-1">
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
            
            {date && person && (
              <div className="mt-1 text-xs text-muted-foreground">
                <span>{formatDate(date)}</span>
                <span className="mx-1">•</span>
                <span>{person}</span>
                {level && (
                  <>
                    <span className="mx-1">•</span>
                    <span>{level}</span>
                  </>
                )}
              </div>
            )}
            
            {status === 'rejected' && rejectionReason && (
              <div className="mt-2 p-2 bg-red-50 border border-red-100 rounded-md text-sm text-red-700">
                <strong>Motivo:</strong> {rejectionReason}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

interface ApprovalFlowProps {
  request: PurchaseRequest;
  className?: string;
}

const ApprovalFlow: React.FC<ApprovalFlowProps> = ({ request, className }) => {
  // Get latest approval for each stage
  const approvals = request.approvals || [];
  
  const solicitationApproval = approvals.find(a => a.stage === 'Solicitação');
  const quoteApproval = approvals.find(a => a.stage === 'Cotação');
  const acquisitionApproval = approvals.find(a => a.stage === 'Aquisição');
  
  const getStepStatus = (approval?: Approval) => {
    if (!approval) return 'inactive';
    if (approval.status === 'Aprovado') return 'approved';
    if (approval.status === 'Rejeitado') return 'rejected';
    return 'pending';
  };
  
  // Determine pending step
  let pendingStep = 'none';
  if (!solicitationApproval) {
    pendingStep = 'solicitation';
  } else if (solicitationApproval.status === 'Aprovado' && !quoteApproval) {
    pendingStep = 'quote';
  } else if (quoteApproval?.status === 'Aprovado' && !acquisitionApproval) {
    pendingStep = 'acquisition';
  }
  
  return (
    <div className={cn("py-2", className)}>
      <h3 className="text-lg font-semibold mb-6">Fluxo de Aprovação</h3>
      
      <div className="ml-2">
        <ApprovalStep 
          title="Solicitação"
          status={
            solicitationApproval 
              ? solicitationApproval.status === 'Aprovado' 
                ? 'approved' 
                : 'rejected'
              : pendingStep === 'solicitation' 
                ? 'pending' 
                : 'inactive'
          }
          description="Aprovação inicial do pedido"
          date={solicitationApproval?.approvalDate}
          person={solicitationApproval?.approvedBy}
          level={solicitationApproval?.approvalLevel}
          rejectionReason={solicitationApproval?.rejectionReason}
        />
        
        <ApprovalStep 
          title="Cotação"
          status={
            quoteApproval 
              ? quoteApproval.status === 'Aprovado' 
                ? 'approved' 
                : 'rejected'
              : pendingStep === 'quote' 
                ? 'pending' 
                : 'inactive'
          }
          description="Análise e aprovação das cotações"
          date={quoteApproval?.approvalDate}
          person={quoteApproval?.approvedBy}
          level={quoteApproval?.approvalLevel}
          rejectionReason={quoteApproval?.rejectionReason}
        />
        
        <ApprovalStep 
          title="Aquisição"
          status={
            acquisitionApproval 
              ? acquisitionApproval.status === 'Aprovado' 
                ? 'approved' 
                : 'rejected'
              : pendingStep === 'acquisition' 
                ? 'pending' 
                : 'inactive'
          }
          description="Autorização final da compra"
          date={acquisitionApproval?.approvalDate}
          person={acquisitionApproval?.approvedBy}
          level={acquisitionApproval?.approvalLevel}
          rejectionReason={acquisitionApproval?.rejectionReason}
          isLast={true}
        />
      </div>
    </div>
  );
};

export default ApprovalFlow;
