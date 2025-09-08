import { currency } from '@/context/constants';

// Função para obter métricas do localStorage
const getMetricsFromStorage = () => {
  const savedMetrics = localStorage.getItem('dashboard-metrics');
  if (savedMetrics) {
    try {
      return JSON.parse(savedMetrics);
    } catch (error) {
      console.error('Erro ao carregar métricas:', error);
    }
  }
  return null;
};

// Métricas padrão
const defaultMetrics = {
  valorInvestido: {
    amount: '13,647',
    change: '2.3',
    variant: 'success'
  },
  conversasIniciadas: {
    amount: '9,526',
    change: '8.1',
    variant: 'success'
  },
  alcance: {
    amount: '976',
    change: '0.3',
    variant: 'danger'
  },
  custoPorConversa: {
    amount: `${currency}123.6k`,
    change: '10.6',
    variant: 'danger'
  }
};

// Configuração padrão para variação dos cards
const defaultVariationConfig = {
  showVariation: true // Por padrão, a variação está ativada
};

// Função para obter configuração de variação do localStorage
const getVariationConfigFromStorage = () => {
  const savedConfig = localStorage.getItem('dashboard-variation-config');
  if (savedConfig) {
    try {
      return JSON.parse(savedConfig);
    } catch (error) {
      console.error('Erro ao carregar configuração de variação:', error);
    }
  }
  return null;
};

// Obter métricas atuais (do localStorage ou padrão)
const currentMetrics = getMetricsFromStorage() || defaultMetrics;

// Obter configuração de variação atual (do localStorage ou padrão)
export const currentVariationConfig = getVariationConfigFromStorage() || defaultVariationConfig;

export const stateData = [{
  icon: 'bx:dollar',
  name: 'Valor Investido',
  amount: currentMetrics.valorInvestido.amount,
  variant: currentMetrics.valorInvestido.variant,
  change: currentMetrics.valorInvestido.change
}, {
  icon: 'bx:chat',
  name: 'Conversas Iniciadas',
  amount: currentMetrics.conversasIniciadas.amount,
  variant: currentMetrics.conversasIniciadas.variant,
  change: currentMetrics.conversasIniciadas.change
}, {
  icon: 'bx:target-lock',
  name: 'Alcance',
  amount: currentMetrics.alcance.amount,
  variant: currentMetrics.alcance.variant,
  change: currentMetrics.alcance.change
}, {
  icon: 'bx:dollar-circle',
  name: 'Custo por Conversa',
  amount: currentMetrics.custoPorConversa.amount,
  variant: currentMetrics.custoPorConversa.variant,
  change: currentMetrics.custoPorConversa.change
}];
export const pagesList = [{
  path: 'larkon/ecommerce.html',
  views: 465,
  rate: '4.4',
  variant: 'success'
}, {
  path: 'larkon/dashboard.html',
  views: 426,
  rate: '20.4',
  variant: 'danger'
}, {
  path: 'larkon/chat.html',
  views: 254,
  rate: '12.25',
  variant: 'warning'
}, {
  path: 'larkon/auth-login.html',
  views: 3369,
  rate: '5.2',
  variant: 'success'
}, {
  path: 'larkon/email.html',
  views: 985,
  rate: '64.2',
  variant: 'danger'
}, {
  path: 'larkon/social.html',
  views: 653,
  rate: '2.4',
  variant: 'success'
}, {
  path: 'larkon/blog.html',
  views: 478,
  rate: '1.4',
  variant: 'danger'
}];