import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardTitle, Col, Row, Form, Button, Table, Modal, Alert } from 'react-bootstrap';
import ComponentContainerCard from '@/components/ComponentContainerCard';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { useAuthContext } from '@/context/useAuthContext';

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
  const [imagePreview, setImagePreview] = useState(null);
  const [showAlert, setShowAlert] = useState({ show: false, message: '', variant: 'success' });

  // Carregar cidades do localStorage
  const loadCities = () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const userCitiesKey = `cities-${user.id}`;
      const savedCities = localStorage.getItem(userCitiesKey);
      if (savedCities) {
        setCities(JSON.parse(savedCities));
      } else {
        // Dados padrão para novos usuários
        const defaultCities = [
          { id: 1, name: 'TEÓFILO OTONI - MG', valor_investido: '15,000', conversas: '1,250', custo_por_resultado: '12,00', image: null },
          { id: 2, name: 'ÁGUAS FORMOSAS - MG', valor_investido: '12,500', conversas: '980', custo_por_resultado: '12,76', image: null },
          { id: 3, name: 'ALMENARA - MG', valor_investido: '18,200', conversas: '1,450', custo_por_resultado: '12,55', image: null }
        ];
        setCities(defaultCities);
        localStorage.setItem(userCitiesKey, JSON.stringify(defaultCities));
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

  // Função para lidar com upload de imagem
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target.result;
        setFormData({ ...formData, image: imageData });
        setImagePreview(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  // Função para remover imagem
  const removeImage = () => {
    setFormData({ ...formData, image: null });
    setImagePreview(null);
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
      setImagePreview(city.image || null);
    } else {
      setEditingCity(null);
      setFormData({
        name: '',
        valorInvestido: '',
        conversas: '',
        custoPorResultado: '',
        image: null
      });
      setImagePreview(null);
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
    setImagePreview(null);
  };

  // Função para salvar cidade
  const saveCity = () => {
    if (!user) return;

    if (!formData.name.trim()) {
      showAlertMessage('Nome da cidade é obrigatório', 'danger');
      return;
    }

    try {
      const userCitiesKey = `cities-${user.id}`;
      let updatedCities;

      if (editingCity) {
        // Atualizar cidade existente
        updatedCities = cities.map(city => 
          city.id === editingCity.id 
            ? {
                ...city,
                name: formData.name,
                valor_investido: formData.valorInvestido,
                conversas: formData.conversas,
                custo_por_resultado: formData.custoPorResultado,
                image: formData.image
              }
            : city
        );
      } else {
        // Adicionar nova cidade
        const newCity = {
          id: Date.now(),
          name: formData.name,
          valor_investido: formData.valorInvestido,
          conversas: formData.conversas,
          custo_por_resultado: formData.custoPorResultado,
          image: formData.image
        };
        updatedCities = [...cities, newCity];
      }

      setCities(updatedCities);
      localStorage.setItem(userCitiesKey, JSON.stringify(updatedCities));
      showAlertMessage(editingCity ? 'Cidade atualizada com sucesso!' : 'Cidade adicionada com sucesso!');
      closeModal();
    } catch (error) {
      showAlertMessage('Erro ao salvar cidade', 'danger');
    }
  };

  // Função para deletar cidade
  const deleteCity = (cityId) => {
    if (!user) return;

    if (window.confirm('Tem certeza que deseja deletar esta cidade?')) {
      try {
        const userCitiesKey = `cities-${user.id}`;
        const updatedCities = cities.filter(city => city.id !== cityId);
        setCities(updatedCities);
        localStorage.setItem(userCitiesKey, JSON.stringify(updatedCities));
        showAlertMessage('Cidade deletada com sucesso!');
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
                      <th>Imagem</th>
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
                        <td>
                          {city.image ? (
                            <img 
                              src={city.image} 
                              alt={city.name}
                              className="rounded-circle"
                              style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                            />
                          ) : (
                            <div 
                              className="rounded-circle bg-light d-flex align-items-center justify-content-center"
                              style={{ width: '40px', height: '40px' }}
                            >
                              <IconifyIcon icon="bx:image" className="text-muted" />
                            </div>
                          )}
                        </td>
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
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Imagem da Cidade</Form.Label>
                  <div className="d-flex align-items-center gap-3">
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="form-control-sm"
                    />
                    {imagePreview && (
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={removeImage}
                      >
                        <IconifyIcon icon="bx:trash" />
                      </Button>
                    )}
                  </div>
                  {imagePreview && (
                    <div className="mt-2">
                      <img 
                        src={imagePreview} 
                        alt="Preview"
                        className="rounded-circle"
                        style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                      />
                    </div>
                  )}
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