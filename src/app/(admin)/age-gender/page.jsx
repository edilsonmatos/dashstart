import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, CardHeader, CardTitle, CardBody, Button, Form, Table, Alert, Modal } from 'react-bootstrap';
import ComponentContainerCard from '@/components/ComponentContainerCard';

const AgeGenderPage = () => {
  const [ageGenderData, setAgeGenderData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    cityId: '',
    cityName: '',
    ageGroups: {
      '18-24': 0,
      '25-34': 0,
      '35-44': 0,
      '45-54': 0,
      '55-64': 0,
      '65+': 0
    },
    gender: {
      men: 0,
      women: 0
    }
  });
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });

  // Carregar dados do localStorage
  useEffect(() => {
    const loadData = () => {
      const savedData = localStorage.getItem('age-gender-data');
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          // Migrar dados antigos para nova estrutura (manter 45-54, combinar 65-74 e 75+)
          const migratedData = parsedData.map(item => {
            const newAgeGroups = {
              '18-24': item.ageGroups['18-24'] || 0,
              '25-34': item.ageGroups['25-34'] || 0,
              '35-44': item.ageGroups['35-44'] || 0,
              '45-54': item.ageGroups['45-54'] || 0,
              '55-64': item.ageGroups['55-64'] || 0,
              '65+': (item.ageGroups['65-74'] || 0) + (item.ageGroups['75+'] || 0) // Combinar 65-74 e 75+
            };
            return {
              ...item,
              ageGroups: newAgeGroups
            };
          });
          setAgeGenderData(migratedData);
          // Salvar dados migrados
          localStorage.setItem('age-gender-data', JSON.stringify(migratedData));
        } catch (error) {
          console.error('Erro ao carregar dados de idade/gênero:', error);
          setAgeGenderData([]);
        }
      } else {
        // Dados padrão
        const defaultData = [
          {
            id: 1,
            cityId: 1,
            cityName: 'TEÓFILO OTONI - MG',
            ageGroups: { '18-24': 200, '25-34': 350, '35-44': 280, '45-54': 180, '55-64': 120, '65+': 120 },
            gender: { men: 650, women: 600 }
          },
          {
            id: 2,
            cityId: 2,
            cityName: 'ÁGUAS FORMOSAS - MG',
            ageGroups: { '18-24': 150, '25-34': 280, '35-44': 220, '45-54': 140, '55-64': 90, '65+': 90 },
            gender: { men: 520, women: 460 }
          },
          {
            id: 3,
            cityId: 3,
            cityName: 'ALMENARA - MG',
            ageGroups: { '18-24': 180, '25-34': 320, '35-44': 250, '45-54': 160, '55-64': 110, '65+': 105 },
            gender: { men: 600, women: 525 }
          },
          {
            id: 4,
            cityId: 4,
            cityName: 'CAPELINHA - MG',
            ageGroups: { '18-24': 120, '25-34': 200, '35-44': 160, '45-54': 100, '55-64': 70, '65+': 70 },
            gender: { men: 380, women: 340 }
          },
          {
            id: 5,
            cityId: 5,
            cityName: 'NANUQUE - MG',
            ageGroups: { '18-24': 160, '25-34': 290, '35-44': 230, '45-54': 150, '55-64': 100, '65+': 97 },
            gender: { men: 550, women: 477 }
          },
          {
            id: 6,
            cityId: 6,
            cityName: 'PINHEIROS - ES',
            ageGroups: { '18-24': 140, '25-34': 250, '35-44': 200, '45-54': 130, '55-64': 85, '65+': 83 },
            gender: { men: 480, women: 408 }
          },
          {
            id: 7,
            cityId: 7,
            cityName: 'SÃO MATEUS - ES',
            ageGroups: { '18-24': 170, '25-34': 310, '35-44': 240, '45-54': 155, '55-64': 105, '65+': 102 },
            gender: { men: 580, women: 502 }
          }
        ];
        setAgeGenderData(defaultData);
        localStorage.setItem('age-gender-data', JSON.stringify(defaultData));
      }
    };

    loadData();
  }, []);

  const handleAddNew = () => {
    setFormData({
      cityId: '',
      cityName: '',
      ageGroups: {
        '18-24': 0,
        '25-34': 0,
        '35-44': 0,
        '45-54': 0,
        '55-64': 0,
        '65+': 0
      },
      gender: {
        men: 0,
        women: 0
      }
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
      cityId: '',
      cityName: '',
      ageGroups: {
        '18-24': 0,
        '25-34': 0,
        '35-44': 0,
        '45-54': 0,
        '55-64': 0,
        '65+': 0
      },
      gender: {
        men: 0,
        women: 0
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.cityName.trim()) {
      setAlert({ show: true, message: 'Nome da cidade é obrigatório!', variant: 'danger' });
      return;
    }

    const newData = editingItem 
      ? ageGenderData.map(item => item.id === editingItem.id ? { ...formData, id: editingItem.id } : item)
      : [...ageGenderData, { ...formData, id: Date.now() }];

    setAgeGenderData(newData);
    localStorage.setItem('age-gender-data', JSON.stringify(newData));
    
    // Disparar evento para atualizar dashboard
    window.dispatchEvent(new CustomEvent('ageGenderUpdated'));
    
    setAlert({ show: true, message: editingItem ? 'Dados atualizados com sucesso!' : 'Dados adicionados com sucesso!', variant: 'success' });
    handleCloseModal();
  };

  const handleDelete = (id) => {
    const newData = ageGenderData.filter(item => item.id !== id);
    setAgeGenderData(newData);
    localStorage.setItem('age-gender-data', JSON.stringify(newData));
    
    // Disparar evento para atualizar dashboard
    window.dispatchEvent(new CustomEvent('ageGenderUpdated'));
    
    setAlert({ show: true, message: 'Dados removidos com sucesso!', variant: 'success' });
  };

  const clearCacheAndReset = () => {
    localStorage.removeItem('age-gender-data');
    window.location.reload();
  };

  const migrateData = () => {
    const savedData = localStorage.getItem('age-gender-data');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        // Verificar se precisa migrar (se ainda tem faixas antigas)
        const needsMigration = parsedData.some(item => 
          item.ageGroups['65-74'] !== undefined || 
          item.ageGroups['75+'] !== undefined
        );
        
        if (needsMigration) {
          const migratedData = parsedData.map(item => {
            const newAgeGroups = {
              '18-24': item.ageGroups['18-24'] || 0,
              '25-34': item.ageGroups['25-34'] || 0,
              '35-44': item.ageGroups['35-44'] || 0,
              '45-54': item.ageGroups['45-54'] || 0,
              '55-64': item.ageGroups['55-64'] || 0,
              '65+': (item.ageGroups['65-74'] || 0) + (item.ageGroups['75+'] || 0)
            };
            return {
              ...item,
              ageGroups: newAgeGroups
            };
          });
          setAgeGenderData(migratedData);
          localStorage.setItem('age-gender-data', JSON.stringify(migratedData));
          setAlert({ show: true, message: 'Dados migrados com sucesso para as novas faixas etárias!', variant: 'success' });
        } else {
          setAlert({ show: true, message: 'Dados já estão na estrutura atual!', variant: 'info' });
        }
      } catch (error) {
        setAlert({ show: true, message: 'Erro ao migrar dados!', variant: 'danger' });
      }
    } else {
      setAlert({ show: true, message: 'Nenhum dado encontrado para migrar!', variant: 'warning' });
    }
  };

  const updateDashboard = () => {
    window.dispatchEvent(new CustomEvent('ageGenderUpdated'));
    setAlert({ show: true, message: 'Dashboard atualizado!', variant: 'info' });
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Row>
          <Col>
            <ComponentContainerCard title="Gerenciar Dados de Idade/Gênero" subtitle="Cadastre as conversas por idade e gênero para cada cidade">
              <CardBody>
                {alert.show && (
                  <Alert variant={alert.variant} onClose={() => setAlert({ ...alert, show: false })} dismissible>
                    {alert.message}
                  </Alert>
                )}

                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <Button variant="primary" onClick={handleAddNew}>
                      Adicionar Nova Cidade
                    </Button>
                  </div>
                  <div>
                    <Button variant="outline-warning" onClick={migrateData} className="me-2">
                      Migrar Dados
                    </Button>
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
                        <th>Cidade</th>
                        <th>18-24</th>
                        <th>25-34</th>
                        <th>35-44</th>
                        <th>45-54</th>
                        <th>55-64</th>
                        <th>65+</th>
                        <th>Homens</th>
                        <th>Mulheres</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ageGenderData.map((item) => (
                        <tr key={item.id}>
                          <td>{item.cityName}</td>
                          <td>{item.ageGroups['18-24']}</td>
                          <td>{item.ageGroups['25-34']}</td>
                          <td>{item.ageGroups['35-44']}</td>
                          <td>{item.ageGroups['45-54']}</td>
                          <td>{item.ageGroups['55-64']}</td>
                          <td>{item.ageGroups['65+']}</td>
                          <td className="text-primary">{item.gender.men}</td>
                          <td className="text-warning">{item.gender.women}</td>
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
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingItem ? 'Editar Dados' : 'Adicionar Nova Cidade'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nome da Cidade</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.cityName}
                    onChange={(e) => setFormData({ ...formData, cityName: e.target.value })}
                    placeholder="Digite o nome da cidade"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>ID da Cidade</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.cityId}
                    onChange={(e) => setFormData({ ...formData, cityId: e.target.value })}
                    placeholder="ID da cidade"
                  />
                </Form.Group>
              </Col>
            </Row>

            <h6>Conversas por Idade</h6>
            <Row>
              {Object.keys(formData.ageGroups).map((ageGroup) => (
                <Col md={4} key={ageGroup}>
                  <Form.Group className="mb-3">
                    <Form.Label>{ageGroup} anos</Form.Label>
                    <Form.Control
                      type="number"
                      min="0"
                      value={formData.ageGroups[ageGroup]}
                      onChange={(e) => setFormData({
                        ...formData,
                        ageGroups: {
                          ...formData.ageGroups,
                          [ageGroup]: parseInt(e.target.value) || 0
                        }
                      })}
                    />
                  </Form.Group>
                </Col>
              ))}
            </Row>

            <h6>Conversas por Gênero</h6>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Homens</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    value={formData.gender.men}
                    onChange={(e) => setFormData({
                      ...formData,
                      gender: {
                        ...formData.gender,
                        men: parseInt(e.target.value) || 0
                      }
                    })}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Mulheres</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    value={formData.gender.women}
                    onChange={(e) => setFormData({
                      ...formData,
                      gender: {
                        ...formData.gender,
                        women: parseInt(e.target.value) || 0
                      }
                    })}
                  />
                </Form.Group>
              </Col>
            </Row>
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

export default AgeGenderPage;
