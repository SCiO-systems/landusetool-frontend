import React, { useEffect, useRef } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import currency from 'currency.js';

const currencyOptions = {
  symbol: '$',
  separator: '.',
  decimal: ',',
};

const SLMCostsGraph = ({ domId = 'slm-costs', data }) => {
  const chart = useRef();

  const getRawValue = (field) => 
    (data[field]) ? currency(data[field], currencyOptions).value : 0;

  useEffect(() => {
    buildGraph();
    return () => chart.current?.dispose();
  }, [data]); // eslint-disable-line

  const buildGraph = () => {
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    /* Create chart instance */
    chart.current = am4core.create(domId, am4charts.XYChart);
    const total_establishment_costs = getRawValue('total_establishment_costs');
    const total_maintenance_costs = getRawValue('total_maintenance_costs');

    chart.current.data = [ {
      'cost_category': 'Establishment Costs',
      'labour_costs': getRawValue('establishment_labour_cost'),
      'equipment_costs': getRawValue('establishment_equipment_cost'),
      'plant_materials_costs': getRawValue('establishment_plant_material_cost'),
      'fertilizer_costs': getRawValue('establishment_fertilizer_cost'),
      'construction_costs': getRawValue('establishment_construction_cost'),
      'other_costs': getRawValue('establishment_other_cost'),
    }, {
      'cost_category': 'Maintenance Costs',
      'labour_costs': getRawValue('maintenance_labour_cost'),
      'equipment_costs': getRawValue('maintenance_equipment_cost'),
      'plant_materials_costs': getRawValue('maintenance_plant_material_cost'),
      'fertilizer_costs': getRawValue('maintenance_fertilizer_cost'),
      'construction_costs': getRawValue('maintenance_construction_cost'),
      'other_costs': getRawValue('maintenance_other_cost'),
    } ];

    chart.current.paddingTop = 45;

    const noteL = chart.current.tooltipContainer.createChild(am4core.Label);
    noteL.text = `Total establishment costs: [bold]${total_establishment_costs} $/ha[/]`;
    noteL.fontSize = 17;
    noteL.valign = 'top';
    noteL.align = 'left';
    noteL.marginLeft = 75;

    const noteR = chart.current.tooltipContainer.createChild(am4core.Label);
    noteR.text = `Total maintenance costs = [bold]${total_maintenance_costs} $/ha[/]`;
    noteR.fontSize = 17;
    noteR.valign = 'top';
    noteR.align = 'right';
    noteR.marginRight = 15;


    // Create axes
    const categoryAxis = chart.current.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'cost_category';
    categoryAxis.title.text = 'Local country offices';
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 20;
    categoryAxis.renderer.cellStartLocation = 0.1;
    categoryAxis.renderer.cellEndLocation = 0.9;


    const valueAxis = chart.current.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.title.text = 'Costs ($/ha)';

    // Create series
    const createSeries = (field, name, stacked) => {
      const series = chart.current.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueY = field;
      series.dataFields.categoryX = 'cost_category';
      series.name = name;
      series.columns.template.tooltipText = '{name} ($/ha): [bold]{valueY}[/] ';
      series.stacked = stacked;
      series.columns.template.width = am4core.percent(95);
    };

    createSeries('labour_costs', 'Labour', false);
    createSeries('equipment_costs', 'Equipment', false);
    createSeries('plant_materials_costs', 'Plant Materials', false);
    createSeries('fertilizer_costs', 'Fertilizer', false);
    createSeries('construction_costs', 'Construction', false);
    createSeries('other_costs', 'Other', false);

    // Add legend
    chart.current.legend = new am4charts.Legend();
  }

  const styles = {
    width: '100%',
    height: '500px',
  };

  return (
    <div id={domId} style={styles} />
  );

}

export default SLMCostsGraph;
