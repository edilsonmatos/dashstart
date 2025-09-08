import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardTitle, Col, Row, Form, Button, Table, Modal, Alert } from 'react-bootstrap';
import ComponentContainerCard from '@/components/ComponentContainerCard';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

const CitiesPage = () => {
  const [cities, setCities] = useState(() => {
    const savedCities = localStorage.getItem('cities-data');
    return savedCities ? JSON.parse(savedCities) : [
      { id: 1, name: 'TEÓFILO OTONI - MG', valorInvestido: '15,000', conversas: '1,250', custoPorResultado: '12,00', image: null },
      { id: 2, name: 'ÁGUAS FORMOSAS - MG', valorInvestido: '12,500', conversas: '980', custoPorResultado: '12,76', image: null },
      { id: 3, name: 'ALMENARA - MG', valorInvestido: '18,200', conversas: '1,450', custoPorResultado: '12,55', image: null },
      { id: 4, name: 'CAPELINHA - MG', valorInvestido: '9,800', conversas: '750', custoPorResultado: '13,07', image: null },
      { id: 5, name: 'NANUQUE - MG', valorInvestido: '14,300', conversas: '1,120', custoPorResultado: '12,77', image: null },
      { id: 6, name: 'PINHEIROS - ES', valorInvestido: '11,700', conversas: '890', custoPorResultado: '13,15', image: null },
      { id: 7, name: 'SÃO MATEUS - ES', valorInvestido: '16,900', conversas: '1,380', custoPorResultado: '12,25', image: null }
    ];
  });

  const [showModal, setShowModal] = useState(false);
  const [editingCity, setEditingCity] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    valorInvestido: '',
    conversas: '',
    custoPorResultado: '',
    image: null
  });
  const [showAlert, setShowAlert] = useState({ show: false, message: '', variant: 'success' });

  // Salvar dados no localStorage sempre que cities mudar
  useEffect(() => {
    localStorage.setItem('cities-data', JSON.stringify(cities));
    // Disparar evento para atualizar o dashboard
    window.dispatchEvent(new CustomEvent('citiesUpdated', { detail: { cities } }));
  }, [cities]);

  // Função para limpar cache e resetar dados
  const clearCacheAndReset = () => {
    localStorage.removeItem('cities-data');
    // Forçar atualização imediata com dados corretos
    const correctCities = [
      { id: 1, name: 'TEÓFILO OTONI - MG', valorInvestido: '15,000', conversas: '1,250', custoPorResultado: '12,00', image: null },
      { id: 2, name: 'ÁGUAS FORMOSAS - MG', valorInvestido: '12,500', conversas: '980', custoPorResultado: '12,76', image: null },
      { id: 3, name: 'ALMENARA - MG', valorInvestido: '18,200', conversas: '1,450', custoPorResultado: '12,55', image: null },
      { id: 4, name: 'CAPELINHA - MG', valorInvestido: '9,800', conversas: '750', custoPorResultado: '13,07', image: null },
      { id: 5, name: 'NANUQUE - MG', valorInvestido: '14,300', conversas: '1,120', custoPorResultado: '12,77', image: null },
      { id: 6, name: 'PINHEIROS - ES', valorInvestido: '11,700', conversas: '890', custoPorResultado: '13,15', image: null },
      { id: 7, name: 'SÃO MATEUS - ES', valorInvestido: '16,900', conversas: '1,380', custoPorResultado: '12,25', image: null }
    ];
    setCities(correctCities);
    localStorage.setItem('cities-data', JSON.stringify(correctCities));
    window.dispatchEvent(new CustomEvent('citiesUpdated', { detail: { cities: correctCities } }));
    setShowAlert({ show: true, message: 'Cache limpo e dados atualizados!', variant: 'success' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({
          ...prev,
          image: event.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.valorInvestido || !formData.conversas || !formData.custoPorResultado) {
      setShowAlert({ show: true, message: 'Todos os campos são obrigatórios!', variant: 'danger' });
      return;
    }

    if (editingCity) {
      // Editar cidade existente
      setCities(prev => prev.map(city => 
        city.id === editingCity.id 
          ? { ...city, ...formData }
          : city
      ));
      setShowAlert({ show: true, message: 'Cidade atualizada com sucesso!', variant: 'success' });
    } else {
      // Adicionar nova cidade
      const newCity = {
        id: Date.now(),
        ...formData
      };
      setCities(prev => [...prev, newCity]);
      setShowAlert({ show: true, message: 'Cidade adicionada com sucesso!', variant: 'success' });
    }

    handleCloseModal();
  };

  const handleEdit = (city) => {
    setEditingCity(city);
    setFormData({
      name: city.name,
      valorInvestido: city.valorInvestido,
      conversas: city.conversas,
      custoPorResultado: city.custoPorResultado || '',
      image: city.image || null
    });
    setShowModal(true);
  };

  const handleDelete = (cityId) => {
    if (window.confirm('Tem certeza que deseja remover esta cidade?')) {
      setCities(prev => prev.filter(city => city.id !== cityId));
      setShowAlert({ show: true, message: 'Cidade removida com sucesso!', variant: 'success' });
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCity(null);
    setFormData({ name: '', valorInvestido: '', conversas: '', custoPorResultado: '', image: null });
  };

  const handleAddNew = () => {
    setEditingCity(null);
    setFormData({ name: '', valorInvestido: '', conversas: '', custoPorResultado: '', image: null });
    setShowModal(true);
  };

  return (
    <div className="container-fluid">
      <style>
        {`
          .conversas-royal-blue {
            color: #4169E1 !important;
          }
          .custo-por-resultado-azul {
            color: #1c84ee !important;
          }
        `}
      </style>
      {showAlert.show && (
        <Alert 
          variant={showAlert.variant} 
          onClose={() => setShowAlert({ show: false, message: '', variant: 'success' })} 
          dismissible
          className="mb-4"
        >
          {showAlert.message}
        </Alert>
      )}

      <Row>
        <Col lg={12}>
          <ComponentContainerCard
            title="Gerenciar Cidades"
            description="Gerencie as cidades e suas métricas. Os dados serão refletidos na tabela 'Resultado por Cidades' do Dashboard."
          >
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h5 className="mb-1">Lista de Cidades</h5>
                <p className="text-muted mb-0">Adicione, edite ou remova cidades e suas métricas</p>
              </div>
              <div className="d-flex gap-2">
                <Button variant="outline-warning" onClick={clearCacheAndReset}>
                  <IconifyIcon icon="bx:refresh" className="me-1" />
                  Limpar Cache
                </Button>
                <Button variant="outline-info" onClick={() => window.dispatchEvent(new CustomEvent('citiesUpdated', { detail: { cities } }))}>
                  <IconifyIcon icon="bx:sync" className="me-1" />
                  Atualizar Dashboard
                </Button>
                <Button variant="primary" onClick={handleAddNew}>
                  <IconifyIcon icon="bx:plus" className="me-1" />
                  Adicionar Cidade
                </Button>
              </div>
            </div>

              <div className="table-responsive">
                <Table hover className="table-nowrap">
                  <thead className="bg-light bg-opacity-50">
                    <tr>
                      <th>Cidade</th>
                      <th>Valor Investido</th>
                      <th>Conversas</th>
                      <th>Custo por Resultado</th>
                      <th className="text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cities.map((city) => (
                      <tr key={city.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            {city.image ? (
                              <img 
                                src={city.image} 
                                alt={city.name}
                                style={{ 
                                  width: '32px', 
                                  height: '32px', 
                                  objectFit: 'cover',
                                  borderRadius: '50%',
                                  marginRight: '8px'
                                }} 
                              />
                            ) : (
                              <IconifyIcon icon="bx:map" className="text-primary me-2" />
                            )}
                            <span className="fw-medium">{city.name}</span>
                          </div>
                        </td>
                        <td>
                          <span className="text-success fw-medium">R$ {city.valorInvestido}</span>
                        </td>
                        <td>
                          <span className="fw-medium conversas-royal-blue">
                            {city.conversas}
                          </span>
                        </td>
                        <td>
                          <span className="custo-por-resultado-azul fw-medium">
                            R$ {city.custoPorResultado || '0,00'}
                          </span>
                        </td>
                        <td className="text-center">
                          <div className="d-flex gap-2 justify-content-center">
                            <Button
                              variant="soft-primary"
                              size="sm"
                              onClick={() => handleEdit(city)}
                            >
                              <IconifyIcon icon="bx:edit" />
                            </Button>
                            <Button
                              variant="soft-danger"
                              size="sm"
                              onClick={() => handleDelete(city.id)}
                            >
                              <IconifyIcon icon="bx:trash" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

            {cities.length === 0 && (
              <div className="text-center py-4">
                <IconifyIcon icon="bx:map" className="text-muted" style={{ fontSize: '48px' }} />
                <p className="text-muted mt-2">Nenhuma cidade cadastrada</p>
              </div>
            )}
          </ComponentContainerCard>
        </Col>
      </Row>

      {/* Modal para Adicionar/Editar Cidade */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingCity ? 'Editar Cidade' : 'Adicionar Nova Cidade'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nome da Cidade</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Ex: TEÓFILO OTONI - MG"
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Valor Investido</Form.Label>
              <Form.Control
                type="text"
                name="valorInvestido"
                value={formData.valorInvestido}
                onChange={handleInputChange}
                placeholder="Ex: 15,000"
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Quantidade de Conversas</Form.Label>
              <Form.Control
                type="text"
                name="conversas"
                value={formData.conversas}
                onChange={handleInputChange}
                placeholder="Ex: 1,250"
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Custo por Resultado</Form.Label>
              <Form.Control
                type="text"
                name="custoPorResultado"
                value={formData.custoPorResultado}
                onChange={handleInputChange}
                placeholder="Ex: 12,00"
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Imagem da Cidade</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mb-2"
              />
              {formData.image && (
                <div className="mt-2">
                  <img 
                    src={formData.image} 
                    alt="Preview" 
                    style={{ 
                      width: '80px', 
                      height: '80px', 
                      objectFit: 'cover',
                      borderRadius: '50%',
                      border: '1px solid #dee2e6'
                    }} 
                  />
                  <p className="text-muted small mt-1">Preview da imagem</p>
                </div>
              )}
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              {editingCity ? 'Atualizar' : 'Adicionar'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default CitiesPage;
