import avatar1 from '@/assets/images/users/avatar-1.jpg';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Card, CardBody, CardHeader, CardTitle, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
const ProfileMain = () => {
  const [profileImage, setProfileImage] = useState(avatar1);
  const [profileName, setProfileName] = useState('Gaston Lapierre');
  const [isEditingName, setIsEditingName] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
        // Salvar no localStorage para persistir a imagem
        localStorage.setItem('profile-image', e.target.result);
        // Disparar evento customizado para notificar outros componentes
        window.dispatchEvent(new CustomEvent('profileImageUpdated', { 
          detail: { image: e.target.result } 
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleNameEdit = () => {
    setIsEditingName(true);
  };

  const handleNameSave = () => {
    setIsEditingName(false);
    // Salvar no localStorage
    localStorage.setItem('profile-name', profileName);
    // Disparar evento customizado para notificar outros componentes
    window.dispatchEvent(new CustomEvent('profileNameUpdated', { 
      detail: { name: profileName } 
    }));
  };

  const handleNameCancel = () => {
    setIsEditingName(false);
    // Restaurar nome salvo
    const savedName = localStorage.getItem('profile-name');
    if (savedName) {
      setProfileName(savedName);
    }
  };

  // Carregar dados salvos do localStorage ao inicializar
  useEffect(() => {
    const savedImage = localStorage.getItem('profile-image');
    if (savedImage) {
      setProfileImage(savedImage);
    }
    
    const savedName = localStorage.getItem('profile-name');
    if (savedName) {
      setProfileName(savedName);
    }
  }, []);

  return <Row>
      <Col xl={9} lg={8}>
        <Card className="overflow-hidden">
          <CardBody>
            <div className="bg-primary profile-bg rounded-top position-relative mx-n3 mt-n3">
              <img src={profileImage} alt="avatar" className="avatar-xl border border-light border-3 rounded-circle position-absolute top-100 start-0 translate-middle ms-5" />
            </div>
            <div className="mt-5 d-flex flex-wrap align-items-center justify-content-between">
              <div>
                <div className="d-flex align-items-center gap-2 mb-1">
                  {isEditingName ? (
                    <div className="d-flex align-items-center gap-2">
                      <Form.Control
                        type="text"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="fw-bold"
                        style={{fontSize: '1.25rem', border: '2px solid #007bff'}}
                        autoFocus
                      />
                      <Button variant="success" size="sm" onClick={handleNameSave}>
                        <IconifyIcon icon="bx:check" />
                      </Button>
                      <Button variant="outline-secondary" size="sm" onClick={handleNameCancel}>
                        <IconifyIcon icon="bx:x" />
                      </Button>
                    </div>
                  ) : (
                    <h4 className="mb-0 d-flex align-items-center gap-2">
                      {profileName} <IconifyIcon icon="bxs:badge-check" className="text-success align-middle" />
                      <Button 
                        variant="link" 
                        size="sm" 
                        onClick={handleNameEdit}
                        className="p-0 text-muted"
                        style={{fontSize: '0.875rem'}}
                      >
                        <IconifyIcon icon="bx:edit" />
                      </Button>
                    </h4>
                  )}
                </div>
                <p className="mb-0">Project Head Manager</p>
              </div>
              <div className="d-flex align-items-center gap-2 my-2 my-lg-0">
                <Button variant="outline-secondary" onClick={handleUploadClick}>
                  <IconifyIcon icon="bx:camera" /> Alterar Foto
                </Button>
                <Link to="" className="btn btn-info">
                  <IconifyIcon icon="bx:message-dots" /> Message
                </Link>
                <Link to="" className="btn btn-outline-primary">
                  <IconifyIcon icon="bx:plus" /> Follow
                </Link>
                <Dropdown>
                  <DropdownToggle as={'a'} href="#" className="dropdown-toggle arrow-none card-drop" data-bs-toggle="dropdown" aria-expanded="false">
                    <IconifyIcon icon="solar:menu-dots-bold" className="fs-20 align-middle text-muted" />
                  </DropdownToggle>
                  <DropdownMenu className="dropdown-menu-end">
                    <DropdownItem>Download</DropdownItem>
                    <DropdownItem>Export</DropdownItem>
                    <DropdownItem>Import</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </div>
            
            {/* Input de arquivo oculto */}
            <Form.Control
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
            <Row className="mt-3 gy-2">
              <Col lg={2} xs={6}>
                <div className="d-flex align-items-center gap-2 border-end">
                  <div>
                    <IconifyIcon icon="solar:clock-circle-bold-duotone" className="fs-28 text-primary" />
                  </div>
                  <div>
                    <h5 className="mb-1">3+ Years Job</h5>
                    <p className="mb-0">Experience</p>
                  </div>
                </div>
              </Col>
              <Col lg={2} xs={6}>
                <div className="d-flex align-items-center gap-2 border-end">
                  <div>
                    <IconifyIcon icon="solar:cup-star-bold-duotone" className="fs-28 text-primary" />
                  </div>
                  <div>
                    <h5 className="mb-1">5 Certificate</h5>
                    <p className="mb-0">Achieved</p>
                  </div>
                </div>
              </Col>
              <Col lg={2} xs={6}>
                <div className="d-flex align-items-center gap-2">
                  <div>
                    <IconifyIcon icon="solar:notebook-bold-duotone" className="fs-28 text-primary" />
                  </div>
                  <div>
                    <h5 className="mb-1">2 Internship</h5>
                    <p className="mb-0">Completed</p>
                  </div>
                </div>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>
      <Col xl={3} lg={4}>
        <Card>
          <CardHeader>
            <CardTitle as={'h4'}>Personal Information</CardTitle>
          </CardHeader>
          <CardBody>
            <div>
              <div className="d-flex align-items-center gap-2 mb-2">
                <div className="avatar-sm bg-light d-flex align-items-center justify-content-center rounded">
                  <IconifyIcon icon="solar:backpack-bold-duotone" className="fs-20 text-secondary" />
                </div>
                <p className="mb-0 fs-14">Project Head Manager</p>
              </div>
              <div className="d-flex align-items-center gap-2 mb-2">
                <div className="avatar-sm bg-light d-flex align-items-center justify-content-center rounded">
                  <IconifyIcon icon="solar:square-academic-cap-2-bold-duotone" className="fs-20 text-secondary" />
                </div>
                <p className="mb-0 fs-14">
                  Went to <span className="text-dark fw-semibold">Oxford International</span>
                </p>
              </div>
              <div className="d-flex align-items-center gap-2 mb-2">
                <div className="avatar-sm bg-light d-flex align-items-center justify-content-center rounded">
                  <IconifyIcon icon="solar:map-point-bold-duotone" className="fs-20 text-secondary" />
                </div>
                <p className="mb-0 fs-14">
                  Lives in <span className="text-dark fw-semibold">Pittsburgh, PA 15212</span>
                </p>
              </div>
              <div className="d-flex align-items-center gap-2 mb-2">
                <div className="avatar-sm bg-light d-flex align-items-center justify-content-center rounded">
                  <IconifyIcon icon="solar:users-group-rounded-bold-duotone" className="fs-20 text-secondary" />
                </div>
                <p className="mb-0 fs-14">
                  Followed by <span className="text-dark fw-semibold">16.6k People</span>
                </p>
              </div>
              <div className="d-flex align-items-center gap-2 mb-2">
                <div className="avatar-sm bg-light d-flex align-items-center justify-content-center rounded">
                  <IconifyIcon icon="solar:letter-bold-duotone" className="fs-20 text-secondary" />
                </div>
                <p className="mb-0 fs-14">
                  Email{' '}
                  <Link to="" className="text-primary fw-semibold">
                    hello@dundermuffilin.com
                  </Link>
                </p>
              </div>
              <div className="d-flex align-items-center gap-2 mb-2">
                <div className="avatar-sm bg-light d-flex align-items-center justify-content-center rounded">
                  <IconifyIcon icon="solar:link-bold-duotone" className="fs-20 text-secondary" />
                </div>
                <p className="mb-0 fs-14">
                  Website{' '}
                  <Link to="" className="text-primary fw-semibold">
                    www.larkon.co
                  </Link>
                </p>
              </div>
              <div className="d-flex align-items-center gap-2 mb-2">
                <div className="avatar-sm bg-light d-flex align-items-center justify-content-center rounded">
                  <IconifyIcon icon="solar:global-bold-duotone" className="fs-20 text-secondary" />
                </div>
                <p className="mb-0 fs-14">
                  Language <span className="text-dark fw-semibold">English , Spanish , German</span>
                </p>
              </div>
              <div className="d-flex align-items-center gap-2">
                <div className="avatar-sm bg-light d-flex align-items-center justify-content-center rounded">
                  <IconifyIcon icon="solar:check-circle-bold-duotone" className="fs-20 text-secondary" />
                </div>
                <p className="mb-0 fs-14">
                  Status <span className="badge bg-success-subtle text-success ms-1">Active</span>
                </p>
              </div>
              <div className="mt-2">
                <Link to="" className="text-primary">
                  View More
                </Link>
              </div>
            </div>
          </CardBody>
        </Card>
      </Col>
    </Row>;
};
export default ProfileMain;