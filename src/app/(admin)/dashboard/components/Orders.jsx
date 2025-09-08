import { Card, CardBody, CardFooter, CardTitle, Col, Row } from 'react-bootstrap';
import AdsTable from './AdsTable';
import { memo } from 'react';

const Orders = ({ selectedCity }) => {
  return <Col>
      <Card>
        <CardBody>
          <CardTitle as={'h4'}>
            Anúncios
            {selectedCity && (
              <small className="text-muted ms-2">
                - {selectedCity.name}
              </small>
            )}
          </CardTitle>
        </CardBody>
        <AdsTable selectedCity={selectedCity} />
        <CardFooter className="border-top">
          <Row className="g-3">
            <div className="col-sm">
              <div className="text-muted">
                Anúncios por cidade
              </div>
            </div>
          </Row>
        </CardFooter>
      </Card>
    </Col>;
};

export default memo(Orders);