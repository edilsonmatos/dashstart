import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, CardHeader, CardTitle, CardBody, Button, Form, Table, Alert, Modal } from 'react-bootstrap';
import ComponentContainerCard from '@/components/ComponentContainerCard';

const MonthPage = () => {
  const [monthData, setMonthData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    month: '',
    year: new Date().getFullYear(),
    totalConversations: 0
  });
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });

  // Carregar dados do localStorage
  useEffect(() => {
    const loadData = () => {
      const savedData = localStorage.getItem('month-data');
      if (savedData) {
        try {
          setMonthData(JSON.parse(savedData));
        } catch (error) {
          console.error('Erro ao carregar dados mensais:', error);
          setMonthData([]);
        }
      } else {
        // Dados padrão para os últimos 12 meses
        const currentDate = new Date();
        const defaultData = [];
        
        for (let i = 11; i >= 0; i--) {
          const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
          const monthNames = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
          ];
          
          defaultData.push({
            id: i + 1,
            month: monthNames[date.getMonth()],
            year: date.getFullYear(),
            totalConversations: Math.floor(Math.random() * 2000) + 1000 // Valores aleatórios entre 1000-3000
          });
        }
        
        setMonthData(defaultData);
        localStorage.setItem('month-data', JSON.stringify(defaultData));
      }
    };

    loadData();
  }, []);

  const handleAddNew = () => {
    setFormData({
      month: '',
      year: new Date().getFullYear(),
      totalConversations: 0
    });
    setEditingItem(null);
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setFormData(item);
    setEditingItem(item);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormData({
      month: '',
      year: new Date().getFullYear(),
      totalConversations: 0
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.month.trim()) {
      setAlert({ show: true, message: 'Mês é obrigatório!', variant: 'danger' });
      return;
    }

    if (!formData.year || formData.year < 2020 || formData.year > 2030) {
      setAlert({ show: true, message: 'Ano deve estar entre 2020 e 2030!', variant: 'danger' });
      return;
    }

    if (formData.totalConversations < 0) {
      setAlert({ show: true, message: 'Total de conversas deve ser maior ou igual a 0!', variant: 'danger' });
      return;
    }

    const newData = editingItem 
      ? monthData.map(item => item.id === editingItem.id ? { ...formData, id: editingItem.id } : item)
      : [...monthData, { ...formData, id: Date.now() }];

    setMonthData(newData);
    localStorage.setItem('month-data', JSON.stringify(newData));
    
    // Disparar evento para atualizar dashboard
    window.dispatchEvent(new CustomEvent('monthDataUpdated'));
    
    setAlert({ show: true, message: editingItem ? 'Dados atualizados com sucesso!' : 'Dados adicionados com sucesso!', variant: 'success' });
    handleCloseModal();
  };

  const handleDelete = (id) => {
    const newData = monthData.filter(item => item.id !== id);
    setMonthData(newData);
    localStorage.setItem('month-data', JSON.stringify(newData));
    
    // Disparar evento para atualizar dashboard
    window.dispatchEvent(new CustomEvent('monthDataUpdated'));
    
    setAlert({ show: true, message: 'Dados removidos com sucesso!', variant: 'success' });
  };

  const clearCacheAndReset = () => {
    localStorage.removeItem('month-data');
    window.location.reload();
  };

  const updateDashboard = () => {
    window.dispatchEvent(new CustomEvent('monthDataUpdated'));
    setAlert({ show: true, message: 'Dashboard atualizado!', variant: 'info' });
  };

  const monthOptions = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  return (
    <div className="page-content">
      <Container fluid>
        <Row>
          <Col>
            <ComponentContainerCard title="Gerenciar Dados Mensais" subtitle="Cadastre o total de conversas por mês">
              <CardBody>
                {alert.show && (
                  <Alert variant={alert.variant} onClose={() => setAlert({ ...alert, show: false })} dismissible>
                    {alert.message}
                  </Alert>
                )}

                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <Button variant="primary" onClick={handleAddNew}>
                      Adicionar Novo Mês
                    </Button>
                  </div>
                  <div>
                    <Button variant="outline-secondary" onClick={clearCacheAndReset} className="me-2">
                      Limpar Cache
                    </Button>
                    <Button variant="outline-info" onClick={updateDashboard}>
                      Atualizar Dashboard
                    </Button>
                  </div>
                </div>

                <div className="table-responsive">
                  <Table striped hover>
                    <thead>
                      <tr>
                        <th>Mês</th>
                        <th>Ano</th>
                        <th>Total de Conversas</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {monthData.map((item) => (
                        <tr key={item.id}>
                          <td>{item.month}</td>
                          <td>{item.year}</td>
                          <td className="text-primary fw-bold">{item.totalConversations.toLocaleString()}</td>
                          <td>
                            <Button variant="outline-primary" size="sm" onClick={() => handleEdit(item)} className="me-1">
                              Editar
                            </Button>
                            <Button variant="outline-danger" size="sm" onClick={() => handleDelete(item.id)}>
                              Excluir
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </CardBody>
            </ComponentContainerCard>
          </Col>
        </Row>
      </Container>

      {/* Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editingItem ? 'Editar Dados' : 'Adicionar Novo Mês'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Mês</Form.Label>
                  <Form.Select
                    value={formData.month}
                    onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                    required
                  >
                    <option value="">Selecione o mês</option>
                    {monthOptions.map((month) => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Ano</Form.Label>
                  <Form.Control
                    type="number"
                    min="2020"
                    max="2030"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Total de Conversas</Form.Label>
              <Form.Control
                type="number"
                min="0"
                value={formData.totalConversations}
                onChange={(e) => setFormData({ ...formData, totalConversations: parseInt(e.target.value) || 0 })}
                placeholder="Digite o total de conversas"
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              {editingItem ? 'Atualizar' : 'Adicionar'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default MonthPage;


