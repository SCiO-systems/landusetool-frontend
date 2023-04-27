import { Card } from 'primereact/card';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import Map from '../components/glowglobe/Map';
import { UserContext } from '../store';
import { DEFAULT_LU_CLASSES } from '../utilities/schema-generators';

const UNCCDBaseline = () => {
  const { t } = useTranslation();
  const { currentProject } = useContext(UserContext);

  const maps = [
    {
      link: currentProject.preprocessing_data.land_degradation,
      label: 'Current Land Degradation',
      paletteType: 'LandDegradationPalette',
    },
  ];

  const nameForClass = (classValue) => (currentProject.lu_classes !== null)
    ? currentProject.lu_classes.find((clc) => clc.value === Number(classValue)).key
    : DEFAULT_LU_CLASSES[classValue];

  const values = currentProject?.preprocessing_data?.ld_per_class || [];
  const total = [currentProject?.preprocessing_data?.total_ld].filter(Boolean);

  return (
    <div className="layout-dashboard">
      <Card
        title={t('UNCCD_BASELINE')}
        subTitle={() => (
          <p>
            SDG Indicator 15.3.1 data retrieved from{' '}
            <a href="https://trends.earth/" target="_blank" rel="noreferrer">
              Trends.Earth
            </a>{' '}
            with baseline period [1/1/2000 – 31/12/2015].
          </p>
        )}
      >
        <div className="p-grid">
          <div className="p-col-12">
            <Map maps={maps} customLuClasses={currentProject.lu_classes} />
          </div>
        </div>
        <div className="p-mt-2">
          <h4>Land Degradation per LU class</h4>
          <DataTable emptyMessage="No entries were found." value={values}>
            <Column header="Land Use class" field="class" body={(rowData) => nameForClass(rowData.class)} />
            <Column header="Degraded" field="degraded" body={({ degraded }) => `${degraded} ha`} />
            <Column header="Stable" field="stable" body={({ stable }) => `${stable} ha`} />
            <Column header="Improved" field="improved" body={({ improved }) => `${improved} ha`} />
          </DataTable>
        </div>
        <div className="p-mt-4">
          <h4>Total Land Degradation</h4>
          <DataTable emptyMessage="No entries were found." value={total}>
            <Column
              header="Degraded"
              className="low"
              field="degraded"
              body={({ degraded }) => `${degraded} ha`}
            />
            <Column
              header="Stable"
              className="medium"
              field="stable"
              body={({ stable }) => `${stable} ha`}
            />
            <Column
              header="Improved"
              className="high"
              field="improved"
              body={({ improved }) => `${improved} ha`}
            />
          </DataTable>
        </div>
      </Card>
    </div>
  );
};

export default UNCCDBaseline;
