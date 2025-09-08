import { useState } from 'react';
import { Form, Button, Alert, Card, CardBody, CardHeader, CardTitle } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuthContext } from '@/context/useAuthContext';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

const LoginForm = () => {
  const { login } = useAuthContext();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    <Card>
      <CardHeader>
        <CardTitle as="h4" className="text-center">
          <IconifyIcon icon="bx:log-in" className="me-2" />
          Entrar
        </CardTitle>
      </CardHeader>
      <CardBody>
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
  );
};

export default LoginForm;
