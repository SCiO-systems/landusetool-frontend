import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useTranslation } from 'react-i18next';

import { generateLUImpactMatrixSchema } from '../utilities/schema-generators';

const StatusEditor = ({ rowData, field, onStatusEditorValueChange }) => {
  const { t } = useTranslation();
  const [dropdownValue, setDropdownValue] = useState('');

  useEffect(() => {
    rowData.row.forEach((item) => {
      if (item.id === field) {
        setDropdownValue(item.value);
      }
    });
  }, [setDropdownValue, field, rowData.row]);

  const statuses = [
    { label: t('IMPROVEMENT'), value: '+' },
    { label: t('STABLE'), value: '' },
    { label: t('DEGRADATION'), value: '-' },
  ];

  return (
    <Dropdown
      value={dropdownValue}
      options={statuses}
      onChange={(e) => {
        setDropdownValue(e.value);
        onStatusEditorValueChange(rowData, field, e.value);
      }}
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

const TransitionImpactMatrix = ({ currentProject, title }) => {
  const { t } = useTranslation();
  const [landCoverItem, setLandCoverItem] =
    useState(
      generateLUImpactMatrixSchema(currentProject.lu_classes, currentProject.uses_default_lu_classification)
  );
  const [selectedlandCoverItem, setSelectedlandCoverItem] = useState(null);
  const [trendsEarthStatus, setTrendsEarthStatus] = useState(true);

  const loadTrendsEarthDefault = () => {
    setLandCoverItem(
      generateLUImpactMatrixSchema(currentProject.lu_classes, currentProject.uses_default_lu_classification)
    );
    setTrendsEarthStatus(true);
  };

  const onStatusRowEditSave = ({ data }) => {
    const landCoverItemLocal = [...landCoverItem];
    const updatedLandCoverItem = landCoverItemLocal.map(
      (item) => {
        if (item.id === data.id) {
          item.row.forEach(
            (itemRow) => {
              if (data[itemRow.id] !== undefined) {
                itemRow.value = data[itemRow.id];
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

  const statusEditor = ({ rowData, field }) => (
    <StatusEditor
      rowData={rowData}
      field={field}
      onStatusEditorValueChange={onStatusEditorValueChange}
    />
  )

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
      <div className="p-d-flex p-justify-between p-ai-center p-py-2 p-px-2">
        <div>
          <h4 className="p-mb-0">{title}</h4>
        </div>
        {currentProject.uses_default_lu_classification && (
          <div>
            <Button
              icon="pi pi-refresh"
              label={t('LOAD_TRENDS_EARTH_DEFAULTS')}
              onClick={loadTrendsEarthDefault}
              disabled={trendsEarthStatus}
            />
          </div>
        )}
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
      {landCoverItem.map((lci, index) => (
        <Column
          key={lci.id}
          header={lci.name}
          editor={(props) => statusEditor(props)}
          body={(rowData) => statusColumn(rowData, index)}
        />
      ))}
      <Column rowEditor headerStyle={{ width: '7rem' }} bodyStyle={{ textAlign: 'center' }} />
    </DataTable>
  );
};

export default TransitionImpactMatrix;
