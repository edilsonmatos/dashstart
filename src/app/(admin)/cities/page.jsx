import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardTitle, Col, Row, Form, Button, Table, Modal, Alert } from 'react-bootstrap';
import ComponentContainerCard from '@/components/ComponentContainerCard';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { useAuthContext } from '@/context/useAuthContext';
import citiesService from '@/services/citiesService';

const CitiesPage = () => {
  const { user } = useAuthContext();
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
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

  // Carregar cidades do banco de dados
  const loadCities = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const result = await citiesService.getCitiesByUser(user.id);
      if (result.success) {
        setCities(result.cities);
      } else {
        setShowAlert({ show: true, message: result.error, variant: 'danger' });
      }
    } catch (error) {
      setShowAlert({ show: true, message: 'Erro ao carregar cidades', variant: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCities();
  }, [user]);

  // Função para mostrar alerta
  const showAlertMessage = (message, variant = 'success') => {
    setShowAlert({ show: true, message, variant });
    setTimeout(() => setShowAlert({ show: false, message: '', variant: 'success' }), 5000);
  };

  // Função para abrir modal de adicionar/editar
  const openModal = (city = null) => {
    if (city) {
      setEditingCity(city);
      setFormData({
        name: city.name,
        valorInvestido: city.valor_investido || '',
        conversas: city.conversas || '',
        custoPorResultado: city.custo_por_resultado || '',
        image: city.image || null
      });
    } else {
      setEditingCity(null);
      setFormData({
        name: '',
        valorInvestido: '',
        conversas: '',
        custoPorResultado: '',
        image: null
      });
    }
    setShowModal(true);
  };

  // Função para fechar modal
  const closeModal = () => {
    setShowModal(false);
    setEditingCity(null);
    setFormData({
      name: '',
      valorInvestido: '',
      conversas: '',
      custoPorResultado: '',
      image: null
    });
  };

  // Função para salvar cidade
  const saveCity = async () => {
    if (!user) return;

    if (!formData.name.trim()) {
      showAlertMessage('Nome da cidade é obrigatório', 'danger');
      return;
    }

    try {
      let result;
      if (editingCity) {
        // Atualizar cidade existente
        result = await citiesService.updateCity(editingCity.id, user.id, formData);
      } else {
        // Adicionar nova cidade
        result = await citiesService.addCity(user.id, formData);
      }

      if (result.success) {
        showAlertMessage(editingCity ? 'Cidade atualizada com sucesso!' : 'Cidade adicionada com sucesso!');
        closeModal();
        loadCities(); // Recarregar lista
      } else {
        showAlertMessage(result.error, 'danger');
      }
    } catch (error) {
      showAlertMessage('Erro ao salvar cidade', 'danger');
    }
  };

  // Função para deletar cidade
  const deleteCity = async (cityId) => {
    if (!user) return;

    if (window.confirm('Tem certeza que deseja deletar esta cidade?')) {
      try {
        const result = await citiesService.deleteCity(cityId, user.id);
        if (result.success) {
          showAlertMessage('Cidade deletada com sucesso!');
          loadCities(); // Recarregar lista
        } else {
          showAlertMessage(result.error, 'danger');
        }
      } catch (error) {
        showAlertMessage('Erro ao deletar cidade', 'danger');
      }
    }
  };

  if (!user) {
    return (
      <ComponentContainerCard title="Cidades">
        <Alert variant="warning">
          <IconifyIcon icon="bx:error" className="me-2" />
          Você precisa estar logado para acessar esta página.
        </Alert>
      </ComponentContainerCard>
    );
  }

  return (
    <ComponentContainerCard title="Gerenciar Cidades">
      {showAlert.show && (
        <Alert variant={showAlert.variant} className="mb-3">
          <IconifyIcon icon={showAlert.variant === 'success' ? 'bx:check-circle' : 'bx:error'} className="me-2" />
          {showAlert.message}
        </Alert>
      )}

      <Row>
        <Col>
          <Card>
            <CardBody>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <CardTitle as="h5">Lista de Cidades</CardTitle>
                <Button variant="primary" onClick={() => openModal()}>
                  <IconifyIcon icon="bx:plus" className="me-1" />
                  Adicionar Cidade
                </Button>
              </div>

              {loading ? (
                <div className="text-center py-4">
                  <IconifyIcon icon="bx:loader-alt" className="fs-48" spin />
                  <p className="mt-2">Carregando cidades...</p>
                </div>
              ) : cities.length === 0 ? (
                <div className="text-center py-4">
                  <IconifyIcon icon="bx:map" className="fs-48 text-muted" />
                  <p className="mt-2 text-muted">Nenhuma cidade cadastrada ainda.</p>
                  <Button variant="primary" onClick={() => openModal()}>
                    <IconifyIcon icon="bx:plus" className="me-1" />
                    Adicionar Primeira Cidade
                  </Button>
                </div>
              ) : (
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Valor Investido</th>
                      <th>Conversas</th>
                      <th>Custo por Resultado</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cities.map((city) => (
                      <tr key={city.id}>
                        <td>{city.name}</td>
                        <td>{city.valor_investido}</td>
                        <td>{city.conversas}</td>
                        <td>{city.custo_por_resultado}</td>
                        <td>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="me-2"
                            onClick={() => openModal(city)}
                          >
                            <IconifyIcon icon="bx:edit" />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => deleteCity(city.id)}
                          >
                            <IconifyIcon icon="bx:trash" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Modal para adicionar/editar cidade */}
      <Modal show={showModal} onHide={closeModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingCity ? 'Editar Cidade' : 'Adicionar Nova Cidade'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nome da Cidade</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: TEÓFILO OTONI - MG"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Valor Investido</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.valorInvestido}
                    onChange={(e) => setFormData({ ...formData, valorInvestido: e.target.value })}
                    placeholder="Ex: 15,000"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Conversas</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.conversas}
                    onChange={(e) => setFormData({ ...formData, conversas: e.target.value })}
                    placeholder="Ex: 1,250"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Custo por Resultado</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.custoPorResultado}
                    onChange={(e) => setFormData({ ...formData, custoPorResultado: e.target.value })}
                    placeholder="Ex: 12,00"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={saveCity}>
            {editingCity ? 'Atualizar' : 'Adicionar'}
          </Button>
        </Modal.Footer>
      </Modal>
    </ComponentContainerCard>
  );
};

export default CitiesPage;