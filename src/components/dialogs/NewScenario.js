import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { InputMask } from 'primereact/inputmask';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const NewScenarioDialog = ({ minYear, maxYear, prepareScenario, dialogOpen, setDialogOpen }) => {
  const { t } = useTranslation();
  const [startYear, setStartYear] = useState(minYear);
  const [endYear, setEndYear] = useState(maxYear);

  useEffect(() => {
    setStartYear(minYear);
  }, [minYear])

  return (
    <Dialog
      header={t('NEW_SCENARIO')}
      visible={dialogOpen}
      style={{ width: '500px' }}
      onHide={() => setDialogOpen(false)}
    >
      <div className="p-fluid">
        <div className="p-formgrid p-grid">
          <div className="p-col-12">
            <div className="p-field">
              <label htmlFor="start_year">{t('START_YEAR')}</label>
              <br />
              <InputMask
                id="start_year"
                mask="9999"
                slotChar="yyyy"
                value={startYear}
                onChange={(e) => setStartYear(e.value)}
                disabled
              />
            </div>
          </div>
          <div className="p-col-12">
            <div className="p-field">
              <label htmlFor="end_year">{t('END_YEAR')}</label>
              <br />
              <InputNumber
                value={endYear}
                onValueChange={(e) => setEndYear(e.value)}
                showButtons
                buttonLayout="horizontal"
                decrementButtonClassName="p-button-danger"
                incrementButtonClassName="p-button-success"
                incrementButtonIcon="fad fa-plus"
                decrementButtonIcon="fad fa-minus"
                mode="decimal"
                useGrouping={false}
                min={startYear + 1}
                max={maxYear}
              />
            </div>
          </div>
          <div className="p-col-12 p-text-center p-mt-3">
            <div className="p-d-inline-flex p-col-6 p-ai-center p-jc-center">
              <Button
                label={t('CREATE_NEW')}
                icon="fad fa-calendar-plus"
                onClick={() => {
                  prepareScenario(startYear, endYear);
                  setDialogOpen(false);
                }}
                autoFocus
              />
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default NewScenarioDialog;
