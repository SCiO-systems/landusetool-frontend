import React, { useMemo } from 'react';
import { Column } from 'primereact/column';
import { Row } from 'primereact/row';
import { ColumnGroup } from 'primereact/columngroup';
import { DataTable } from 'primereact/datatable';

import { DEFAULT_LU_CLASSES } from '../../utilities/schema-generators';

const FLDTable = ({ data, customLuClasses = null }) => {
  const values = useMemo(() => {
    const initialData = data?.ld_per_class || [];
    
    return initialData.map((item, i) => ({ ...item, ...data?.fld_per_class[i] }));
  }, [data]);

  const formatHectares = (num) => `${num} ha`;

  const nameForClass = (classValue) => (customLuClasses !== null)
    ? customLuClasses.find((clc) => clc.value === Number(classValue)).key
    : DEFAULT_LU_CLASSES[classValue];

  const headerGroup = (
    <ColumnGroup>
      <Row>
        <Column header="Land Use class" rowSpan={2} />
        <Column header="UNCCD Baseline" colSpan={3} />
        <Column header="Future Land Degradation" colSpan={7} />
      </Row>
      <Row>
        <Column header="Degraded" field="degraded"/>
        <Column header="Stable" field="stable"/>
        <Column header="Improved" field="improved"/>
        <Column header="Not degraded, stable to improvement" field="fldc_1"/>
        <Column header="Not degraded, likely remaining stable" field="fldc_2"/>
        <Column header="Degraded, stable to recovering" field="fldc_3"/>
        <Column header="Not degraded, likely becoming degraded" field="fldc_4"/>
        <Column header="Not degraded. New LD expected" field="fldc_5"/>
        <Column header="Degraded, Likely remaining degraded" field="fldc_6"/>
        <Column header="Degraded. Further degradation is expected" field="fldc_7"/>
      </Row>
    </ColumnGroup>
  )

  return (
    <DataTable 
      emptyMessage="No entries were found." 
      scrollable
      value={values} 
      headerColumnGroup={headerGroup}>
        <Column field="class" body={(rowData) => nameForClass(rowData.class)} />
        <Column field="degraded" body={(rowData) => formatHectares(rowData.degraded)}/>
        <Column field="stable" body={(rowData) => formatHectares(rowData.stable)}/>
        <Column field="improved" body={(rowData) => formatHectares(rowData.improved)}/>
        <Column field="fldc_1" body={(rowData) => formatHectares(rowData.fldc_1)}/>
        <Column field="fldc_2" body={(rowData) => formatHectares(rowData.fldc_2)}/>
        <Column field="fldc_3" body={(rowData) => formatHectares(rowData.fldc_3)}/>
        <Column field="fldc_4" body={(rowData) => formatHectares(rowData.fldc_4)}/>
        <Column field="fldc_5" body={(rowData) => formatHectares(rowData.fldc_5)}/>
        <Column field="fldc_6" body={(rowData) => formatHectares(rowData.fldc_6)}/>
        <Column field="fldc_7" body={(rowData) => formatHectares(rowData.fldc_7)}/>
    </DataTable>
  )
};

export default FLDTable;
