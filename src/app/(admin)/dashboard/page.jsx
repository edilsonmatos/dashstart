import { Row } from 'react-bootstrap';
import { useState } from 'react';
import Conversions from './components/Conversions';
import Orders from './components/Orders';
import Stats from './components/Stats';

//

const DashboardPage = () => {
  const [selectedCity, setSelectedCity] = useState(null);

  const handleCitySelect = (city) => {
    setSelectedCity(city);
  };

  return <>
      <Row>
        <Stats />
        <Conversions onCitySelect={handleCitySelect} />
        <Orders selectedCity={selectedCity} />
      </Row>
    </>;
};
export default DashboardPage;