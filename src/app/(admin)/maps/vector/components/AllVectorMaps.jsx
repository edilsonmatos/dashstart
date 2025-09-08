import ComponentContainerCard from '@/components/ComponentContainerCard';
import { BrazilVectorMap } from '@/components/VectorMap';

const BrazilMap = () => {
  const brazilMapOptions = {
    map: 'world',
    zoomOnScroll: true,
    zoomButtons: true,
    markersSelectable: true,
    regionStyle: {
      initial: {
        fill: 'rgba(169,183,197, 0.1)',
        fillOpacity: 1,
        stroke: '#22c55e',
        strokeWidth: 1
      },
      hover: {
        fill: 'rgba(34, 197, 94, 0.2)',
        fillOpacity: 1
      }
    },
    markers: [
      {
        name: 'Teófilo Otoni - MG',
        coords: [-17.8575, -41.5053]
      },
      {
        name: 'Águas Formosas - MG',
        coords: [-17.0806, -40.9361]
      },
      {
        name: 'Almenara - MG',
        coords: [-16.1833, -40.7000]
      },
      {
        name: 'Capelinha - MG',
        coords: [-17.6833, -42.5167]
      },
      {
        name: 'Nanuque - MG',
        coords: [-17.8333, -40.3500]
      },
      {
        name: 'Pinheiros - ES',
        coords: [-18.4167, -40.2167]
      },
      {
        name: 'São Mateus - ES',
        coords: [-18.7167, -39.8667]
      }
    ],
    markerStyle: {
      initial: {
        fill: '#ff0000',
        stroke: '#ffffff',
        strokeWidth: 3,
        r: 8
      },
      selected: {
        fill: '#00ff00',
        stroke: '#ffffff',
        strokeWidth: 3,
        r: 10
      },
      hover: {
        fill: '#0000ff',
        stroke: '#ffffff',
        strokeWidth: 3,
        r: 9
      }
    },
    backgroundColor: 'transparent'
  };

  return (
    <ComponentContainerCard 
      id={`brazil_vector_map_${Date.now()}`} 
      title="TESTE CORES - Vermelho/Verde/Azul" 
      description={
        <>
          Mapa mundial focado no Brasil com marcadores nas cidades de Minas Gerais e Espírito Santo: 
          <strong> Teófilo Otoni, Águas Formosas, Almenara, Capelinha, Nanuque, Pinheiros e São Mateus</strong>.
        </>
      }
    >
      <div id="brazil-map-markers">
        <BrazilVectorMap height="500px" width="100%" options={brazilMapOptions} />
      </div>
    </ComponentContainerCard>
  );
};
const AllVectorMaps = () => {
  return <>
      <BrazilMap />
    </>;
};
export default AllVectorMaps;