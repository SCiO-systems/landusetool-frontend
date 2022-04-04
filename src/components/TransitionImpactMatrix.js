import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { ToggleButton } from 'primereact/togglebutton';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useTranslation } from 'react-i18next';

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

const TransitionImpactMatrix = ({ initialData, title, hasDefaultData, onSave }) => {
  const { t } = useTranslation();
  const [landCoverItem, setLandCoverItem] = useState(JSON.parse(JSON.stringify(initialData)));
  const [selectedlandCoverItem, setSelectedlandCoverItem] = useState(null);
  const [trendsEarthStatus, setTrendsEarthStatus] = useState(true);
  const [onChecked, setOnChecked] = useState(false);

  const loadTrendsEarthDefault = () => {
    setLandCoverItem(JSON.parse(JSON.stringify(initialData)));
    setTrendsEarthStatus(true);
  };

  const onStatusRowEditSave = ({ data }) => {
    const landCoverItemLocal = JSON.parse(JSON.stringify(landCoverItem));
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
    setLandCoverItem(updatedLandCoverItem);
  };

  const onStatusEditorValueChange = (rowData, field, value) => {
    rowData.row.forEach((item) => {
      if (item.id === field) {
        item.value = value;
      }
    });
  };

  const statusEditor = ({ rowData }, field) => (
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

  const handleSave = (checked) => {
    setOnChecked(checked);
    onSave(landCoverItem);
  };

  const landCoverTableHeader = (
    <div className="table-header">
      <div className="p-d-flex p-justify-between p-ai-center p-py-2 p-px-2">
        <div>
          <h4 className="p-mb-0">{title}</h4>
        </div>
        <div>
          {hasDefaultData && (
            <Button
              icon="pi pi-refresh"
              label={t('LOAD_TRENDS_EARTH_DEFAULTS')}
              onClick={loadTrendsEarthDefault}
              disabled={trendsEarthStatus}
            />
          )}
          <ToggleButton
            onLabel={t('SAVED')}
            offLabel={t('SAVE_CHANGES')}
            onIcon="fad fa-check"
            offIcon="fad fa-save"
            className="g-save p-ml-2"
            checked={onChecked}
            tabIndex="false"
            disabled={trendsEarthStatus}
            onChange={(e) => handleSave(e)}
          />
        </div>
      </div>
    </div>
  );

  return (
    <DataTable
      value={landCoverItem}
      className="p-datatable-gridlines p-datatable-striped p-datatable-sm p-datatable-customers"
      rows={(landCoverItem && landCoverItem.length) ? landCoverItem.length : 0}
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
          editor={(props) => statusEditor(props, lci.id)}
          body={(rowData) => statusColumn(rowData, index)}
        />
      ))}
      <Column rowEditor headerStyle={{ width: '7rem' }} bodyStyle={{ textAlign: 'center' }} />
    </DataTable>
  );
};

export default TransitionImpactMatrix;
