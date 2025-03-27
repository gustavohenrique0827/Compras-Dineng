
export type Status = 
  | 'Solicitado' 
  | 'Aprovado' 
  | 'Rejeitado' 
  | 'Em Cotação' 
  | 'Aprovado para Compra' 
  | 'Aquisitado' 
  | 'Finalizado';

export type Priority = 'Urgente' | 'Moderada' | 'Básica';
export type Category = 'Materiais' | 'Serviços' | 'Outros';
export type ApprovalLevel = 'Levantador' | 'Supervisão' | 'Coordenação' | 'Gerência' | 'Diretoria';

export interface RequestItem {
  id: number;
  description: string;
  quantity: number;
}

export interface PurchaseQuote {
  id: number;
  supplier: string;
  price: number;
  deliveryDate: string;
  conditions: string;
  approvedBy?: string;
  approvalLevel?: ApprovalLevel;
  status: 'Em Cotação' | 'Aprovado' | 'Rejeitado';
}

export interface Approval {
  id: number;
  stage: 'Solicitação' | 'Cotação' | 'Aquisição';
  status: 'Aprovado' | 'Rejeitado';
  approvedBy: string;
  approvalLevel: ApprovalLevel;
  approvalDate: string;
  rejectionReason?: string;
}

export interface PurchaseRequest {
  id: number;
  requesterName: string;
  application: string;
  costCenter: string;
  requestDate: string;
  deliveryLocation: string;
  deliveryDeadline: string;
  category: Category;
  reason: string;
  priority: Priority;
  status: Status;
  deadlineDate: string;
  items: RequestItem[];
  approvals?: Approval[];
  quotes?: PurchaseQuote[];
}

export const mockRequests: PurchaseRequest[] = [
  {
    id: 1,
    requesterName: "Carlos Silva",
    application: "Manutenção de equipamentos",
    costCenter: "CC-001",
    requestDate: "2023-09-15",
    deliveryLocation: "Almoxarifado Central",
    deliveryDeadline: "2023-09-25",
    category: "Materiais",
    reason: "Substituição de peças com desgaste",
    priority: "Moderada",
    status: "Aprovado",
    deadlineDate: "2023-09-25",
    items: [
      { id: 1, description: "Rolamento 6204", quantity: 10 },
      { id: 2, description: "Correia A-36", quantity: 5 }
    ],
    approvals: [
      {
        id: 1,
        stage: "Solicitação",
        status: "Aprovado",
        approvedBy: "João Gerente",
        approvalLevel: "Supervisão",
        approvalDate: "2023-09-16",
      }
    ]
  },
  {
    id: 2,
    requesterName: "Ana Martins",
    application: "Projeto Sistema ERP",
    costCenter: "CC-002",
    requestDate: "2023-09-10",
    deliveryLocation: "Departamento de TI",
    deliveryDeadline: "2023-09-20",
    category: "Serviços",
    reason: "Consultoria para implementação",
    priority: "Urgente",
    status: "Em Cotação",
    deadlineDate: "2023-09-15",
    items: [
      { id: 3, description: "Consultoria em implementação ERP", quantity: 1 }
    ],
    approvals: [
      {
        id: 2,
        stage: "Solicitação",
        status: "Aprovado",
        approvedBy: "Marcelo Diretor",
        approvalLevel: "Diretoria",
        approvalDate: "2023-09-11",
      }
    ],
    quotes: [
      {
        id: 1,
        supplier: "Consultoria ABC",
        price: 15000,
        deliveryDate: "2023-10-15",
        conditions: "Pagamento em 3x",
        status: "Em Cotação"
      },
      {
        id: 2,
        supplier: "Expertise Consultores",
        price: 12800,
        deliveryDate: "2023-10-20",
        conditions: "Pagamento em 2x",
        status: "Em Cotação"
      }
    ]
  },
  {
    id: 3,
    requesterName: "Roberto Almeida",
    application: "Escritório administrativo",
    costCenter: "CC-003",
    requestDate: "2023-09-05",
    deliveryLocation: "Recepção",
    deliveryDeadline: "2023-09-20",
    category: "Materiais",
    reason: "Reposição de estoque",
    priority: "Básica",
    status: "Finalizado",
    deadlineDate: "2023-09-20",
    items: [
      { id: 4, description: "Papel A4 (resmas)", quantity: 50 },
      { id: 5, description: "Canetas esferográficas (cx)", quantity: 10 },
      { id: 6, description: "Grampeadores", quantity: 5 }
    ],
    approvals: [
      {
        id: 3,
        stage: "Solicitação",
        status: "Aprovado",
        approvedBy: "Paulo Supervisor",
        approvalLevel: "Supervisão",
        approvalDate: "2023-09-06",
      },
      {
        id: 4,
        stage: "Cotação",
        status: "Aprovado",
        approvedBy: "Paulo Supervisor",
        approvalLevel: "Supervisão",
        approvalDate: "2023-09-08",
      },
      {
        id: 5,
        stage: "Aquisição",
        status: "Aprovado",
        approvedBy: "Paulo Supervisor",
        approvalLevel: "Supervisão",
        approvalDate: "2023-09-10",
      }
    ],
    quotes: [
      {
        id: 3,
        supplier: "Papelaria Central",
        price: 980,
        deliveryDate: "2023-09-15",
        conditions: "À vista",
        approvedBy: "Paulo Supervisor",
        approvalLevel: "Supervisão",
        status: "Aprovado"
      },
      {
        id: 4,
        supplier: "Office Supply",
        price: 1050,
        deliveryDate: "2023-09-12",
        conditions: "30 dias",
        status: "Rejeitado"
      }
    ]
  },
  {
    id: 4,
    requesterName: "Juliana Costa",
    application: "Laboratório de testes",
    costCenter: "CC-004",
    requestDate: "2023-09-18",
    deliveryLocation: "Laboratório Central",
    deliveryDeadline: "2023-10-03",
    category: "Materiais",
    reason: "Novos experimentos",
    priority: "Moderada",
    status: "Solicitado",
    deadlineDate: "2023-10-03",
    items: [
      { id: 7, description: "Reagente X (litros)", quantity: 5 },
      { id: 8, description: "Pipetas graduadas", quantity: 20 }
    ]
  },
  {
    id: 5,
    requesterName: "Marcos Pereira",
    application: "Departamento comercial",
    costCenter: "CC-005",
    requestDate: "2023-09-12",
    deliveryLocation: "Sala 302",
    deliveryDeadline: "2023-09-22",
    category: "Outros",
    reason: "Evento corporativo",
    priority: "Moderada",
    status: "Rejeitado",
    deadlineDate: "2023-09-22",
    items: [
      { id: 9, description: "Serviço de coffee-break", quantity: 1 },
      { id: 10, description: "Decoração de ambiente", quantity: 1 }
    ],
    approvals: [
      {
        id: 6,
        stage: "Solicitação",
        status: "Rejeitado",
        approvedBy: "Carla Coordenadora",
        approvalLevel: "Coordenação",
        approvalDate: "2023-09-13",
        rejectionReason: "Fora do orçamento trimestral"
      }
    ]
  }
];

export const getRequestById = (id: number): PurchaseRequest | undefined => {
  return mockRequests.find(request => request.id === id);
};

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR').format(date);
}

export const getStatusColor = (status: Status): string => {
  switch (status) {
    case 'Solicitado': return 'status-solicitado';
    case 'Aprovado': return 'status-aprovado';
    case 'Rejeitado': return 'status-rejeitado';
    case 'Em Cotação': return 'status-em-cotacao';
    case 'Aprovado para Compra': return 'status-aprovado-compra';
    case 'Aquisitado': return 'status-aquisitado';
    case 'Finalizado': return 'status-finalizado';
    default: return '';
  }
};

export const getPriorityColor = (priority: Priority): string => {
  switch (priority) {
    case 'Urgente': return 'prioridade-urgente';
    case 'Moderada': return 'prioridade-moderada';
    case 'Básica': return 'prioridade-basica';
    default: return '';
  }
};

export const getCategoryColor = (category: Category): string => {
  switch (category) {
    case 'Materiais': return 'categoria-materiais';
    case 'Serviços': return 'categoria-servicos';
    case 'Outros': return 'categoria-outros';
    default: return '';
  }
};

export const getDaysRemaining = (deadlineDate: string): number => {
  const today = new Date();
  const deadline = new Date(deadlineDate);
  const diffTime = deadline.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const getApprovalLevelForAmount = (amount: number): ApprovalLevel => {
  if (amount <= 100) return 'Levantador';
  if (amount <= 200) return 'Supervisão';
  if (amount <= 1000) return 'Coordenação';
  return 'Gerência';
};
