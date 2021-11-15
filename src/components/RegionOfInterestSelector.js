import * as am4core from '@amcharts/amcharts4/core';
import * as am4maps from '@amcharts/amcharts4/maps';
import am4geodata_worldHigh from '@amcharts/amcharts4-geodata/worldHigh';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { Steps } from 'primereact/steps';
import { useTranslation } from 'react-i18next';

const CountrySelector = ({ setCountry }) => {
  useEffect(() => {
    am4core.useTheme(am4themes_animated);
    const map = am4core.create('country-selector', am4maps.MapChart);
    map.geodata = am4geodata_worldHigh;
    map.projection = new am4maps.projections.Miller();

    const worldSeries = map.series.push(new am4maps.MapPolygonSeries());
    worldSeries.useGeodata = true;

    worldSeries.exclude = ['AQ'];

    const polygonTemplate = worldSeries.mapPolygons.template;
    polygonTemplate.tooltipHTML = '<div>{name}</div>';
    polygonTemplate.fill = am4core.color('#666666');
    polygonTemplate.nonScalingStroke = true;
    polygonTemplate.togglable = true;

    // Hover state
    const ss = polygonTemplate.states.create('active');
    ss.properties.fill = am4core.color('#5ccaa7');

    const hs = polygonTemplate.states.create('hover');
    hs.properties.fill = am4core.color('#6b9ed6');

    // Small map
    map.smallMap = new am4maps.SmallMap();
    // Re-position to top right (it defaults to bottom left)
    map.smallMap.align = 'right';
    map.smallMap.valign = 'top';

    map.smallMap.series.push(worldSeries);

    map.smallMap.background.stroke = am4core.color('#666666');
    map.smallMap.background.fill = am4core.color('white');
    map.smallMap.background.fillOpacity = 1;

    // Remove the outline from smallMap countries
    const smallSeries = map.smallMap.series.getIndex(0);
    smallSeries.mapPolygons.template.stroke = smallSeries.mapPolygons.template.fill;
    smallSeries.mapPolygons.template.strokeWidth = 1;

    // Zoom control
    map.zoomControl = new am4maps.ZoomControl();

    const homeButton = new am4core.Button();
    homeButton.events.on('hit', () => {
      map.goHome();
    });

    homeButton.icon = new am4core.Sprite();
    homeButton.padding(7, 5, 7, 5);
    homeButton.width = 30;
    homeButton.icon.path = 'M16,8 L14,8 L14,16 L10,16 L10,10 L6,10 L6,16 L2,16 L2,8 L0,8 L8,0 L16,8 Z M16,8';
    homeButton.marginBottom = 10;
    homeButton.parent = map.zoomControl;
    homeButton.insertBefore(map.zoomControl.plusButton);

    let lastSelected;

    polygonTemplate.events.on('hit', (ev) => {
      if (lastSelected) {
        // This line serves multiple purposes:
        // 1. Clicking a country twice actually de-activates, the line below
        //    de-activates it in advance, so the toggle then re-activates, making it
        //    appear as if it was never de-activated to begin with.
        // 2. Previously activated countries should be de-activated.
        lastSelected.isActive = false;
      }
      ev.target.series.chart.zoomToMapObject(ev.target);
      if (lastSelected !== ev.target) {
        lastSelected = ev.target;
      }
      setCountry({
        iso_code: ev.target.dataItem.dataContext.id,
        name: ev.target.dataItem.dataContext.name,
      });
    });
  }, [setCountry]);

  return <div id="country-selector" style={{ height: '500px' }} />;
};

const RegionOfInterestSelector = ({ register, setValue }) => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [country, setCountry] = useState(undefined);

  register('country', { required: true });

  useEffect(() => {
    setValue('country', country);
  }, [country, setValue]);

  const steps = [
    {
      label: t('SELECT_COUNTRY'),
      command: (_e) => {
        setActiveIndex(0);
      },
    },
    {
      label: t('DEFINE_THE_ROI'),
      command: (_e) => {
        if (country === undefined) return;
        setActiveIndex(1);
      },
    },
  ];

  return (
    <>
      <Steps
        model={steps}
        activeIndex={activeIndex}
        readOnly
        className="p-mb-4"
      />
      {activeIndex === 0 && (
        <>
          <CountrySelector setCountry={setCountry} />
          <div className="p-d-flex p-jc-between p-mt-6 p-mb-2">
            <Button className="p-button-secondary" type="button" disabled={activeIndex === 0} label={t('PREVIOUS')} icon="pi pi-angle-left" />
            <Button className="p-button-secondary" type="button" label={t('NEXT')} icon="pi pi-angle-right" iconPos="right" />
          </div>
        </>
      )}
    </>
  );
};

export default RegionOfInterestSelector;
