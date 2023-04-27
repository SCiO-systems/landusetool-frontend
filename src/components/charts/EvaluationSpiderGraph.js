import React, { useEffect, useRef } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

const EvaluationSpiderGraph = ({ domId = 'spider-graph', compareWith = null, data }) => {
  const chart = useRef();

  useEffect(() => {
    buildGraph();
    return () => chart.current?.dispose();
  }, [data, compareWith]); // eslint-disable-line

  const buildGraph = () => {
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    /* Create chart instance */
    chart.current = am4core.create(domId, am4charts.RadarChart);

    const chartData = [...data];
    if (data !== undefined) {
      if (compareWith !== null) {
        // pull slm1 from compareWith and insert it as slm2 of data
        compareWith.forEach((comparison, index) => {
          chartData[index].slm2 = comparison.slm1;
        });
      }
      chart.current.data = chartData;
    }

    chart.current.legend = new am4charts.Legend();

    /* Create axes */
    const categoryAxis = chart.current.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'criteria';

    const valueAxis = chart.current.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.axisFills.template.fill = chart.current.colors.getIndex(2);
    valueAxis.renderer.axisFills.template.fillOpacity = 0.05;

    /* Create and configure series */
    const series1 = chart.current.series.push(new am4charts.RadarSeries());
    series1.dataFields.valueY = 'slm1';
    series1.dataFields.categoryX = 'criteria';
    series1.name = compareWith === null ? 'LM Sustainability Assessment' : 'Current SLM';
    series1.strokeWidth = 2;
    series1.stroke = compareWith === null ? am4core.color('#46a084') : am4core.color('#fcdd90');
    series1.fill = compareWith === null ? am4core.color('#46a084') : am4core.color('#fcdd90');;

    const series2 = chart.current.series.push(new am4charts.RadarSeries());
    series2.dataFields.valueY = 'slm2';
    series2.dataFields.categoryX = 'criteria';
    series2.name = compareWith === null ? 'Zero Line (neither improve nor degrade)' : 'Selected SLM';
    series2.strokeWidth = 2;
    series2.stroke = compareWith === null ? am4core.color('#fcdd90') : am4core.color('#46a084');
    series2.fill = compareWith === null ? am4core.color('#fcdd90') : am4core.color('#46a084');

    chart.current.legend.itemContainers.template.paddingTop = 30;
  }

  const styles = {
    width: '100%',
    maxWidth: '600px',
    height: '500px',
    maxHeight: '60vh',
  };

  return (
    <div id={domId} style={styles} />
  );

}

export default EvaluationSpiderGraph;
