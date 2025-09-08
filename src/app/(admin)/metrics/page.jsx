import { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, CardTitle, Col, Row, Form, Button, InputGroup } from 'react-bootstrap';
import ComponentContainerCard from '@/components/ComponentContainerCard';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

const MetricsPage = () => {
  const [metrics, setMetrics] = useState({
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
      amount: '$123.6k',
      change: '10.6',
      variant: 'danger'
    }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showVariation, setShowVariation] = useState(true);

  // Salvar no localStorage
  const saveMetrics = () => {
    localStorage.setItem('dashboard-metrics', JSON.stringify(metrics));
    setIsEditing(false);
    
    // Disparar evento customizado para notificar o dashboard
    window.dispatchEvent(new CustomEvent('metricsUpdated', { 
      detail: { metrics } 
    }));
    
    alert('Métricas salvas com sucesso!');
  };

  // Salvar configuração de variação
  const saveVariationConfig = () => {
    const variationConfig = { showVariation };
    localStorage.setItem('dashboard-variation-config', JSON.stringify(variationConfig));
    
    // Disparar evento customizado para notificar o dashboard
    window.dispatchEvent(new CustomEvent('variationConfigUpdated', { 
      detail: { variationConfig } 
    }));
    
    alert('Configuração de variação salva com sucesso!');
  };

  // Carregar do localStorage
  useEffect(() => {
    const savedMetrics = localStorage.getItem('dashboard-metrics');
    if (savedMetrics) {
      setMetrics(JSON.parse(savedMetrics));
    }

    const savedVariationConfig = localStorage.getItem('dashboard-variation-config');
    if (savedVariationConfig) {
      const config = JSON.parse(savedVariationConfig);
      setShowVariation(config.showVariation);
    }
  }, []);

  const handleInputChange = (metricKey, field, value) => {
    setMetrics(prev => ({
      ...prev,
      [metricKey]: {
        ...prev[metricKey],
        [field]: value
      }
    }));
  };

  const resetToDefault = () => {
    setMetrics({
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
        amount: '$123.6k',
        change: '10.6',
        variant: 'danger'
      }
    });
  };

  const metricCards = [
    {
      key: 'valorInvestido',
      title: 'Valor Investido',
      icon: 'solar:cart-5-bold-duotone',
      description: 'Valor total investido em campanhas'
    },
    {
      key: 'conversasIniciadas',
      title: 'Conversas Iniciadas',
      icon: 'bx:award',
      description: 'Número de conversas iniciadas'
    },
    {
      key: 'alcance',
      title: 'Alcance',
      icon: 'bxs:backpack',
      description: 'Alcance total das campanhas'
    },
    {
      key: 'custoPorConversa',
      title: 'Custo por Conversa',
      icon: 'bx:dollar-circle',
      description: 'Custo médio por conversa iniciada'
    }
  ];

  return (
    <div className="container-fluid">
      <Row>
        <Col xs={12}>
          <ComponentContainerCard
            title="Gerenciamento de Métricas"
            description="Edite os valores dos cards do dashboard manualmente"
          >
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h5 className="mb-1">Configuração dos Cards do Dashboard</h5>
                <p className="text-muted mb-0">Modifique os valores que aparecem nos cards do dashboard principal</p>
              </div>
              <div>
                <Button 
                  variant={isEditing ? "success" : "primary"} 
                  onClick={() => setIsEditing(!isEditing)}
                  className="me-2"
                >
                  <IconifyIcon icon={isEditing ? "bx:check" : "bx:edit"} className="me-1" />
                  {isEditing ? 'Salvar' : 'Editar'}
                </Button>
                <Button variant="outline-secondary" onClick={resetToDefault}>
                  <IconifyIcon icon="bx:reset" className="me-1" />
                  Resetar
                </Button>
              </div>
            </div>

            {/* Card de Configuração de Variação */}
            <Card className="mb-4 border-primary">
              <CardHeader className="bg-primary bg-opacity-10">
                <div className="d-flex align-items-center">
                  <IconifyIcon icon="bx:settings" className="fs-24 text-primary me-2" />
                  <div>
                    <CardTitle as="h6" className="mb-1 text-primary">Configuração de Variação</CardTitle>
                    <small className="text-muted">Controle se as variações percentuais devem ser exibidas nos cards</small>
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col md={8}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Exibir Variação dos Cards</Form.Label>
                      <Form.Check
                        type="switch"
                        id="showVariationSwitch"
                        label={showVariation ? "Variação ativada - Os cards mostrarão as variações percentuais" : "Variação desativada - Os cards não mostrarão as variações percentuais"}
                        checked={showVariation}
                        onChange={(e) => setShowVariation(e.target.checked)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4} className="d-flex align-items-end">
                    <Button 
                      variant="primary" 
                      onClick={saveVariationConfig}
                      className="w-100"
                    >
                      <IconifyIcon icon="bx:save" className="me-1" />
                      Salvar Configuração
                    </Button>
                  </Col>
                </Row>
              </CardBody>
            </Card>

            <Row>
              {metricCards.map((card) => (
                <Col lg={6} className="mb-4" key={card.key}>
                  <Card className="h-100">
                    <CardHeader className="d-flex align-items-center">
                      <div className="avatar-md rounded flex-centered me-3" style={{backgroundColor: 'rgba(254, 208, 61, 0.2)'}}>
                        <IconifyIcon icon={card.icon} className="fs-24" style={{color: '#fed03d'}} />
                      </div>
                      <div>
                        <CardTitle as="h6" className="mb-1">{card.title}</CardTitle>
                        <small className="text-muted">{card.description}</small>
                      </div>
                    </CardHeader>
                    <CardBody>
                      <Form>
                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Valor</Form.Label>
                              <Form.Control
                                type="text"
                                value={metrics[card.key].amount}
                                onChange={(e) => handleInputChange(card.key, 'amount', e.target.value)}
                                disabled={!isEditing}
                                placeholder="Ex: 13,647"
                              />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Variação (%)</Form.Label>
                              <Form.Control
                                type="number"
                                step="0.1"
                                value={metrics[card.key].change}
                                onChange={(e) => handleInputChange(card.key, 'change', e.target.value)}
                                disabled={!isEditing}
                                placeholder="Ex: 2.3"
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                        <Form.Group className="mb-3">
                          <Form.Label>Tipo de Variação</Form.Label>
                          <Form.Select
                            value={metrics[card.key].variant}
                            onChange={(e) => handleInputChange(card.key, 'variant', e.target.value)}
                            disabled={!isEditing}
                          >
                            <option value="success">Positiva (Verde)</option>
                            <option value="danger">Negativa (Vermelho)</option>
                            <option value="warning">Neutra (Amarelo)</option>
                          </Form.Select>
                        </Form.Group>
                      </Form>
                    </CardBody>
                  </Card>
                </Col>
              ))}
            </Row>

            {isEditing && (
              <div className="text-center mt-4 p-3 bg-light rounded">
                <p className="mb-3 text-muted">
                  <IconifyIcon icon="bx:info-circle" className="me-1" />
                  As alterações serão aplicadas imediatamente no dashboard após salvar
                </p>
                <Button variant="success" size="lg" onClick={saveMetrics}>
                  <IconifyIcon icon="bx:save" className="me-2" />
                  Salvar Alterações
                </Button>
              </div>
            )}
          </ComponentContainerCard>
        </Col>
      </Row>
    </div>
  );
};

export default MetricsPage;
