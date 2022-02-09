import React from 'react';
import Glowglobe from '.';

const Map = ({
  type = 'single',
  maps,
  customLuClasses = null,
}) => {

  const constructLegends = (luClasses) =>
    luClasses.map(({ name }) => ({ 'label': name }));

  const constructPaletteOptions = (paletteType, label = 'Unnamed') => ({
    type: paletteType,
    label,
    legend: (customLuClasses === null) ? [] : constructLegends(customLuClasses),
  });

  const constructPropsByType = () => {
    // dragabble side-by-side map
    if (type === 'side-by-side') {
      return {
        layers: null,
        options: {
          mode: 'sidebyside',
          mask: false,
          left_layer: {
            layer: {
              type: 'geotiff',
              data: maps[0].link,
              palette: constructPaletteOptions(maps[0].paletteType, maps[0].label),
            },
          },
          right_layer: {
            layer: {
              type: 'geotiff',
              data: maps[1].link,
              palette: constructPaletteOptions(maps[1].paletteType, maps[1].label),
            },
          },
        },
      }
    }

    // a single map
    return {
      layers: {
        layer: {
          type: 'geotiff',
          data: maps[0].link,
          palette: constructPaletteOptions(maps[0].paletteType, maps[0].label),
        },
      },
      options: {
        mode: 'view',
        mask: false,
      },
    }
  };

  if (!maps || maps.length < 1) {
    return <div>You need to provide at least one map entity to display the map.</div>;
  }

  if (type === 'side-by-side' && (!maps || maps.length < 2)) {
    return <div>You need to provide at two maps to display the side-by-side map.</div>;
  }

  return (
    <Glowglobe {...constructPropsByType(type)} />
  );
};

export default Map;
