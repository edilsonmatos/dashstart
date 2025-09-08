import { Col, Container, Row } from 'react-bootstrap';
import IconifyIcon from '../wrappers/IconifyIcon';
const Footer = () => {
  return <footer className="footer">
      <Container fluid>
        <Row>
          <Col xs={12} className="text-center">
            <span className="text-muted">© Agência Start - 2025</span>
          </Col>
        </Row>
      </Container>
    </footer>;
};
export default Footer;