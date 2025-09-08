import IconifyIcon from '@/components/wrappers/IconifyIcon';
import ReactApexChart from 'react-apexcharts';
import { Card, CardBody, CardFooter, CardTitle, Col, Row } from 'react-bootstrap';
import { stateData, currentVariationConfig } from '../data';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
const StatsCard = ({
  amount,
  change,
  icon,
  name,
  variant,
  showVariation = true
}) => {
  return <Col md={6}>
      <Card className="overflow-hidden">
        <CardBody>
          <Row>
            <Col xs={6}>
              <div className="avatar-md rounded flex-centered" style={{backgroundColor: 'rgba(254, 208, 61, 0.2)'}}>
                <IconifyIcon icon={icon} className=" fs-24" style={{color: '#fed03d'}} />
              </div>
            </Col>
            <Col xs={6} className="text-end">
              <p className="text-muted mb-0 text-truncate">{name}</p>
              <h3 className="text-dark mt-1 mb-0">{amount}</h3>
            </Col>
          </Row>
        </CardBody>
        <CardFooter className="py-2 bg-light bg-opacity-50">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              {showVariation && (
                <>
                  <span className={`text-${variant} icons-center`}>
                    {variant == 'danger' ? <IconifyIcon icon="bxs:down-arrow" className="fs-12" /> : <IconifyIcon icon="bxs:up-arrow" className="fs-12" />}
                    &nbsp;{change}%
                  </span>
                  <span className="text-muted ms-1 fs-12">Last Week</span>
                </>
              )}
            </div>
            {showVariation && (
              <Link to="#!" className="text-reset fw-semibold fs-12">
                View More
              </Link>
            )}
          </div>
        </CardFooter>
      </Card>
    </Col>;
};
const Stats = () => {
  const [dynamicStateData, setDynamicStateData] = useState(stateData);
  const [monthData, setMonthData] = useState([]);
  const [cacheKey, setCacheKey] = useState(Date.now());
  const [showVariation, setShowVariation] = useState(currentVariationConfig.showVariation);

  // Função para carregar dados mensais do localStorage
  const loadMonthData = () => {
    const savedData = localStorage.getItem('month-data');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        setMonthData(data);
      } catch (error) {
        console.error('Erro ao carregar dados mensais:', error);
        setMonthData([]);
      }
    }
  };

  // Função para carregar configuração de variação do localStorage
  const loadVariationConfig = () => {
    const savedConfig = localStorage.getItem('dashboard-variation-config');
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        setShowVariation(config.showVariation);
      } catch (error) {
        console.error('Erro ao carregar configuração de variação:', error);
      }
    }
  };

  // Função para carregar métricas do localStorage
  const loadMetrics = () => {
    const savedMetrics = localStorage.getItem('dashboard-metrics');
    if (savedMetrics) {
      try {
        const metrics = JSON.parse(savedMetrics);
        const newStateData = [
          {
            icon: 'bx:dollar',
            name: 'Valor Investido',
            amount: metrics.valorInvestido.amount,
            variant: metrics.valorInvestido.variant,
            change: metrics.valorInvestido.change
          },
          {
            icon: 'bx:chat',
            name: 'Conversas Iniciadas',
            amount: metrics.conversasIniciadas.amount,
            variant: metrics.conversasIniciadas.variant,
            change: metrics.conversasIniciadas.change
          },
          {
            icon: 'bx:target-lock',
            name: 'Alcance',
            amount: metrics.alcance.amount,
            variant: metrics.alcance.variant,
            change: metrics.alcance.change
          },
          {
            icon: 'bx:dollar-circle',
            name: 'Custo por Conversa',
            amount: metrics.custoPorConversa.amount,
            variant: metrics.custoPorConversa.variant,
            change: metrics.custoPorConversa.change
          }
        ];
        setDynamicStateData(newStateData);
        setCacheKey(Date.now()); // Forçar atualização
      } catch (error) {
        console.error('Erro ao carregar métricas:', error);
      }
    }
  };

  // Carregar métricas na inicialização
  useEffect(() => {
    loadMetrics();
    loadMonthData();
    loadVariationConfig();
  }, []);

  // Listener para mudanças no localStorage
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'dashboard-metrics') {
        loadMetrics();
      }
      if (e.key === 'month-data') {
        loadMonthData();
      }
      if (e.key === 'dashboard-variation-config') {
        loadVariationConfig();
      }
    };

    const handleMetricsUpdate = () => {
      loadMetrics();
    };

    const handleMonthDataUpdate = () => {
      loadMonthData();
    };

    const handleVariationConfigUpdate = () => {
      loadVariationConfig();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('metricsUpdated', handleMetricsUpdate);
    window.addEventListener('monthDataUpdated', handleMonthDataUpdate);
    window.addEventListener('variationConfigUpdated', handleVariationConfigUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('metricsUpdated', handleMetricsUpdate);
      window.removeEventListener('monthDataUpdated', handleMonthDataUpdate);
      window.removeEventListener('variationConfigUpdated', handleVariationConfigUpdate);
    };
  }, []);
  // Função para gerar dados do gráfico baseado nos dados mensais
  const generateChartData = () => {
    if (monthData.length === 0) {
      // Dados padrão se não houver dados mensais
      return {
        series: [{
          name: 'Total de Conversas',
          type: 'bar',
          data: [34, 65, 46, 68, 49, 61, 42, 44, 78, 52, 63, 67]
        }],
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      };
    }

    // Ordenar dados por ano e mês
    const sortedData = monthData.sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      const monthOrder = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
      return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month);
    });

    const data = sortedData.map(item => item.totalConversations);
    const categories = sortedData.map(item => {
      const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      const monthIndex = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'].indexOf(item.month);
      return `${monthNames[monthIndex]} ${item.year}`;
    });

    return {
      series: [{
        name: 'Total de Conversas',
        type: 'bar',
        data: data
      }],
      categories: categories
    };
  };

  const chartData = generateChartData();

  const chartOptions = {
    series: chartData.series,
    chart: {
      height: 313,
      type: 'line',
      toolbar: {
        show: false
      },
      foreColor: '#fed03d'
    },
    stroke: {
      dashArray: [0, 0],
      width: [0, 2],
      curve: 'smooth'
    },
    fill: {
      opacity: [1, 1],
      type: ['solid', 'gradient'],
      gradient: {
        type: 'vertical',
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90]
      }
    },
    markers: {
      size: [0, 0],
      strokeWidth: 2,
      hover: {
        size: 4
      }
    },
    xaxis: {
      categories: chartData.categories,
      axisTicks: {
        show: false
      },
      axisBorder: {
        show: false
      },
      labels: {
        style: {
          colors: '#fed03d',
          fontSize: '12px',
          fontWeight: 'bold'
        }
      }
    },
    yaxis: {
      min: 0,
      axisBorder: {
        show: false
      },
      labels: {
        style: {
          colors: '#fed03d',
          fontSize: '12px',
          fontWeight: 'bold'
        }
      }
    },
    grid: {
      show: true,
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: false
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      },
      padding: {
        top: 0,
        right: -2,
        bottom: 0,
        left: 10
      }
    },
    legend: {
      show: true,
      horizontalAlign: 'center',
      offsetX: 0,
      offsetY: 5,
      markers: {
        width: 9,
        height: 9,
        radius: 6
      },
      itemMargin: {
        horizontal: 10,
        vertical: 0
      }
    },
    plotOptions: {
      bar: {
        columnWidth: '30%',
        barHeight: '70%',
        borderRadius: 3
      }
    },
    colors: ['#fed03d'],
    tooltip: {
      shared: true,
      y: [{
        formatter: function (y) {
          if (typeof y !== 'undefined') {
            return y.toLocaleString() + ' conversas';
          }
          return y;
        }
      }]
    }
  };
  return <>
      <Col xxl={5}>
        <Row>
          {dynamicStateData.map((item, idx) => <StatsCard key={`${cacheKey}-${idx}`} {...item} showVariation={showVariation} />)}
        </Row>
      </Col>
      <Col xxl={7}>
        <Card>
          <CardBody>
            <CardTitle as={'h4'}>Performance</CardTitle>
            <div dir="ltr">
              <div id="dash-performance-chart" className="apex-charts" />
              <style>
                {`
                  .performance-chart-custom .apexcharts-xaxis text,
                  .performance-chart-custom .apexcharts-yaxis text {
                    fill: #fed03d !important;
                    font-weight: bold !important;
                  }
                `}
              </style>
              <ReactApexChart 
                options={chartOptions} 
                series={chartOptions.series} 
                height={313} 
                type="line" 
                className="apex-charts performance-chart-custom" 
              />
            </div>
          </CardBody>
        </Card>
      </Col>
    </>;
};
export default Stats;