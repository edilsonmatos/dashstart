import { WorldVectorMap } from '@/components/VectorMap';
import ReactApexChart from 'react-apexcharts';
import 'jsvectormap/dist/css/jsvectormap.css';
import { pagesList } from '../data';
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { currency } from '@/context/constants';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
const Conversions = ({ onCitySelect }) => {
  const [citiesData, setCitiesData] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [ageGenderData, setAgeGenderData] = useState([]);

  // Carregar dados das cidades do localStorage
  useEffect(() => {
    const loadCitiesData = () => {
      const savedCities = localStorage.getItem('cities-data');
      if (savedCities) {
        try {
          const cities = JSON.parse(savedCities);
          setCitiesData(cities);
        } catch (error) {
          console.error('Erro ao carregar dados das cidades:', error);
          setCitiesData([]);
        }
      } else {
        // Se não há dados salvos, usar dados padrão
        const defaultCities = [
          { id: 1, name: 'TEÓFILO OTONI - MG', valorInvestido: '15,000', conversas: '1,250', custoPorResultado: '12,00', image: null },
          { id: 2, name: 'ÁGUAS FORMOSAS - MG', valorInvestido: '12,500', conversas: '980', custoPorResultado: '12,76', image: null },
          { id: 3, name: 'ALMENARA - MG', valorInvestido: '18,200', conversas: '1,450', custoPorResultado: '12,55', image: null },
          { id: 4, name: 'CAPELINHA - MG', valorInvestido: '9,800', conversas: '750', custoPorResultado: '13,07', image: null },
          { id: 5, name: 'NANUQUE - MG', valorInvestido: '14,300', conversas: '1,120', custoPorResultado: '12,77', image: null },
          { id: 6, name: 'PINHEIROS - ES', valorInvestido: '11,700', conversas: '890', custoPorResultado: '13,15', image: null },
          { id: 7, name: 'SÃO MATEUS - ES', valorInvestido: '16,900', conversas: '1,380', custoPorResultado: '12,25', image: null }
        ];
        setCitiesData(defaultCities);
        localStorage.setItem('cities-data', JSON.stringify(defaultCities));
      }
    };

    loadCitiesData();

    // Listener para mudanças nas cidades
    const handleCitiesUpdate = () => {
      loadCitiesData();
    };

    window.addEventListener('citiesUpdated', handleCitiesUpdate);

    return () => {
      window.removeEventListener('citiesUpdated', handleCitiesUpdate);
    };
  }, []);

  // Carregar dados de idade/gênero do localStorage
  useEffect(() => {
    const loadAgeGenderData = () => {
      const savedData = localStorage.getItem('age-gender-data');
      if (savedData) {
        try {
          setAgeGenderData(JSON.parse(savedData));
        } catch (error) {
          console.error('Erro ao carregar dados de idade/gênero:', error);
          setAgeGenderData([]);
        }
      }
    };

    loadAgeGenderData();

    // Listener para mudanças nos dados de idade/gênero
    const handleAgeGenderUpdate = () => {
      loadAgeGenderData();
      // Se há uma cidade selecionada, atualizar os gráficos
      if (selectedCity) {
        const cityAgeGenderData = ageGenderData.find(item => 
          item.cityName === selectedCity.name || item.cityId === selectedCity.id
        );
        if (cityAgeGenderData) {
          updateChartsWithCityData(cityAgeGenderData);
        }
      }
    };

    window.addEventListener('ageGenderUpdated', handleAgeGenderUpdate);

    return () => {
      window.removeEventListener('ageGenderUpdated', handleAgeGenderUpdate);
    };
  }, []);

  // Função para lidar com clique na cidade
  const handleCityClick = (city) => {
    setSelectedCity(city);
    
    // Notificar componente pai sobre a cidade selecionada
    if (onCitySelect) {
      onCitySelect(city);
    }
    
    // Encontrar dados de idade/gênero para a cidade selecionada
    const cityAgeGenderData = ageGenderData.find(item => 
      item.cityName === city.name || item.cityId === city.id
    );
    
    if (cityAgeGenderData) {
      // Atualizar gráficos com dados da cidade selecionada
      updateChartsWithCityData(cityAgeGenderData);
    }
  };

  // Função para atualizar gráficos com dados da cidade
  const updateChartsWithCityData = (cityData) => {
    // Atualizar gráfico de idade
    const ageData = Object.values(cityData.ageGroups);
    setAgeChartOptions(prev => ({
      ...prev,
      series: [{ name: 'Conversas', data: ageData }]
    }));

    // Atualizar gráfico de gênero
    setGenderChartOptions(prev => ({
      ...prev,
      series: [cityData.gender.men, cityData.gender.women]
    }));
  };

  // Configurações do gráfico de barras para conversas por idade
  const [ageChartOptions, setAgeChartOptions] = useState({
    chart: {
      type: 'bar',
      height: 300,
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '60%',
        borderRadius: 4
      }
    },
    dataLabels: {
      enabled: false
    },
    colors: ['#1c84ee'],
    series: [{
      name: 'Conversas',
      data: [1200, 1800, 2200, 1900, 1500, 800]
    }],
    xaxis: {
      categories: ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'],
      labels: {
        style: {
          colors: '#9ca3af'
        }
      }
    },
    yaxis: {
      title: {
        text: 'Número de Conversas',
        style: {
          color: '#9ca3af'
        }
      },
      labels: {
        style: {
          colors: '#9ca3af'
        }
      }
    },
    grid: {
      borderColor: '#f1f3fa',
      strokeDashArray: 3
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + ' conversas'
        }
      }
    }
  });

  // Configurações do gráfico de rosca para conversas por gênero
  const [genderChartOptions, setGenderChartOptions] = useState({
    chart: {
      type: 'donut',
      height: 292,
      offsetX: 0,
      offsetY: 0
    },
    colors: ['#1c84ee', '#fed03d'], // Azul para homens, amarelo para mulheres
    series: [4500, 3200], // Homens: 4500, Mulheres: 3200
    labels: ['Homens', 'Mulheres'],
    plotOptions: {
      pie: {
        donut: {
          size: '50%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total',
              formatter: function (w) {
                return w.globals.seriesTotals.reduce((a, b) => {
                  return a + b
                }, 0)
              }
            }
          },
          offsetX: 0,
          offsetY: 0
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'center',
      formatter: function(seriesName, opts) {
        const val = opts.w.globals.series[opts.seriesIndex];
        const total = opts.w.globals.seriesTotals.reduce((a, b) => a + b, 0);
        const percent = ((val / total) * 100).toFixed(1);
        return seriesName + ': ' + val + ' (' + percent + '%)';
      }
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + ' conversas'
        }
      }
    }
  });

  const chartOptions = {
    chart: {
      height: 292,
      type: 'radialBar'
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        dataLabels: {
          name: {
            fontSize: '14px',
            color: 'undefined',
            offsetY: 100
          },
          value: {
            offsetY: 55,
            fontSize: '20px',
            color: undefined,
            formatter: function (val) {
              return val + '%';
            }
          }
        },
        track: {
          background: 'rgba(170,184,197, 0.2)',
          margin: 0
        }
      }
    },
    fill: {
      gradient: {
        // enabled: true,
        shade: 'dark',
        shadeIntensity: 0.2,
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 50, 65, 91]
      }
    },
    stroke: {
      dashArray: 4
    },
    colors: ['#22c55e', '#22c55e'],
    series: [65.2],
    labels: ['Returning Customer'],
    responsive: [{
      breakpoint: 380,
      options: {
        chart: {
          height: 180
        }
      }
    }],
    grid: {
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      }
    }
  };
  const options = {
    map: 'world',
    zoomOnScroll: true,
    zoomButtons: false,
    markersSelectable: true,
    markers: [{
      name: 'Canada',
      coords: [56.1304, -106.3468]
    }, {
      name: 'Brazil',
      coords: [-14.235, -51.9253]
    }, {
      name: 'Russia',
      coords: [61, 105]
    }, {
      name: 'China',
      coords: [35.8617, 104.1954]
    }, {
      name: 'United States',
      coords: [37.0902, -95.7129]
    }],
    markerStyle: {
      initial: {
        fill: '#fed03d',
        stroke: '#ffffff',
        strokeWidth: 2,
        r: 8
      },
      selected: {
        fill: '#22c55e',
        stroke: '#ffffff',
        strokeWidth: 2,
        r: 10
      },
      hover: {
        fill: '#fed03d',
        stroke: '#ffffff',
        strokeWidth: 2,
        r: 9
      }
    },
    labels: {
      markers: {
        render: marker => marker.name
      }
    },
    regionStyle: {
      initial: {
        fill: 'rgba(169,183,197, 0.3)',
        fillOpacity: 1
      }
    }
  };
  return <>
      <style>
        {`
          .valor-investido-azul {
            color: #1c84ee !important;
          }
          .conversas-amarelo {
            color: #fed03d !important;
          }
          .custo-por-resultado-azul {
            color: #1c84ee !important;
          }
          .age-chart-custom .apexcharts-xaxis text,
          .age-chart-custom .apexcharts-yaxis text {
            fill: #9ca3af !important;
          }
          .cidades-card .card-body {
            padding-bottom: 0 !important;
          }
          .cidades-card .table-responsive {
            margin-bottom: 0 !important;
            max-height: 280px !important;
            overflow-y: auto !important;
          }
          .cidades-card .table {
            margin-bottom: 0 !important;
          }
          .idade-card .card-body {
            padding-bottom: 0 !important;
            padding-top: 0.75rem !important;
          }
          .idade-card .card-title {
            margin-bottom: 0.5rem !important;
          }
          .genero-card .card-body {
            padding-bottom: 2rem !important;
          }
        `}
      </style>
      <Col lg={5}>
        <Card className="cidades-card">
          <CardHeader>
            <CardTitle as={'h4'}>
              Resultado por Cidades
              {selectedCity && (
                <small className="text-muted ms-2">
                  - Selecionada: {selectedCity.name}
                </small>
              )}
            </CardTitle>
          </CardHeader>
          <div className="table-responsive">
            <table className="table table-hover table-nowrap table-centered m-0">
              <thead className="bg-light bg-opacity-50">
                <tr>
                  <th className="text-muted ps-3">Cidades</th>
                  <th className="text-muted">Valor Investido</th>
                  <th className="text-muted">Conversas</th>
                  <th className="text-muted">Custo por Resultado</th>
                </tr>
              </thead>
              <tbody>
                {citiesData.length > 0 ? (
                  citiesData.map((city, idx) => (
                    <tr key={city.id || idx} style={{ cursor: 'pointer' }} onClick={() => handleCityClick(city)}>
                    <td className="ps-3">
                        <div className="d-flex align-items-center">
                          {city.image ? (
                            <img 
                              src={city.image} 
                              alt={city.name}
                              style={{ 
                                width: '24px', 
                                height: '24px', 
                                objectFit: 'cover',
                                borderRadius: '50%',
                                marginRight: '8px'
                              }} 
                            />
                          ) : (
                            <IconifyIcon icon="bx:map" className="text-primary me-2" style={{ fontSize: '16px' }} />
                          )}
                          <span className={`text-muted ${selectedCity && selectedCity.id === city.id ? 'fw-bold text-primary' : ''}`}>
                            {city.name}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className="valor-investido-azul fw-medium">
                          R$ {city.valorInvestido}
                        </span>
                      </td>
                      <td>
                        <span className="fw-medium conversas-amarelo">
                          {city.conversas}
                        </span>
                    </td>
                      <td>
                        <span className="custo-por-resultado-azul fw-medium">
                          R$ {city.custoPorResultado || '0,00'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center text-muted py-3">
                      Nenhuma cidade cadastrada
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </Col>
      <Col lg={3}>
        <Card className="idade-card">
          <CardBody>
            <CardTitle as={'h5'}>Conversas por Idade</CardTitle>
            <ReactApexChart 
              options={ageChartOptions} 
              series={ageChartOptions.series} 
              type="bar" 
              height={300} 
              className="apex-charts age-chart-custom"
            />
          </CardBody>
        </Card>
      </Col>
      <Col lg={4}>
        <Card className="genero-card">
          <CardBody>
            <CardTitle as={'h5'}>Conversas por Gênero</CardTitle>
            <ReactApexChart options={genderChartOptions} series={genderChartOptions.series} height={292} type="donut" className="apex-charts mb-2 mt-n2"             />
          </CardBody>
        </Card>
      </Col>
      <Col xl={4} className="d-none">
        <Card>
          <CardHeader className="d-flex justify-content-between align-items-center">
            <CardTitle as={'h4'}>Recent Transactions</CardTitle>
            <div>
              <Button variant="primary" size="sm">
                <IconifyIcon icon="bx:plus" className="me-1" />
                Add
              </Button>
            </div>
          </CardHeader>
          <CardBody className="p-0">
            <div className="px-3" data-simplebar style={{
            maxHeight: 398
          }}>
              <table className="table table-hover mb-0 table-centered">
                <tbody>
                  <tr>
                    <td>24 April, 2024</td>
                    <td>{currency}120.55</td>
                    <td>
                      <span className="badge bg-success">Cr</span>
                    </td>
                    <td>Commisions </td>
                  </tr>
                  <tr>
                    <td>24 April, 2024</td>
                    <td>{currency}9.68</td>
                    <td>
                      <span className="badge bg-success">Cr</span>
                    </td>
                    <td>Affiliates </td>
                  </tr>
                  <tr>
                    <td>20 April, 2024</td>
                    <td>{currency}105.22</td>
                    <td>
                      <span className="badge bg-danger">Dr</span>
                    </td>
                    <td>Grocery </td>
                  </tr>
                  <tr>
                    <td>18 April, 2024</td>
                    <td>{currency}80.59</td>
                    <td>
                      <span className="badge bg-success">Cr</span>
                    </td>
                    <td>Refunds </td>
                  </tr>
                  <tr>
                    <td>18 April, 2024</td>
                    <td>{currency}750.95</td>
                    <td>
                      <span className="badge bg-danger">Dr</span>
                    </td>
                    <td>Bill Payments </td>
                  </tr>
                  <tr>
                    <td>17 April, 2024</td>
                    <td>{currency}455.62</td>
                    <td>
                      <span className="badge bg-danger">Dr</span>
                    </td>
                    <td>Electricity </td>
                  </tr>
                  <tr>
                    <td>17 April, 2024</td>
                    <td>{currency}102.77</td>
                    <td>
                      <span className="badge bg-success">Cr</span>
                    </td>
                    <td>Interest </td>
                  </tr>
                  <tr>
                    <td>16 April, 2024</td>
                    <td>{currency}79.49</td>
                    <td>
                      <span className="badge bg-success">Cr</span>
                    </td>
                    <td>Refunds </td>
                  </tr>
                  <tr>
                    <td>05 April, 2024</td>
                    <td>{currency}980.00</td>
                    <td>
                      <span className="badge bg-danger">Dr</span>
                    </td>
                    <td>Shopping</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      </Col>
    </>;
};
export default Conversions;