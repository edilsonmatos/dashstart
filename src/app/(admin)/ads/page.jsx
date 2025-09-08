import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, CardHeader, CardTitle, CardBody, Button, Form, Table, Alert, Modal } from 'react-bootstrap';
import ComponentContainerCard from '@/components/ComponentContainerCard';

const AdsPage = () => {
  const [adsData, setAdsData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    cityId: '',
    cityName: '',
    preview: '',
    previewFile: null,
    alcance: '',
    conversasIniciadas: 0
  });
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });

  // Carregar dados do localStorage
  useEffect(() => {
    const loadData = () => {
      const savedData = localStorage.getItem('ads-data');
      if (savedData) {
        try {
          setAdsData(JSON.parse(savedData));
        } catch (error) {
          console.error('Erro ao carregar dados de anúncios:', error);
          setAdsData([]);
        }
      } else {
        // Dados padrão baseados nas cidades existentes
        const defaultData = [
          {
            id: 1,
            cityId: 1,
            cityName: 'TEÓFILO OTONI - MG',
            preview: 'https://via.placeholder.com/100x100/007bff/ffffff?text=Anúncio+1',
            previewFile: null,
            alcance: 'Campanha Facebook - Produto A',
            conversasIniciadas: 45
          },
          {
            id: 2,
            cityId: 2,
            cityName: 'ÁGUAS FORMOSAS - MG',
            preview: 'https://via.placeholder.com/100x100/28a745/ffffff?text=Anúncio+2',
            previewFile: null,
            alcance: 'Campanha Instagram - Produto B',
            conversasIniciadas: 32
          },
          {
            id: 3,
            cityId: 3,
            cityName: 'ALMENARA - MG',
            preview: 'https://via.placeholder.com/100x100/dc3545/ffffff?text=Anúncio+3',
            previewFile: null,
            alcance: 'Campanha Google - Produto C',
            conversasIniciadas: 28
          },
          {
            id: 4,
            cityId: 4,
            cityName: 'CAPELINHA - MG',
            preview: 'https://via.placeholder.com/100x100/ffc107/000000?text=Anúncio+4',
            previewFile: null,
            alcance: 'Campanha Facebook - Produto D',
            conversasIniciadas: 19
          },
          {
            id: 5,
            cityId: 5,
            cityName: 'NANUQUE - MG',
            preview: 'https://via.placeholder.com/100x100/6f42c1/ffffff?text=Anúncio+5',
            previewFile: null,
            alcance: 'Campanha Instagram - Produto E',
            conversasIniciadas: 37
          },
          {
            id: 6,
            cityId: 6,
            cityName: 'PINHEIROS - ES',
            preview: 'https://via.placeholder.com/100x100/20c997/ffffff?text=Anúncio+6',
            previewFile: null,
            alcance: 'Campanha Google - Produto F',
            conversasIniciadas: 24
          },
          {
            id: 7,
            cityId: 7,
            cityName: 'SÃO MATEUS - ES',
            preview: 'https://via.placeholder.com/100x100/fd7e14/ffffff?text=Anúncio+7',
            previewFile: null,
            alcance: 'Campanha Facebook - Produto G',
            conversasIniciadas: 41
          }
        ];
        
        setAdsData(defaultData);
        localStorage.setItem('ads-data', JSON.stringify(defaultData));
      }
    };

    loadData();
  }, []);

  const handleAddNew = () => {
    setFormData({
      cityId: '',
      cityName: '',
      preview: '',
      previewFile: null,
      alcance: '',
      conversasIniciadas: 0
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
      preview: '',
      previewFile: null,
      alcance: '',
      conversasIniciadas: 0
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.cityName.trim()) {
      setAlert({ show: true, message: 'Nome da cidade é obrigatório!', variant: 'danger' });
      return;
    }

    if (!formData.previewFile && !formData.preview) {
      setAlert({ show: true, message: 'Imagem da prévia é obrigatória!', variant: 'danger' });
      return;
    }

    if (!formData.alcance.trim()) {
      setAlert({ show: true, message: 'Alcance é obrigatório!', variant: 'danger' });
      return;
    }

    if (formData.conversasIniciadas < 0) {
      setAlert({ show: true, message: 'Conversas iniciadas deve ser maior ou igual a 0!', variant: 'danger' });
      return;
    }

    const newData = editingItem 
      ? adsData.map(item => item.id === editingItem.id ? { ...formData, id: editingItem.id } : item)
      : [...adsData, { ...formData, id: Date.now() }];

    setAdsData(newData);
    localStorage.setItem('ads-data', JSON.stringify(newData));
    
    // Disparar evento para atualizar dashboard
    window.dispatchEvent(new CustomEvent('adsDataUpdated'));
    
    setAlert({ show: true, message: editingItem ? 'Dados atualizados com sucesso!' : 'Dados adicionados com sucesso!', variant: 'success' });
    handleCloseModal();
  };

  const handleDelete = (id) => {
    const newData = adsData.filter(item => item.id !== id);
    setAdsData(newData);
    localStorage.setItem('ads-data', JSON.stringify(newData));
    
    // Disparar evento para atualizar dashboard
    window.dispatchEvent(new CustomEvent('adsDataUpdated'));
    
    setAlert({ show: true, message: 'Dados removidos com sucesso!', variant: 'success' });
  };

  const clearCacheAndReset = () => {
    localStorage.removeItem('ads-data');
    window.location.reload();
  };

  const updateDashboard = () => {
    window.dispatchEvent(new CustomEvent('adsDataUpdated'));
    setAlert({ show: true, message: 'Dashboard atualizado!', variant: 'info' });
  };


  return (
    <div className="page-content">
      <Container fluid>
        <Row>
          <Col>
            <ComponentContainerCard title="Gerenciar Anúncios" subtitle="Cadastre anúncios por cidade">
              <CardBody>
                {alert.show && (
                  <Alert variant={alert.variant} onClose={() => setAlert({ ...alert, show: false })} dismissible>
                    {alert.message}
                  </Alert>
                )}

                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <Button variant="primary" onClick={handleAddNew}>
                      Adicionar Novo Anúncio
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
                  <style>
                    {`
                      .alcance-azul {
                        color: #1c84ee !important;
                      }
                      .conversas-amarelo {
                        color: #fed03d !important;
                      }
                    `}
                  </style>
                  <Table striped hover>
                    <thead>
                      <tr>
                        <th>Cidade</th>
                        <th>Prévia</th>
                        <th>Alcance</th>
                        <th>Conversas Iniciadas</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adsData.map((item) => (
                        <tr key={item.id}>
                          <td>{item.cityName}</td>
                          <td>
                            <img 
                              src={item.preview} 
                              alt="Preview" 
                              className="img-fluid" 
                              style={{ width: '100px', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
                            />
                          </td>
                          <td>
                            <span className="alcance-azul">{item.alcance}</span>
                          </td>
                          <td className="conversas-amarelo fw-bold">{item.conversasIniciadas}</td>
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
          <Modal.Title>{editingItem ? 'Editar Anúncio' : 'Adicionar Novo Anúncio'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>ID da Cidade</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="ID da Cidade"
                    value={formData.cityId}
                    onChange={(e) => setFormData({ ...formData, cityId: parseInt(e.target.value) || '' })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nome da Cidade</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nome da Cidade"
                    value={formData.cityName}
                    onChange={(e) => setFormData({ ...formData, cityName: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Prévia (Imagem)</Form.Label>
              <div className="border rounded p-3" style={{ borderStyle: 'dashed', borderColor: '#dee2e6' }}>
                <Form.Control
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/gif"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      // Validar tipo de arquivo
                      if (!file.type.startsWith('image/')) {
                        setAlert({ show: true, message: 'Por favor, selecione apenas arquivos de imagem!', variant: 'danger' });
                        return;
                      }
                      
                      // Validar tamanho (máximo 5MB)
                      if (file.size > 5 * 1024 * 1024) {
                        setAlert({ show: true, message: 'O arquivo deve ter no máximo 5MB!', variant: 'danger' });
                        return;
                      }
                      
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        setFormData({
                          ...formData,
                          previewFile: file,
                          preview: event.target.result
                        });
                        setAlert({ show: true, message: 'Imagem carregada com sucesso!', variant: 'success' });
                      };
                      reader.onerror = () => {
                        setAlert({ show: true, message: 'Erro ao carregar a imagem!', variant: 'danger' });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="mb-2"
                />
                <Form.Text className="text-muted">
                  <strong>Formatos aceitos:</strong> PNG, JPG, GIF<br/>
                  <strong>Tamanho máximo:</strong> 5MB<br/>
                  <strong>Tamanho recomendado:</strong> 400x400px
                </Form.Text>
              </div>
              
              {formData.preview && (
                <div className="mt-3">
                  <div className="d-flex align-items-center">
                    <img 
                      src={formData.preview} 
                      alt="Preview" 
                      className="img-fluid me-3" 
                      style={{ width: '100px', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <div className="flex-grow-1">
                      <p className="mb-1"><strong>Imagem selecionada:</strong></p>
                      <p className="mb-0 text-muted small">
                        {formData.previewFile ? formData.previewFile.name : 'Imagem carregada'}
                      </p>
                      {formData.previewFile && (
                        <p className="mb-0 text-muted small">
                          Tamanho: {(formData.previewFile.size / 1024).toFixed(1)} KB
                        </p>
                      )}
                    </div>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          previewFile: null,
                          preview: ''
                        });
                        // Limpar o input de arquivo
                        const fileInput = document.querySelector('input[type="file"]');
                        if (fileInput) {
                          fileInput.value = '';
                        }
                      }}
                    >
                      Remover
                    </Button>
                  </div>
                </div>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Alcance</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ex: Campanha Facebook - Produto A"
                value={formData.alcance}
                onChange={(e) => setFormData({ ...formData, alcance: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Conversas Iniciadas</Form.Label>
              <Form.Control
                type="number"
                min="0"
                value={formData.conversasIniciadas}
                onChange={(e) => setFormData({ ...formData, conversasIniciadas: parseInt(e.target.value) || 0 })}
                placeholder="Digite o número de conversas iniciadas"
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

export default AdsPage;
