import { useState, useEffect } from 'react';
import { Form, Button, Alert, Card, CardBody, CardHeader, CardTitle } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/context/useAuthContext';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

const LoginForm = () => {
  const { login, isAuthenticated } = useAuthContext();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email.trim() || !formData.password.trim()) {
      setError('Email e senha são obrigatórios');
      return;
    }

    setLoading(true);

    try {
      const result = await login(formData.email.trim(), formData.password);

      if (!result.success) {
        setError(result.error || 'Erro ao fazer login');
      }
      // Se sucesso, o redirecionamento será feito automaticamente pelo AuthContext
    } catch (error) {
      setError('Erro interno do servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page d-flex justify-content-center align-items-center min-vh-100">
      <div className="auth-container w-100" style={{ maxWidth: '400px' }}>
        {/* Logo */}
        <div className="text-center mb-4">
          <img 
            src="/logo-white.png" 
            alt="Dash Start" 
            className="auth-logo mb-3"
            style={{ height: '60px', width: 'auto' }}
          />
        </div>
        
        <Card className="auth-card shadow-lg border-0">
          <CardHeader className="text-white text-center border-0" style={{ backgroundColor: 'rgb(117, 0, 131)' }}>
            <CardTitle as="h4" className="mb-0">
              <IconifyIcon icon="bx:log-in" className="me-2" />
              Entrar
            </CardTitle>
          </CardHeader>
          <CardBody className="p-4">
        {error && (
          <Alert variant="danger" className="mb-3">
            <IconifyIcon icon="bx:error" className="me-1" />
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Digite seu email"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Senha</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Digite sua senha"
              required
            />
          </Form.Group>

          <Button
            type="submit"
            variant="primary"
            className="w-100 mb-3"
            disabled={loading}
          >
            {loading ? (
              <>
                <IconifyIcon icon="bx:loader-alt" className="me-1" spin />
                Entrando...
              </>
            ) : (
              <>
                <IconifyIcon icon="bx:log-in" className="me-1" />
                Entrar
              </>
            )}
          </Button>
        </Form>

            <div className="text-center">
              <p className="mb-0">
                Não tem uma conta?{' '}
                <Link to="/auth/sign-up" className="text-primary">
                  Criar conta aqui
                </Link>
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default LoginForm;
