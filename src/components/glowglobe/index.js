import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapContainer } from 'react-leaflet';
import chroma from 'chroma-js';

// Turf
import { point, polygon, multiPolygon, booleanPointInPolygon } from '@turf/turf'

// Geoman
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';

import './leaflet-extensions/mask/leaflet.mask';

import './leaflet-extensions/Leaflet.Control.Custom';

// Slide Compare
import './leaflet-extensions/sidebyside/leaflet-side-by-side'
import './leaflet-extensions/sidebyside/layout.css'

// Legends
import './leaflet-extensions/htmllegend/L.Control.HtmlLegend'
import './leaflet-extensions/htmllegend/L.Control.HtmlLegend.css'

// Leaflet Basemap Providers
import 'leaflet-providers';

const parse_georaster = require('georaster');
const GeoRasterLayer = require('georaster-layer-for-leaflet');

const Glowglobe = ({ options, output, layers, setAdminLevel }) => {
  const [map, setMap] = useState(null);
  const [data, setData] = useState({});
  const legend = useRef();
  const checkPolygon = useRef();
  const position = [51.505, -0.09];

  const glowglobe = useRef();

  const simpleToolbar = {
    position: 'topleft',
    drawMarker: true,
    drawCircleMarker: false,
    drawPolyline: false,
    drawRectangle: false,
    drawPolygon: false,
    drawCircle: false,
    editMode: false,
    dragMode: false,
    cutPolygon: false,
    removalMode: false,
    rotateMode: false,
  };

  const initializeAdministratorSelector = () => {
    const actions = [
      'cancel',
      {
        text: 'Administration Level 1',
        onClick: () => {
          setAdminLevel(1);
          if (output) {
            const tmpData = data;
            tmpData.administration_level = 1
            output(tmpData)
            setData(tmpData)
          }
          const classes = map.pm.Toolbar.getButtons().AdministrationLevelSelector.buttonsDomNode.firstChild.firstChild.className.split(' ');
          const filteredClasses = classes.filter(
            (item) => !item.startsWith('admin-level')
          )
          filteredClasses.push('admin-level-1');
          map.pm.Toolbar.getButtons().AdministrationLevelSelector.buttonsDomNode.firstChild.firstChild.className = filteredClasses.join(' ');
        },
      },
      {
        text: 'Administration Level 2',
        onClick: () => {
          setAdminLevel(2);
          if (output) {
            const tmpData = data;
            tmpData.administration_level = 2
            output(tmpData)
            setData(tmpData)
          }
          const classes = map.pm.Toolbar.getButtons().AdministrationLevelSelector.buttonsDomNode.firstChild.firstChild.className.split(' ');
          const filteredClasses = classes.filter(
            (item) => !item.startsWith('admin-level')
          )
          filteredClasses.push('admin-level-2');
          map.pm.Toolbar.getButtons().AdministrationLevelSelector.buttonsDomNode.firstChild.firstChild.className = filteredClasses.join(' ');
        },
      },
    ];
    const toolbarOptions = {
      name: 'AdministrationLevelSelector',
      block: 'draw',
      title: 'Admin Level Selector',
      toggle: true,
      className: 'admin-level-1',
      actions,

    };

    map.pm.Toolbar.createCustomControl(toolbarOptions);
  };

  const isValidPoint = (leafletPoint) => {
    const pt = point(leafletPoint.geometry.coordinates);
    let isValid = false;
    for (let geoIndex = 0; geoIndex < checkPolygon.current.features.length; geoIndex += 1) {
      const feature = checkPolygon.current.features[geoIndex];
      if (feature.geometry.type === 'MultiPolygon') {
        const turfShape = multiPolygon(feature.geometry.coordinates);
        if (booleanPointInPolygon(pt, turfShape) === true) {
          isValid = true;
          break;
        };
      } else if (feature.geometry.type === 'Polygon') {
        const turfShape = polygon(feature.geometry.coordinates);
        isValid = booleanPointInPolygon(pt, turfShape);
        if (booleanPointInPolygon(pt, turfShape) === true) {
          isValid = true;
          break;
        };
      }
    }
    return isValid;
  }

  const loadLayers = (layersArray) => {
    layersArray.forEach(
      (layerOptions) => {
        if (layerOptions.layer.type === 'geojson') {
          if (options.mask === true) {
            glowglobe.current.eachLayer((layer) => {
              // eslint-disable-next-line
              if (layer._bounds) {
                glowglobe.current.removeLayer(layer);
              }
            });
            checkPolygon.current = layerOptions.layer.data;
            L.mask(layerOptions.layer.data, {
              map: glowglobe.current, fitBounds: true,
            }).addTo(glowglobe.current);
          } else {
            const layer = L.geoJSON(layerOptions.layer.data);
            layer.addTo(glowglobe.current);
            glowglobe.current.fitBounds(layer.getBounds());
            glowglobe.current.setMaxBounds(layer.getBounds());
          }
        } else if (layerOptions.layer.type === 'geotiff') {
          fetch(layerOptions.layer.data)
            .then((response) => response.arrayBuffer())
            .then((arrayBuffer) => {
              parse_georaster(arrayBuffer).then((georaster) => {
                const pixelValuesLegend = [];
                const scale = chroma.scale('RdGy');
                const layer = new GeoRasterLayer({
                  georaster,
                  opacity: 1,
                  pixelValuesToColorFn(pixelValues) {
                    if (layerOptions.layer.palette.type === 'LandCoverPalette') {
                      if (pixelValues[0] === 1) {
                        return '#42b05c';
                      } if (pixelValues[0] === 2) {
                        return '#a0dc67';
                      } if (pixelValues[0] === 3) {
                        return '#c67f5f';
                      } if (pixelValues[0] === 4) {
                        return '#12AAB5';
                      } if (pixelValues[0] === 5) {
                        return '#5D7F99';
                      } if (pixelValues[0] === 6) {
                        return '#f5d680';
                      } if (pixelValues[0] === 7) {
                        return '#67b7dc';
                      }
                    }
                    else if (layerOptions.layer.palette.type === 'LandDegradationPalette') {
                      if (pixelValues[0] === -1) {
                        return '#d43333';
                      } if (pixelValues[0] === 0) {
                        return '#fcdd90';
                      } if (pixelValues[0] === 1) {
                        return '#398e3b';
                      }
                    }
                    else if (layerOptions.layer.palette.type === 'LandSuitabilityPalette') {
                      if (pixelValues[0] === 0) {
                        return '#dddddd';
                        // eslint-disable-next-line
                      } else if (pixelValues[0] === 1) {
                        return '#398e3b';
                      } else if (pixelValues[0] === 2) {
                        return '#fcdd90';
                      } else if (pixelValues[0] === 3) {
                        return '#d43333';
                      }
                    }
                    else if (layerOptions.layer.palette.type === 'FutureLandDegradation') {
                      if (pixelValues[0] === 1) {
                        return '#398e3b';
                        // eslint-disable-next-line
                      } else if (pixelValues[0] === 2) {
                        return '#79A037';
                      } else if (pixelValues[0] === 3) {
                        return '#BAB032';
                      } else if (pixelValues[0] === 4) {
                        return '#fcdd90';
                      } else if (pixelValues[0] === 5) {
                        return '#ed8f2f';
                      } else if (pixelValues[0] === 6) {
                        return '#e05f2f';
                      } else if (pixelValues[0] === 7) {
                        return '#d43333';
                      }
                    }
                    else if (layerOptions.layer.palette.type === 'LandUsePalette') {
                      if ((pixelValues[0] >= 1) && (pixelValues[0] <= 2)) {
                        return '#267300';
                      } if ((pixelValues[0] >= 3) && (pixelValues[0] <= 4)) {
                        return '#a7e39d';
                      } if ((pixelValues[0] >= 7) && (pixelValues[0] <= 8)) {
                        return '#e66000';
                      } if ((pixelValues[0] >= 9) && (pixelValues[0] <= 11)) {
                        return '#ffaa01';
                      } if ((pixelValues[0] >= 13) && (pixelValues[0] <= 14)) {
                        return '#573a00';
                      } if ((pixelValues[0] >= 15) && (pixelValues[0] <= 17)) {
                        return '#a87001';
                      } if ((pixelValues[0] >= 19) && (pixelValues[0] <= 24)) {
                        return '#df72ff';
                      } if (pixelValues[0] === 25) {
                        return '#343434';
                      } if ((pixelValues[0] >= 26) && (pixelValues[0] <= 29)) {
                        return '#12AAB5';
                      } if ((pixelValues[0] >= 30) && (pixelValues[0] <= 31)) {
                        return '#e7e600';
                      } if ((pixelValues[0] >= 32) && (pixelValues[0] <= 33)) {
                        return '#feff73';
                      } if ((pixelValues[0] >= 34) && (pixelValues[0] <= 35)) {
                        return '#c7960d';
                      } if ((pixelValues[0] >= 36) && (pixelValues[0] <= 37)) {
                        return '#f5d680';
                      } if ((pixelValues[0] >= 38) && (pixelValues[0] <= 40)) {
                        return '#67b7dc';
                      }
                    }
                    else if (layerOptions.layer.palette.type === 'Custom') {
                      if (pixelValues[0] === 1) {
                        return '#007FFF';
                        // eslint-disable-next-line
                      } else if (pixelValues[0] === 2) {
                        return '#FFD12A';
                      } else if (pixelValues[0] === 3) {
                        return '#ED872D';
                      } else if (pixelValues[0] === 4) {
                        return '#A40000';
                      } else if (pixelValues[0] === 5) {
                        return '#614051';
                      } else if (pixelValues[0] === 6) {
                        return '#FC8EAC';
                      } else if (pixelValues[0] === 7) {
                        return '#DAA520';
                      } else if (pixelValues[0] === 8) {
                        return '#FFFFF0';
                      } else if (pixelValues[0] === 9) {
                        return '#00A86B';
                      } else if (pixelValues[0] === 10) {
                        return '#C3B091';
                      } else if (pixelValues[0] === 11) {
                        return '#C4C3D0';
                      } else if (pixelValues[0] === 12) {
                        return '#FFDB58';
                      } else if (pixelValues[0] === 13) {
                        return '#000080';
                      } else if (pixelValues[0] === 14) {
                        return '#808000';
                      } else if (pixelValues[0] === 15) {
                        return '#CB99C9';
                      } else if (pixelValues[0] === 16) {
                        return '#65000B';
                      } else if (pixelValues[0] === 17) {
                        return '#FF8C69';
                      } else if (pixelValues[0] === 18) {
                        return '#008080';
                      } else if (pixelValues[0] === 19) {
                        return '#5B92E5';
                      } else if (pixelValues[0] === 20) {
                        return '#8F00FF';
                      } else if (pixelValues[0] === 21) {
                        return '#F5DEB3';
                      } else if (pixelValues[0] === 22) {
                        return '#738678';
                      } else if (pixelValues[0] === 23) {
                        return '#FFFF00';
                      } else if (pixelValues[0] === 24) {
                        return '#00fff7';
                      } else if (pixelValues[0] === 25) {
                        return '#d8ff2a';
                      } else if (pixelValues[0] === 26) {
                        return '#ed602d';
                      } else if (pixelValues[0] === 27) {
                        return '#99a400';
                      } else if (pixelValues[0] === 28) {
                        return '#504061';
                      } else if (pixelValues[0] === 29) {
                        return 'rgba(252,142,172,0.75)';
                      } else if (pixelValues[0] === 30) {
                        return 'rgba(218,165,32,0.7)';
                      } else if (pixelValues[0] === 31) {
                        return 'rgba(255,255,240,0.74)';
                      } else if (pixelValues[0] === 32) {
                        return 'rgba(0,168,107,0.63)';
                      } else if (pixelValues[0] === 33) {
                        return 'rgba(195,176,145,0.73)';
                      } else if (pixelValues[0] === 34) {
                        return '#432f96';
                      } else if (pixelValues[0] === 35) {
                        return 'rgba(255,219,88,0.29)';
                      } else if (pixelValues[0] === 36) {
                        return '#80007a';
                      } else if (pixelValues[0] === 37) {
                        return 'rgba(128,128,0,0.71)';
                      } else if (pixelValues[0] === 38) {
                        return '#25463b';
                      } else if (pixelValues[0] === 39) {
                        return '#005665';
                      } else if (pixelValues[0] === 40) {
                        return '#9b69ff';
                      } else if (pixelValues[0] === 41) {
                        return 'rgba(0,128,128,0.13)';
                      } else if (pixelValues[0] === 42) {
                        return '#e55b99';
                      } else if (pixelValues[0] === 43) {
                        return 'rgba(0,255,89,0.25)';
                      } else if (pixelValues[0] === 44) {
                        return '#b3f5d7';
                      } else if (pixelValues[0] === 45) {
                        return '#867f73';
                      } else if (pixelValues[0] === 46) {
                        return '#ff00cc';
                      } else if (pixelValues[0] === 47) {
                        return '#89e55b';
                      } else if (pixelValues[0] === 48) {
                        return 'rgba(0,119,255,0.56)';
                      } else if (pixelValues[0] === 49) {
                        return 'rgba(205,179,245,0.63)';
                      } else if (pixelValues[0] === 50) {
                        return '#868473';
                      }
                    }
                    else {
                      const min = georaster.mins[0];
                      const range = georaster.ranges[0];
                      // there's just one band in this raster
                      const pixelValue = pixelValues[0];
                      // if there's zero wind, don't return a color
                      if (pixelValue <= 0) return null;
                      // scale to 0 - 1 used by chroma
                      const scaledPixelValue = (pixelValue - min) / range;
                      const color = scale(scaledPixelValue).hex();
                      pixelValuesLegend.push(pixelValues);
                      return color;
                    }
                    return 'transparent';
                  },
                  resolution: 256,  // optional parameter for adjusting display resolution
                });
                layer.addTo(glowglobe.current);
                const corner1 = layer.getBounds()._northEast; // eslint-disable-line
                const corner2 = layer.getBounds()._southWest; // eslint-disable-line
                const bounds = L.latLngBounds(corner1, corner2);
                glowglobe.current.fitBounds(bounds);
                resolveLegend(layerOptions.layer.palette, layer, 'bottomright');
              });
            })
            .catch((response) => {
              // TODO: Properly handle errors
              console.error(response); // eslint-disable-line
            });
        }
      }
    );
  };

  const loadLayerSidebySide = (sidebysideLayers) => {
    const { left_layer } = sidebysideLayers;
    const { right_layer } = sidebysideLayers;
    let leaflet_left_layer;
    let leaflet_right_layer;
    if (left_layer.layer.type === 'geotiff') {
      fetch(left_layer.layer.data)
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => {
          parse_georaster(arrayBuffer).then(georaster => {
            const pixelValuesLegend = [];
            const scale = chroma.scale('RdGy');
            leaflet_left_layer = new GeoRasterLayer({
              georaster,
              opacity: 1,
              pixelValuesToColorFn(pixelValues) {
                if (left_layer.layer.palette.type === 'LandCoverPalette') {
                  if (pixelValues[0] === 1) {
                    return '#42b05c';
                  } if (pixelValues[0] === 2) {
                    return '#a0dc67';
                  } if (pixelValues[0] === 3) {
                    return '#c67f5f';
                  } if (pixelValues[0] === 4) {
                    return '#12AAB5';
                  } if (pixelValues[0] === 5) {
                    return '#5D7F99';
                  } if (pixelValues[0] === 6) {
                    return '#f5d680';
                  } if (pixelValues[0] === 7) {
                    return '#67b7dc';
                  }
                } else if (left_layer.layer.palette.type === 'LandDegradationPalette') {
                  if (pixelValues[0] === -1) {
                    return '#d43333';
                  } if (pixelValues[0] === 0) {
                    return '#fcdd90';
                  } if (pixelValues[0] === 1) {
                    return '#398e3b';
                  }
                } else if (left_layer.layer.palette.type === 'LandSuitabilityPalette') {
                  if (pixelValues[0] === 0) {
                    return '#dddddd';
                    // eslint-disable-next-line
                  } else if (pixelValues[0] === 1) {
                    return '#398e3b';
                  } else if (pixelValues[0] === 2) {
                    return '#fcdd90';
                  } else if (pixelValues[0] === 3) {
                    return '#d43333';
                  }
                } else if (left_layer.layer.palette.type === 'FutureLandDegradation') {
                    if (pixelValues[0] === 1) {
                      return '#398e3b';
                      // eslint-disable-next-line
                    } else if (pixelValues[0] === 2) {
                      return '#79A037';
                    } else if (pixelValues[0] === 3) {
                      return '#BAB032';
                    } else if (pixelValues[0] === 4) {
                      return '#fcdd90';
                    } else if (pixelValues[0] === 5) {
                      return '#ed8f2f';
                    } else if (pixelValues[0] === 6) {
                      return '#e05f2f';
                    } else if (pixelValues[0] === 7) {
                      return '#d43333';
                    }
                }
                else if (left_layer.layer.palette.type === 'LandUsePalette') {
                  if ((pixelValues[0] >= 1) && (pixelValues[0] <= 2)) {
                    return '#267300';
                  } if ((pixelValues[0] >= 3) && (pixelValues[0] <= 4)) {
                    return '#a7e39d';
                  } if ((pixelValues[0] >= 7) && (pixelValues[0] <= 8)) {
                    return '#e66000';
                  } if ((pixelValues[0] >= 9) && (pixelValues[0] <= 11)) {
                    return '#ffaa01';
                  } if ((pixelValues[0] >= 13) && (pixelValues[0] <= 14)) {
                    return '#573a00';
                  } if ((pixelValues[0] >= 15) && (pixelValues[0] <= 17)) {
                    return '#a87001';
                  } if ((pixelValues[0] >= 19) && (pixelValues[0] <= 24)) {
                    return '#df72ff';
                  } if (pixelValues[0] === 25) {
                    return '#343434';
                  } if ((pixelValues[0] >= 26) && (pixelValues[0] <= 29)) {
                    return '#12AAB5';
                  } if ((pixelValues[0] >= 30) && (pixelValues[0] <= 31)) {
                    return '#e7e600';
                  } if ((pixelValues[0] >= 32) && (pixelValues[0] <= 33)) {
                    return '#feff73';
                  } if ((pixelValues[0] >= 34) && (pixelValues[0] <= 35)) {
                    return '#c7960d';
                  } if ((pixelValues[0] >= 36) && (pixelValues[0] <= 37)) {
                    return '#f5d680';
                  } if ((pixelValues[0] >= 38) && (pixelValues[0] <= 40)) {
                    return '#67b7dc';
                  }
                } else if (left_layer.layer.palette.type === 'Custom') {
                  if (pixelValues[0] === 1) {
                    return '#007FFF';
                    // eslint-disable-next-line
                  } else if (pixelValues[0] === 2) {
                    return '#FFD12A';
                  } else if (pixelValues[0] === 3) {
                    return '#ED872D';
                  } else if (pixelValues[0] === 4) {
                    return '#A40000';
                  } else if (pixelValues[0] === 5) {
                    return '#614051';
                  } else if (pixelValues[0] === 6) {
                    return '#FC8EAC';
                  } else if (pixelValues[0] === 7) {
                    return '#DAA520';
                  } else if (pixelValues[0] === 8) {
                    return '#FFFFF0';
                  } else if (pixelValues[0] === 9) {
                    return '#00A86B';
                  } else if (pixelValues[0] === 10) {
                    return '#C3B091';
                  } else if (pixelValues[0] === 11) {
                    return '#C4C3D0';
                  } else if (pixelValues[0] === 12) {
                    return '#FFDB58';
                  } else if (pixelValues[0] === 13) {
                    return '#000080';
                  } else if (pixelValues[0] === 14) {
                    return '#808000';
                  } else if (pixelValues[0] === 15) {
                    return '#CB99C9';
                  } else if (pixelValues[0] === 16) {
                    return '#65000B';
                  } else if (pixelValues[0] === 17) {
                    return '#FF8C69';
                  } else if (pixelValues[0] === 18) {
                    return '#008080';
                  } else if (pixelValues[0] === 19) {
                    return '#5B92E5';
                  } else if (pixelValues[0] === 20) {
                    return '#8F00FF';
                  } else if (pixelValues[0] === 21) {
                    return '#F5DEB3';
                  } else if (pixelValues[0] === 22) {
                    return '#738678';
                  } else if (pixelValues[0] === 23) {
                    return '#FFFF00';
                  } else if (pixelValues[0] === 24) {
                    return '#00fff7';
                  } else if (pixelValues[0] === 25) {
                    return '#d8ff2a';
                  } else if (pixelValues[0] === 26) {
                    return '#ed602d';
                  } else if (pixelValues[0] === 27) {
                    return '#99a400';
                  } else if (pixelValues[0] === 28) {
                    return '#504061';
                  } else if (pixelValues[0] === 29) {
                    return 'rgba(252,142,172,0.75)';
                  } else if (pixelValues[0] === 30) {
                    return 'rgba(218,165,32,0.7)';
                  } else if (pixelValues[0] === 31) {
                    return 'rgba(255,255,240,0.74)';
                  } else if (pixelValues[0] === 32) {
                    return 'rgba(0,168,107,0.63)';
                  } else if (pixelValues[0] === 33) {
                    return 'rgba(195,176,145,0.73)';
                  } else if (pixelValues[0] === 34) {
                    return '#432f96';
                  } else if (pixelValues[0] === 35) {
                    return 'rgba(255,219,88,0.29)';
                  } else if (pixelValues[0] === 36) {
                    return '#80007a';
                  } else if (pixelValues[0] === 37) {
                    return 'rgba(128,128,0,0.71)';
                  } else if (pixelValues[0] === 38) {
                    return '#25463b';
                  } else if (pixelValues[0] === 39) {
                    return '#005665';
                  } else if (pixelValues[0] === 40) {
                    return '#9b69ff';
                  } else if (pixelValues[0] === 41) {
                    return 'rgba(0,128,128,0.13)';
                  } else if (pixelValues[0] === 42) {
                    return '#e55b99';
                  } else if (pixelValues[0] === 43) {
                    return 'rgba(0,255,89,0.25)';
                  } else if (pixelValues[0] === 44) {
                    return '#b3f5d7';
                  } else if (pixelValues[0] === 45) {
                    return '#867f73';
                  } else if (pixelValues[0] === 46) {
                    return '#ff00cc';
                  } else if (pixelValues[0] === 47) {
                    return '#89e55b';
                  } else if (pixelValues[0] === 48) {
                    return 'rgba(0,119,255,0.56)';
                  } else if (pixelValues[0] === 49) {
                    return 'rgba(205,179,245,0.63)';
                  } else if (pixelValues[0] === 50) {
                    return '#868473';
                  }
                } else {
                  const min = georaster.mins[0];
                  const range = georaster.ranges[0];
                  const pixelValue = pixelValues[0]; // there's just one band in this raster
                  // if there's zero wind, don't return a color
                  if (pixelValue <= 0) return null;
                  // scale to 0 - 1 used by chroma
                  const scaledPixelValue = (pixelValue - min) / range;
                  const color = scale(scaledPixelValue).hex();
                  pixelValuesLegend.push(pixelValues);
                  return color;
                }
                return 'transparent';
              },
              resolution: 256, // optional parameter for adjusting display resolution
            });
            leaflet_left_layer.addTo(glowglobe.current);
            const corner1 = leaflet_left_layer.getBounds()._northEast; // eslint-disable-line
            const corner2 = leaflet_left_layer.getBounds()._southWest; // eslint-disable-line
            const bounds = L.latLngBounds(corner1, corner2);
            glowglobe.current.fitBounds(bounds);
            resolveLegend(left_layer.layer.palette, leaflet_left_layer, 'bottomleft');
            fetch(right_layer.layer.data)
              .then(response => response.arrayBuffer())
              // eslint-disable-next-line
              .then(arrayBuffer => {
                // eslint-disable-next-line
                parse_georaster(arrayBuffer).then(georaster => {
                  const pixelValuesLegend = []; // eslint-disable-line
                  const scale = chroma.scale('RdGy'); // eslint-disable-line
                  leaflet_right_layer = new GeoRasterLayer({
                    georaster,
                    opacity: 1,
                    pixelValuesToColorFn(pixelValues) {
                      if (right_layer.layer.palette.type === 'LandCoverPalette') {
                        if (pixelValues[0] === 1) {
                          return '#42b05c';
                        } if (pixelValues[0] === 2) {
                          return '#a0dc67';
                        } if (pixelValues[0] === 3) {
                          return '#c67f5f';
                        } if (pixelValues[0] === 4) {
                          return '#12AAB5';
                        } if (pixelValues[0] === 5) {
                          return '#5D7F99';
                        } if (pixelValues[0] === 6) {
                          return '#f5d680';
                        } if (pixelValues[0] === 7) {
                          return '#67b7dc';
                        }
                      } else if (right_layer.layer.palette.type === 'LandDegradationPalette') {
                        if (pixelValues[0] === -1) {
                          return '#d43333';
                        } if (pixelValues[0] === 0) {
                          return '#fcdd90';
                        } if (pixelValues[0] === 1) {
                          return '#398e3b';
                        }
                      } else if (right_layer.layer.palette.type === 'LandSuitabilityPalette') {
                        if (pixelValues[0] === 0) {
                          return '#dddddd';
                          // eslint-disable-next-line
                        } else if (pixelValues[0] === 1) {
                          return '#398e3b';
                        } else if (pixelValues[0] === 2) {
                          return '#fcdd90';
                        } else if (pixelValues[0] === 3) {
                          return '#d43333';
                        }
                      } else if (right_layer.layer.palette.type === 'FutureLandDegradation') {
                        if (pixelValues[0] === 1) {
                          return '#398e3b';
                          // eslint-disable-next-line
                        } else if (pixelValues[0] === 2) {
                          return '#79A037';
                        } else if (pixelValues[0] === 3) {
                          return '#BAB032';
                        } else if (pixelValues[0] === 4) {
                          return '#fcdd90';
                        } else if (pixelValues[0] === 5) {
                          return '#ed8f2f';
                        } else if (pixelValues[0] === 6) {
                          return '#e05f2f';
                        } else if (pixelValues[0] === 7) {
                          return '#d43333';
                        }
                      }
                      else if (right_layer.layer.palette.type === 'LandUsePalette') {
                        if ((pixelValues[0] >= 1) && (pixelValues[0] <= 2)) {
                          return '#267300';
                        } if ((pixelValues[0] >= 3) && (pixelValues[0] <= 4)) {
                          return '#a7e39d';
                        } if ((pixelValues[0] >= 7) && (pixelValues[0] <= 8)) {
                          return '#e66000';
                        } if ((pixelValues[0] >= 9) && (pixelValues[0] <= 11)) {
                          return '#ffaa01';
                        } if ((pixelValues[0] >= 13) && (pixelValues[0] <= 14)) {
                          return '#573a00';
                        } if ((pixelValues[0] >= 15) && (pixelValues[0] <= 17)) {
                          return '#a87001';
                        } if ((pixelValues[0] >= 19) && (pixelValues[0] <= 24)) {
                          return '#df72ff';
                        } if (pixelValues[0] === 25) {
                          return '#343434';
                        } if ((pixelValues[0] >= 26) && (pixelValues[0] <= 29)) {
                          return '#12AAB5';
                        } if ((pixelValues[0] >= 30) && (pixelValues[0] <= 31)) {
                          return '#e7e600';
                        } if ((pixelValues[0] >= 32) && (pixelValues[0] <= 33)) {
                          return '#feff73';
                        } if ((pixelValues[0] >= 34) && (pixelValues[0] <= 35)) {
                          return '#c7960d';
                        } if ((pixelValues[0] >= 36) && (pixelValues[0] <= 37)) {
                          return '#f5d680';
                        } if ((pixelValues[0] >= 38) && (pixelValues[0] <= 40)) {
                          return '#67b7dc';
                        }
                      } else if (left_layer.layer.palette.type === 'Custom') {
                        if (pixelValues[0] === 1) {
                          return '#007FFF';
                          // eslint-disable-next-line
                        } else if (pixelValues[0] === 2) {
                          return '#FFD12A';
                        } else if (pixelValues[0] === 3) {
                          return '#ED872D';
                        } else if (pixelValues[0] === 4) {
                          return '#A40000';
                        } else if (pixelValues[0] === 5) {
                          return '#614051';
                        } else if (pixelValues[0] === 6) {
                          return '#FC8EAC';
                        } else if (pixelValues[0] === 7) {
                          return '#DAA520';
                        } else if (pixelValues[0] === 8) {
                          return '#FFFFF0';
                        } else if (pixelValues[0] === 9) {
                          return '#00A86B';
                        } else if (pixelValues[0] === 10) {
                          return '#C3B091';
                        } else if (pixelValues[0] === 11) {
                          return '#C4C3D0';
                        } else if (pixelValues[0] === 12) {
                          return '#FFDB58';
                        } else if (pixelValues[0] === 13) {
                          return '#000080';
                        } else if (pixelValues[0] === 14) {
                          return '#808000';
                        } else if (pixelValues[0] === 15) {
                          return '#CB99C9';
                        } else if (pixelValues[0] === 16) {
                          return '#65000B';
                        } else if (pixelValues[0] === 17) {
                          return '#FF8C69';
                        } else if (pixelValues[0] === 18) {
                          return '#008080';
                        } else if (pixelValues[0] === 19) {
                          return '#5B92E5';
                        } else if (pixelValues[0] === 20) {
                          return '#8F00FF';
                        } else if (pixelValues[0] === 21) {
                          return '#F5DEB3';
                        } else if (pixelValues[0] === 22) {
                          return '#738678';
                        } else if (pixelValues[0] === 23) {
                          return '#FFFF00';
                        } else if (pixelValues[0] === 24) {
                          return '#00fff7';
                        } else if (pixelValues[0] === 25) {
                          return '#d8ff2a';
                        } else if (pixelValues[0] === 26) {
                          return '#ed602d';
                        } else if (pixelValues[0] === 27) {
                          return '#99a400';
                        } else if (pixelValues[0] === 28) {
                          return '#504061';
                        } else if (pixelValues[0] === 29) {
                          return 'rgba(252,142,172,0.75)';
                        } else if (pixelValues[0] === 30) {
                          return 'rgba(218,165,32,0.7)';
                        } else if (pixelValues[0] === 31) {
                          return 'rgba(255,255,240,0.74)';
                        } else if (pixelValues[0] === 32) {
                          return 'rgba(0,168,107,0.63)';
                        } else if (pixelValues[0] === 33) {
                          return 'rgba(195,176,145,0.73)';
                        } else if (pixelValues[0] === 34) {
                          return '#432f96';
                        } else if (pixelValues[0] === 35) {
                          return 'rgba(255,219,88,0.29)';
                        } else if (pixelValues[0] === 36) {
                          return '#80007a';
                        } else if (pixelValues[0] === 37) {
                          return 'rgba(128,128,0,0.71)';
                        } else if (pixelValues[0] === 38) {
                          return '#25463b';
                        } else if (pixelValues[0] === 39) {
                          return '#005665';
                        } else if (pixelValues[0] === 40) {
                          return '#9b69ff';
                        } else if (pixelValues[0] === 41) {
                          return 'rgba(0,128,128,0.13)';
                        } else if (pixelValues[0] === 42) {
                          return '#e55b99';
                        } else if (pixelValues[0] === 43) {
                          return 'rgba(0,255,89,0.25)';
                        } else if (pixelValues[0] === 44) {
                          return '#b3f5d7';
                        } else if (pixelValues[0] === 45) {
                          return '#867f73';
                        } else if (pixelValues[0] === 46) {
                          return '#ff00cc';
                        } else if (pixelValues[0] === 47) {
                          return '#89e55b';
                        } else if (pixelValues[0] === 48) {
                          return 'rgba(0,119,255,0.56)';
                        } else if (pixelValues[0] === 49) {
                          return 'rgba(205,179,245,0.63)';
                        } else if (pixelValues[0] === 50) {
                          return '#868473';
                        }
                      } else {
                        const min = georaster.mins[0];
                        const range = georaster.ranges[0];
                        const pixelValue = pixelValues[0]; // there's just one band in this raster
                        // if there's zero wind, don't return a color
                        if (pixelValue <= 0) return null;
                        // scale to 0 - 1 used by chroma
                        const scaledPixelValue = (pixelValue - min) / range;
                        const color = scale(scaledPixelValue).hex();
                        pixelValuesLegend.push(pixelValues);
                        return color;
                      }
                      return 'transparent';
                    },
                    resolution: 256, // optional parameter for adjusting display resolution
                  });
                  leaflet_right_layer.addTo(glowglobe.current);
                  const corner1 = leaflet_right_layer.getBounds()._northEast; // eslint-disable-line
                  const corner2 = leaflet_right_layer.getBounds()._southWest; // eslint-disable-line
                  const bounds = L.latLngBounds(corner1, corner2); // eslint-disable-line
                  glowglobe.current.fitBounds(bounds);
                  resolveLegend(right_layer.layer.palette, leaflet_right_layer, 'bottomright');
                  L.control.sideBySide(leaflet_left_layer, leaflet_right_layer).addTo(glowglobe.current);
                })
              })
          })
        })
        .catch((response) => console.error(response)) // eslint-disable-line
    }
  }

  const resolveLegend = (palette, layer, legend_position = 'bottomright') => {
    if (palette.type === 'LandCoverPalette') {
      legend.current = L.control.htmllegend({
        position: legend_position,
        legends: [
          {
            name: palette.label,
            layer,
            opacity: 1,
            elements: [{
              label: 'Tree-covered',
              html: '',
              style: {
                'text-align': 'left',
                'background-color': '#42b05c',
                'width': '20px',
                'height': '20px',
                'position': 'relative',
                'margin': '3.75px 0',
              },
            },
            {
              label: 'Grassland',
              html: '',
              style: {
                'text-align': 'left',
                'background-color': '#a0dc67',
                'width': '20px',
                'height': '20px',
                'position': 'relative',
                'margin': '3.75px 0',
              },
            },
            {
              label: 'Cropland',
              html: '',
              style: {
                'text-align': 'left',
                'background-color': '#c67f5f',
                'width': '20px',
                'height': '20px',
                'position': 'relative',
                'margin': '3.75px 0',
              },
            },
            {
              label: 'Wetland',
              html: '',
              style: {
                'text-align': 'left',
                'background-color': '#12AAB5',
                'width': '20px',
                'height': '20px',
                'position': 'relative',
                'margin': '3.75px 0',
              },
            },
            {
              label: 'Artificial area',
              html: '',
              style: {
                'text-align': 'left',
                'background-color': '#5D7F99',
                'width': '20px',
                'height': '20px',
                'position': 'relative',
                'margin': '3.75px 0',
              },
            },
            {
              label: 'Bare land',
              html: '',
              style: {
                'text-align': 'left',
                'background-color': '#f5d680',
                'width': '20px',
                'height': '20px',
                'position': 'relative',
                'margin': '3.75px 0',
              },
            },
            {
              label: 'Water body',
              html: '',
              style: {
                'text-align': 'left',
                'background-color': '#67b7dc',
                'width': '20px',
                'height': '20px',
                'position': 'relative',
                'margin': '3.75px 0',
              },
            },
            ],
          },
        ],
        collapseSimple: true,
        detectStretched: false,
        collapsedOnInit: false,
        defaultOpacity: 1.0,
      })
      glowglobe.current.addControl(legend.current);
    }
    else if (palette.type === 'LandDegradationPalette') {
      legend.current = L.control.htmllegend({
        position: legend_position,
        legends: [
          {
            name: palette.label,
            layer,
            opacity: 1,
            elements: [{
              label: 'Degraded',
              html: '',
              style: {
                'text-align': 'left',
                'background-color': '#d43333',
                'width': '20px',
                'height': '20px',
                'position': 'relative',
                'margin': '3.75px 0',
              },
            },
            {
              label: 'Stable',
              html: '',
              style: {
                'text-align': 'left',
                'background-color': '#fcdd90',
                'width': '20px',
                'height': '20px',
                'position': 'relative',
                'margin': '3.75px 0',
              },
            },
            {
              label: 'Improved',
              html: '',
              style: {
                'text-align': 'left',
                'background-color': '#398e3b',
                'width': '20px',
                'height': '20px',
                'position': 'relative',
                'margin': '3.75px 0',
              },
            },
            ],
          },
        ],
        collapseSimple: true,
        detectStretched: false,
        collapsedOnInit: false,
        defaultOpacity: 1.0,
      })
      glowglobe.current.addControl(legend.current);
    }
    else if (palette.type === 'LandSuitabilityPalette') {
      legend.current = L.control.htmllegend({
        position: legend_position,
        legends: [
          {
            name: palette.label,
            layer,
            opacity: 1,
            elements: [
              {
                label: 'No data',
                html: '',
                style: {
                  'text-align': 'left',
                  'background-color': '#dddddd',
                  'width': '20px',
                  'height': '20px',
                  'position': 'relative',
                  'margin': '3.75px 0',
                },
              },
              {
                label: 'Suitable',
                html: '',
                style: {
                  'text-align': 'left',
                  'background-color': '#398e3b',
                  'width': '20px',
                  'height': '20px',
                  'position': 'relative',
                  'margin': '3.75px 0',
                },
              },
              {
                label: 'Marginal',
                html: '',
                style: {
                  'text-align': 'left',
                  'background-color': '#fcdd90',
                  'width': '20px',
                  'height': '20px',
                  'position': 'relative',
                  'margin': '3.75px 0',
                },
              },
              {
                label: 'Unsuitable',
                html: '',
                style: {
                  'text-align': 'left',
                  'background-color': '#d43333',
                  'width': '20px',
                  'height': '20px',
                  'position': 'relative',
                  'margin': '3.75px 0',
                },
              },
            ],
          },
        ],
        collapseSimple: true,
        detectStretched: false,
        collapsedOnInit: false,
        defaultOpacity: 1.0,
      })
      glowglobe.current.addControl(legend.current);
    }
    else if (palette.type === 'FutureLandDegradation') {
      legend.current = L.control.htmllegend({
        position: legend_position,
        legends: [
          {
            name: palette.label,
            layer,
            opacity: 1,
            elements: [{
              label: 'Not degraded, stable to improvement',
              html: '',
              style: {
                'text-align': 'left',
                'background-color': '#398e3b',
                'width': '20px',
                'height': '20px',
                'position': 'relative',
                'margin': '3.75px 0',
              },
            },
            {
              label: 'Not degraded, likely remaining stable',
              html: '',
              style: {
                'text-align': 'left',
                'background-color': '#79A037',
                'width': '20px',
                'height': '20px',
                'position': 'relative',
                'margin': '3.75px 0',
              },
            },
            {
              label: 'Degraded, stable to recovering',
              html: '',
              style: {
                'text-align': 'left',
                'background-color': '#BAB032',
                'width': '20px',
                'height': '20px',
                'position': 'relative',
                'margin': '3.75px 0',
              },
            },
            {
              label: 'Not degraded, likely becoming degraded',
              html: '',
              style: {
                'text-align': 'left',
                'background-color': '#fcdd90',
                'width': '20px',
                'height': '20px',
                'position': 'relative',
                'margin': '3.75px 0',
              },
            },
            {
              label: 'Not degraded. New LD expected',
              html: '',
              style: {
                'text-align': 'left',
                'background-color': '#ed8f2f',
                'width': '20px',
                'height': '20px',
                'position': 'relative',
                'margin': '3.75px 0',
              },
            },
            {
              label: 'Degraded, Likely remaining degraded',
              html: '',
              style: {
                'text-align': 'left',
                'background-color': '#e05f2f',
                'width': '20px',
                'height': '20px',
                'position': 'relative',
                'margin': '3.75px 0',
              },
            },
            {
              label: 'Degraded. Further degradation is expected',
              html: '',
              style: {
                'text-align': 'left',
                'background-color': '#d43333',
                'width': '20px',
                'height': '20px',
                'position': 'relative',
                'margin': '3.75px 0',
              },
            },
            ],
          },
        ],
        collapseSimple: true,
        detectStretched: false,
        collapsedOnInit: false,
        defaultOpacity: 1.0,
      })
      glowglobe.current.addControl(legend.current);
    }
    else if (palette.type === 'LandUsePalette') {
      legend.current = L.control.htmllegend({
        position: legend_position,
        legends: [
          {
            name: palette.label,
            layer,
            opacity: 1,
            elements: [{
              label: 'Forest virgin or protected',
              html: '',
              style: {
                'text-align': 'left',
                'background-color': '#267300',
                'width': '20px',
                'height': '20px',
                'position': 'relative',
                'margin': '3.75px 0',
              },
            },
            {
              label: 'Forestry with ag. activities',
              html: '',
              style: {
                'text-align': 'left',
                'background-color': '#a7e39d',
                'width': '20px',
                'height': '20px',
                'position': 'relative',
                'margin': '3.75px 0',
              },
            },
            {
              label: 'Grasslands unmanaged or protected',
              html: '',
              style: {
                'text-align': 'left',
                'background-color': '#e66000',
                'width': '20px',
                'height': '20px',
                'position': 'relative',
                'margin': '3.75px 0',
              },
            },
            {
              label: 'Grasslands with ag. activities',
              html: '',
              style: {
                'text-align': 'left',
                'background-color': '#ffaa01',
                'width': '20px',
                'height': '20px',
                'position': 'relative',
                'margin': '3.75px 0',
              },
            },
            {
              label: 'Shrub cover unmanaged or protected',
              html: '',
              style: {
                'text-align': 'left',
                'background-color': '#573a00',
                'width': '20px',
                'height': '20px',
                'position': 'relative',
                'margin': '3.75px 0',
              },
            },
            {
              label: 'Shrub cover with ag. activities',
              html: '',
              style: {
                'text-align': 'left',
                'background-color': '#a87001',
                'width': '20px',
                'height': '20px',
                'position': 'relative',
                'margin': '3.75px 0',
              },
            },
            {
              label: 'Agricultural activities',
              html: '',
              style: {
                'text-align': 'left',
                'background-color': '#df72ff',
                'width': '20px',
                'height': '20px',
                'position': 'relative',
                'margin': '3.75px 0',
              },
            },
            {
              label: 'Urban areas',
              html: '',
              style: {
                'text-align': 'left',
                'background-color': '#343434',
                'width': '20px',
                'height': '20px',
                'position': 'relative',
                'margin': '3.75px 0',
              },
            },
            {
              label: 'Wetland',
              html: '',
              style: {
                'text-align': 'left',
                'background-color': '#12AAB5',
                'width': '20px',
                'height': '20px',
                'position': 'relative',
                'margin': '3.75px 0',
              },
            },
            {
              label: 'Sparse areas unmanaged or protected',
              html: '',
              style: {
                'text-align': 'left',
                'background-color': '#e7e600',
                'width': '20px',
                'height': '20px',
                'position': 'relative',
                'margin': '3.75px 0',
              },
            },
            {
              label: 'Sparse areas with ag. activities',
              html: '',
              style: {
                'text-align': 'left',
                'background-color': '#feff73',
                'width': '20px',
                'height': '20px',
                'position': 'relative',
                'margin': '3.75px 0',
              },
            },
            {
              label: 'Bare areas unmanaged or protected',
              html: '',
              style: {
                'text-align': 'left',
                'background-color': '#c7960d',
                'width': '20px',
                'height': '20px',
                'position': 'relative',
                'margin': '3.75px 0',
              },
            },
            {
              label: 'Bare areas with ag. activities',
              html: '',
              style: {
                'text-align': 'left',
                'background-color': '#f5d680',
                'width': '20px',
                'height': '20px',
                'position': 'relative',
                'margin': '3.75px 0',
              },
            },
            {
              label: 'Water body',
              html: '',
              style: {
                'text-align': 'left',
                'background-color': '#67b7dc',
                'width': '20px',
                'height': '20px',
                'position': 'relative',
                'margin': '3.75px 0',
              },
            },
            ],
          },
        ],
        collapseSimple: true,
        detectStretched: false,
        collapsedOnInit: false,
        defaultOpacity: 1.0,
      })
      glowglobe.current.addControl(legend.current);
    }
    else if (palette.type === 'Custom') {
      const elements = palette.legend.map(
        (item) => {
          let localColor = '#FFFFF';
          if (item.value === 1) {
            localColor = '#007FFF';
          } else if (item.value === 2) {
            localColor = '#FFD12A';
          } else if (item.value === 3) {
            localColor = '#ED872D';
          } else if (item.value === 4) {
            localColor = '#A40000';
          } else if (item.value === 5) {
            localColor = '#614051';
          } else if (item.value === 6) {
            localColor = '#FC8EAC';
          } else if (item.value === 7) {
            localColor = '#DAA520';
          } else if (item.value === 8) {
            localColor = '#FFFFF0';
          } else if (item.value === 9) {
            localColor = '#00A86B';
          } else if (item.value === 10) {
            localColor = '#C3B091';
          } else if (item.value === 11) {
            localColor = '#C4C3D0';
          } else if (item.value === 12) {
            localColor = '#FFDB58';
          } else if (item.value === 13) {
            localColor = '#000080';
          } else if (item.value === 14) {
            localColor = '#808000';
          } else if (item.value === 15) {
            localColor = '#CB99C9';
          } else if (item.value === 16) {
            localColor = '#65000B';
          } else if (item.value === 17) {
            localColor = '#FF8C69';
          } else if (item.value === 18) {
            localColor = '#008080';
          } else if (item.value === 19) {
            localColor = '#5B92E5';
          } else if (item.value === 20) {
            localColor = '#8F00FF';
          } else if (item.value === 21) {
            localColor = '#F5DEB3';
          } else if (item.value === 22) {
            localColor = '#738678';
          } else if (item.value === 23) {
            localColor = '#FFFF00';
          } else if (item.value === 24) {
            localColor = '#00fff7';
          } else if (item.value === 25) {
            localColor = '#d8ff2a';
          } else if (item.value === 26) {
            localColor = '#ed602d';
          } else if (item.value === 27) {
            localColor = '#99a400';
          } else if (item.value === 28) {
            localColor = '#504061';
          } else if (item.value === 29) {
            localColor = 'rgba(252,142,172,0.75)';
          } else if (item.value === 30) {
            localColor = 'rgba(218,165,32,0.7)';
          } else if (item.value === 31) {
            localColor = 'rgba(255,255,240,0.74)';
          } else if (item.value === 32) {
            localColor = 'rgba(0,168,107,0.63)';
          } else if (item.value === 33) {
            localColor = 'rgba(195,176,145,0.73)';
          } else if (item.value === 34) {
            localColor = '#432f96';
          } else if (item.value === 35) {
            localColor = 'rgba(255,219,88,0.29)';
          } else if (item.value === 36) {
            localColor = '#80007a';
          } else if (item.value === 37) {
            localColor = 'rgba(128,128,0,0.71)';
          } else if (item.value === 38) {
            localColor = '#25463b';
          } else if (item.value === 39) {
            localColor = '#005665';
          } else if (item.value === 40) {
            localColor = '#9b69ff';
          } else if (item.value === 41) {
            localColor = 'rgba(0,128,128,0.13)';
          } else if (item.value === 42) {
            localColor = '#e55b99';
          } else if (item.value === 43) {
            localColor = 'rgba(0,255,89,0.25)';
          } else if (item.value === 44) {
            localColor = '#b3f5d7';
          } else if (item.value === 45) {
            localColor = '#867f73';
          } else if (item.value === 46) {
            localColor = '#ff00cc';
          } else if (item.value === 47) {
            localColor = '#89e55b';
          } else if (item.value === 48) {
            localColor = 'rgba(0,119,255,0.56)';
          } else if (item.value === 49) {
            localColor = 'rgba(205,179,245,0.63)';
          } else if (item.value === 50) {
            localColor = '#868473';
          }
          const element = {
            label: item.label,
            html: '',
            style: {
              'text-align': 'left',
              'background-color': localColor,
              'width': '20px',
              'height': '20px',
              'position': 'relative',
              'margin': '3.75px 0',
            },
          }
          return element;
        }
      )
      const tmpLegend = {
        name: palette.label,
        layer,
        opacity: 1,
        elements,
      }
      legend.current = L.control.htmllegend({
        position: legend_position,
        legends: [
          tmpLegend,
        ],
        collapseSimple: true,
        detectStretched: false,
        collapsedOnInit: false,
        defaultOpacity: 1.0,
      });
      glowglobe.current.addControl(legend.current);
    }
  }

  useEffect(() => {
    if (!map) return;

    const tileLayer = L.tileLayer.provider('Esri.WorldImagery');
    tileLayer.addTo(map);
    glowglobe.current = map;

    if (options) {
      if (options.mode === 'select_administration_area') {
        map.pm.addControls(simpleToolbar);
        initializeAdministratorSelector(map)
        map.on('pm:drawstart', (e) => {
          map.pm.getGeomanDrawLayers(false).forEach(
            (geomanLayer) => {
              map.removeLayer(geomanLayer);
            }
          )
        })
        map.on('pm:create', (e) => {
          map.pm.disableDraw();
          if (output) {
            const tmp = data;
            tmp.point = e.layer.toGeoJSON();
            if (isValidPoint(tmp.point) === true) {
              output(tmp);
              setData(tmp);
            } else {
              map.pm.getGeomanDrawLayers(false).forEach(
                (geomanLayer) => {
                  map.removeLayer(geomanLayer);
                }
              )
            }
          }
        });
        loadLayers(layers);
      } else if (options.mode === 'view') {
        loadLayers(layers);
      } else if (options.mode === 'sidebyside') {
        loadLayerSidebySide(options)
      } else if (layers && layers.length > 0) {
        loadLayers(layers);
      }
    }
  }, [map]); // eslint-disable-line

  useEffect(() => {
    if (!map) return;
    if (layers) {
      loadLayers(layers)
    }
  }, [layers]); // eslint-disable-line

  return (
    <div>
      <MapContainer
        zoom={2}
        center={position}
        scrollWheelZoom
        whenCreated={setMap}
        style={{ height: '600px' }}
      />
    </div>

  );
};

export default Glowglobe;
