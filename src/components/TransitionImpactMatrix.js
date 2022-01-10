import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useTranslation } from 'react-i18next';

import landCoverDefaults from '../data/land-cover-defaults';

const TransitionImpactMatrix = () => {
  const { t } = useTranslation();
  const [landCoverItem, setLandCoverItem] = useState(landCoverDefaults);
  const [selectedlandCoverItem, setSelectedlandCoverItem] = useState(null);
  const [trendsEarthStatus, setTrendsEarthStatus] = useState(true);

  const loadTrendsEarthDefault = () => {
    setLandCoverItem(landCoverDefaults);
    setTrendsEarthStatus(true);
  };

  const onStatusRowEditSave = ({ data }) => {
    const landCoverItemLocal = [...landCoverItem];
    const updatedLandCoverItem = landCoverItemLocal.map(
      (item) => {
        if (item.id === data.id) {
          item.row.forEach(
            (itemRow) => {
              const idRow = itemRow.id;
              if (idRow === 'treecovered') {
                if (data.treecovered !== undefined) {
                  itemRow.value = data.treecovered;
                }
              } else if (idRow === 'grassland') {
                if (data.grassland !== undefined) {
                  itemRow.value = data.grassland;
                }
              } else if (idRow === 'cropland') {
                if (data.cropland !== undefined) {
                  itemRow.value = data.cropland;
                }
              } else if (idRow === 'wetland') {
                if (data.wetland !== undefined) {
                  itemRow.value = data.wetland;
                }
              } else if (idRow === 'artificialarea') {
                if (data.artificialarea !== undefined) {
                  itemRow.value = data.artificialarea;
                }
              } else if (idRow === 'bareland') {
                if (data.bareland !== undefined) {
                  itemRow.value = data.bareland;
                }
              } else if (idRow === 'waterbody') {
                if (data.waterbody !== undefined) {
                  itemRow.value = data.waterbody;
                }
              }
            }
          );
        }
        return item;
      }
    );

    setTrendsEarthStatus(false);
    setLandCoverItem([...updatedLandCoverItem]);
  };

  const onStatusEditorValueChange = (rowData, field, value) => {
    rowData.row.forEach((item) => {
      if (item.id === field) {
        item.value = value;
      }
    });
  };

  const statusEditor = ({ rowData, field }) => {
    let selectValue = '';
    rowData.row.forEach((item) => {
      if (item.id === field) {
        selectValue = item.value;
      }
    });

    const statuses = [
      { label: t('IMPROVEMENT'), value: '+' },
      { label: t('STABLE'), value: '' },
      { label: t('DEGRADATION'), value: '-' },
    ];

    return (
      <Dropdown
        value={selectValue}
        options={statuses}
        onChange={
          (e) => {
            onStatusEditorValueChange(rowData, field, e.value);
          }
        }
        style={{ width: '100%' }}
        placeholder={t('SELECT_STATUS')}
        itemTemplate={(option) => {
          let classBadge = 'lowstock';
          if (option.value === '+') {
            classBadge = 'instock';
          } else if (option.value === '-') {
            classBadge = 'outofstock';
          }

          return <span className={`product-badge status-${classBadge}`}>{option.label}</span>;
        }}
      />
    );
  };

  const statusColumn = (data, index) => {
    let className = 'medium';

    if (data.row[index].value === '-') {
      className = 'low';
    } else if (data.row[index].value === '+') {
      className = 'high';
    }

    return (
      <div className={className} style={{ textAlign: 'center' }}>
        {data.row[index].value}
      </div>
    );
  };

  const landCoverTableHeader = (
    <div className="table-header">
      <div>
        <div className="p-grid p-col-12 p-justify-end">
          <Button
            label={t('LOAD_TRENDS_EARTH_DEFAULTS')}
            onClick={loadTrendsEarthDefault}
            disabled={trendsEarthStatus}
          />
        </div>
      </div>
    </div>
  );

  return (
    <DataTable
      value={landCoverItem}
      className="p-datatable-gridlines p-datatable-striped p-datatable-sm p-datatable-customers"
      rows={10}
      dataKey="id"
      rowHover
      selection={selectedlandCoverItem}
      editMode="row"
      onSelectionChange={(e) => setSelectedlandCoverItem(e.value)}
      header={landCoverTableHeader}
      onRowEditSave={onStatusRowEditSave}
    >
      <Column
        field="name"
        header=""
      />
      <Column
        field="treecovered"
        header="Tree-covered"
        editor={(props) => statusEditor(props)}
        body={(rowData) => statusColumn(rowData, 0)}
      />
      <Column
        field="grassland"
        header="Grassland"
        editor={(props) => statusEditor(props)}
        body={(rowData) => statusColumn(rowData, 1)}
      />
      <Column
        field="cropland"
        header="Cropland"
        editor={(props) => statusEditor(props)}
        body={(rowData) => statusColumn(rowData, 2)}
      />
      <Column
        field="wetland"
        header="Wetland"
        editor={(props) => statusEditor(props)}
        body={(rowData) => statusColumn(rowData, 3)}
      />
      <Column
        field="artificialarea"
        header="Artificial area"
        editor={(props) => statusEditor(props)}
        body={(rowData) => statusColumn(rowData, 4)}
      />
      <Column
        field="bareland"
        header="Bare land"
        editor={(props) => statusEditor(props)}
        body={(rowData) => statusColumn(rowData, 5)}
      />
      <Column
        field="waterbody"
        header="Water body"
        editor={(props) => statusEditor(props)}
        body={(rowData) => statusColumn(rowData, 6)}
      />
      <Column rowEditor headerStyle={{ width: '7rem' }} bodyStyle={{ textAlign: 'center' }} />
    </DataTable>
  );
};

export default TransitionImpactMatrix;
