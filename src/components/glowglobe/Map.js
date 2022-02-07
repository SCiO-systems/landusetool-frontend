import React from 'react';
import Glowglobe from '.';

const Map = ({
  type = 'single',
  mapLinks,
  paletteType,
  label,
  customLuClasses = null,
}) => {

  const constructLegends = (luClasses) =>
    luClasses.map(({ name }) => ({ 'label': name }));

  const constructPaletteOptions = () => ({
    type: paletteType || 'LandCoverPalette',
    label: label || 'Unnamed',
    legend: (customLuClasses === null) ? [] : constructLegends(customLuClasses),
  });

  const constructPropsByType = () => {
    // dragabble side-by-side map
    if (type === 'side-by-side') {
      return {
        layers: {
          layer: {
            type: 'geotiff',
            data: mapLinks[0],
            palette: constructPaletteOptions(),
          },
        },
        options: {
          mode: 'sidebyside',
          mask: false,
          left_layer: {
            layer: {
              type: 'geotiff',
              data: mapLinks[0],
              palette: constructPaletteOptions(),
            },
          },
          right_layer: {
            layer: {
              type: 'geotiff',
              data: mapLinks[1],
              palette: constructPaletteOptions(),
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
          data: mapLinks[0],
          palette: constructPaletteOptions(),
        },
      },
      options: {
        mode: 'view',
        mask: true,
      },
    }
  };

  if (!mapLinks || mapLinks.length < 1) {
    return <div>You need to provide at least one mapLink to display the map.</div>;
  }

  if (type === 'side-by-side' && (!mapLinks || mapLinks.length < 2)) {
    return <div>You need to provide at two mapLinks to display the side-by-side map.</div>;
  }

  return (
    <Glowglobe {...constructPropsByType(type)} />
  );
};

export default Map;
