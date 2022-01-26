import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { RadioButton } from 'primereact/radiobutton';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const RadioFields = ({ useDefaultData, setUseDefaultData }) => {
  const { t } = useTranslation();

  return (
    <div className="p-col-12">
      <div className="p-field-radiobutton">
        <RadioButton
          inputId="default-data"
          onChange={() => setUseDefaultData(true)}
          checked={useDefaultData}
        />
        <label htmlFor="default-data">
          {t('USE_DEFAULT_DATA')} (
          <a
            href="https://core.ac.uk/download/pdf/15477943.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            Global Land System (GLS)
          </a>
          )
        </label>
      </div>
      <div className="p-field-radiobutton">
        <RadioButton
          inputId="custom-data"
          onChange={() => setUseDefaultData(false)}
          checked={!useDefaultData}
        />
        <label htmlFor="custom-data">{t('USE_CUSTOM_DATA')}</label>
      </div>
    </div>
  );
};

const LandUseSuitabilityTable = ({ data }) => {
  const { t } = useTranslation();

  // The template for rendering each column.
  const valueTemplate = ({ value, percentage }) => (
    <div style={{ textAlign: 'right' }}>
      {Number(value).toFixed(2)} {'ha '} ({Number(percentage).toFixed(2)}%)
    </div>
  );

  return (
    <DataTable
      value={data}
      className="p-datatable-gridlines p-datatable-striped"
      rows={10}
      dataKey="id"
      rowHover
      editMode="row"
    >
      <Column rowSpan={2} field="luType" header="LU Type in ROI" body={valueTemplate} />
      <Column
        style={{ textAlign: 'center' }}
        field="suitable"
        header={t('SUITABLE')}
        body={valueTemplate}
      />
      <Column
        style={{ textAlign: 'center' }}
        field="partiallySuitable"
        header={t('PARTIALLY_SUITABLE')}
        body={valueTemplate}
      />
      <Column
        style={{ textAlign: 'center' }}
        field="nonSuitable"
        header={t('NON_SUITABLE')}
        body={valueTemplate}
      />
    </DataTable>
  );
};

const LandUseSuitability = () => {
  // State related.
  const [useDefaultData, setUseDefaultData] = useState(true);
  // TODO: Fix the following
  // eslint-disable-next-line
  const [data, setData] = useState([]);

  useEffect(() => {
    // TODO: Fetch data from the backend.
  }, []); // eslint-disable-line

  return (
    <>
      <RadioFields useDefaultData={useDefaultData} setUseDefaultData={setUseDefaultData} />
      <LandUseSuitabilityTable data={data} />
    </>
  );
};

export default LandUseSuitability;
