import 'jsvectormap';
import 'jsvectormap/dist/maps/world.js';

import BaseVectorMap from './BaseVectorMap';

const BrazilVectorMap = ({ height, width, options }) => {
  return (
    <BaseVectorMap
      type="world"
      height={height}
      width={width}
      options={options}
    />
  );
};

export default BrazilVectorMap;
