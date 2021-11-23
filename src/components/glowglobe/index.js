import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapContainer } from 'react-leaflet';
import chroma from 'chroma-js';

// Geoman
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';

import './leaflet-extensions/Leaflet.Control.Custom';
import './leaflet-extensions/CustomMask';

// Leaflet Basemap Providers
import 'leaflet-providers';

const parse_georaster = require('georaster');
const GeoRasterLayer = require('georaster-layer-for-leaflet');

const Glowglobe = ({ options, output, layers, setAdminLevel }) => {
  const [map, setMap] = useState(null);
  const [data, setData] = useState({});
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

  const initializeAdministratorSelector = (currMap) => {
    const actions = [
      'cancel',
      {
        text: 'Administration Level 1',
        onClick: () => {
          setAdminLevel(1);
        },
      },
      {
        text: 'Administration Level 2',
        onClick: () => {
          setAdminLevel(2);
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

  const loadLayers = (layersArray) => {
    layersArray.forEach(
      (layerOptions) => {
        if (layerOptions.layer.type === 'geojson') {
          const layer = L.geoJSON(layerOptions.layer.data);
          if (options.mask === true) {
            const coordinates = layerOptions.layer.data.features[0].geometry.coordinates[0];
            const latLngs = [];
            for (let i = 0; i < coordinates.length; i += 1) {
              latLngs.push(new L.LatLng(coordinates[i][1], coordinates[i][0]));
            }
            L.mask(latLngs).addTo(glowglobe.current);
          }
          layer.addTo(glowglobe.current);
          glowglobe.current.fitBounds(layer.getBounds());
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
                    if (layerOptions.layer.palette === 1) {
                      switch (pixelValues[0]) {
                        case 1:
                          return '#ed8f2f';
                        case 2:
                          return '#e05f2f';
                        case 3:
                          return '#d43333';
                        case 0:
                          return '#ffffff';
                        default:
                          return '#ffffff';
                      }
                    } else if (layerOptions.layer.palette === 2) {
                      switch (pixelValues[0]) {
                        case 1:
                          return '#42b05c';
                        case 2:
                          return '#a0dc67';
                        case 3:
                          return '#c67f5f';
                        case 4:
                          return '#12AAB5';
                        case 5:
                          return '#5D7F99';
                        case 6:
                          return '#f5d680';
                        case 7:
                          return '#67b7dc';
                        default:
                          return '#ffffff';
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
                  },
                  resolution: 256, // optional parameter for adjusting display resolution
                });

                layer.addTo(glowglobe.current);
                const corner1 = layer.getBounds()._northEast; // eslint-disable-line
                const corner2 = layer.getBounds()._southWest; // eslint-disable-line
                const bounds = L.latLngBounds(corner1, corner2);
                glowglobe.current.fitBounds(bounds);
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

  useEffect(() => {
    if (!map) return;

    const tileLayer = L.tileLayer.provider('Esri.WorldImagery');
    tileLayer.addTo(map);

    glowglobe.current = map;
    if (options) {
      if (options.mode === 'select_administration_area') {
        map.pm.addControls(simpleToolbar);
        initializeAdministratorSelector(map);

        map.on('pm:drawstart', (e) => {
          map.pm.getGeomanDrawLayers(false).forEach(
            (geomanLayer) => {
              map.removeLayer(geomanLayer);
            }
          );
        });

        map.on('pm:create', (e) => {
          map.pm.disableDraw();
          if (output) {
            const tmpData = data;
            tmpData.point = e.layer.toGeoJSON();
            output(tmpData);
            setData(tmpData);
          }
        });
      } else if (options.mode === 'sidebyside') {
        loadLayers(options.layers);
      }
      if (layers && layers.length > 0) {
        loadLayers(layers);
      }
    }
  }, [map]); // eslint-disable-line

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
