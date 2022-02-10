import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { ToggleButton } from 'primereact/togglebutton';
import { useTranslation } from 'react-i18next';

const ScenarioTransitionMatrix = ({ inputScenario, onSave, isUpdating }) => {
  const { t } = useTranslation();
  const [expandedRows, setExpandedRows] = useState([]);
  const [scenarioStart, setScenarioStart] = useState(null);
  const [scenarioEnd, setScenarioEnd] = useState(null);
  const [scenario, setScenario] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [scenarioName, setScenarioName] = useState(null)
  const [onChecked, setOnChecked] = useState(false)
  const [canSave, setCanSave] = useState(true)

  useEffect(() => {
    if (inputScenario !== undefined) {
      setScenarioName(inputScenario.scenarioName);
      setScenario(inputScenario.landTypes);
      setScenarioStart(inputScenario.scenarioPeriod.scenarioStart);
      setScenarioEnd(inputScenario.scenarioPeriod.scenarioEnd);
    }
  }, [inputScenario]);

  const format = (num, decimals) => num.toFixed(decimals).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')

  const onEditorValueChange = (props, value, landId) => {
    const row = scenario.find((item) => item.landId === landId);

    const endRow = scenario.find((item) => item.landId === props.rowData.landId);

    const fluent_breakDown = row.breakDownLimit.value + row.breakDown[props.rowIndex].landCoverage.value;

    if (fluent_breakDown <= value) {
      row.breakDown[props.rowIndex].landCoverage.value = fluent_breakDown;
      row.breakDownLimit.value = 0;
    } else {
      row.breakDown[props.rowIndex].landCoverage.value = value;
      row.breakDownLimit.value = fluent_breakDown - value;
    }

    // SUM
    let sumBaseline = 0;
    scenario.forEach(
      (item) => {
        if (item.landId !== landId) {
          item.breakDown.forEach(
            (breakDownItem) => {
              if (breakDownItem.landId === landId) {
                sumBaseline += breakDownItem.landCoverage.value;
              }
            }
          )
        }
      }
    )
    row.endLandCoverage.value = row.breakDownLimit.value + sumBaseline;

    let sumEditline = 0;
    scenario.forEach(
      (item) => {
        if (item.landId !== props.rowData.landId) {
          item.breakDown.forEach(
            (breakDownItem) => {
              if (breakDownItem.landId === props.rowData.landId) {
                sumEditline += breakDownItem.landCoverage.value;
              }
            }
          )
        }
      }
    )
    endRow.endLandCoverage.value = endRow.breakDownLimit.value + sumEditline;

    if (!canSave) {
      setCanSave(true);
    }

    setScenario([...scenario]);
  }

  const coverageEditor = (props, landId) => {
    // setOnChecked
    if (onChecked === true) {
      return <InputNumber
        value={props.rowData.landCoverage.value}
        showButtons
        suffix="ha"
      />
    }

    const row = scenario.find((item) => item.landId === landId);

    const { value } = props.rowData.landCoverage;

    return <InputNumber
      value={props.rowData.landCoverage.value}
      onValueChange={(e) => onEditorValueChange(props, e.value, landId)}
      min={0} max={row.breakDownLimit.value + value} showButtons
      suffix="ha"
    />

  }

  const requiredValidator = () => true

  const uploadButton = () => <Button label="" tooltip="Upload a polygon for this transition" icon="fad fa-upload" />

  const rowExpansionTemplate = (landType) => (
    <div className="orders-subtable datatable-editing-demo">
      <DataTable
        value={landType.breakDown}
        className="editable-cells-table"
        rowHover
      >
        <Column
          field="landType"
          header={t('BECOMES')}
        />
        <Column
          field="landCoverage"
          header=""
          body={startCoverageHeader}
          editorValidatorEvent="blur"
          editor={(props) => coverageEditor(props, landType.landId)}
          editorValidator={(props) => requiredValidator(props)}
        />
        <Column
          field="upload"
          header=""
          body={uploadButton}
          headerStyle={{ width: '6em', textAlign: 'center' }}
          bodyStyle={{ textAlign: 'center', overflow: 'visible' }}
        />
      </DataTable>
    </div>
  );

  const saveStatus = (e) => {
    onSave(
      { ...inputScenario, landTypes: scenario }
    );
    setOnChecked(e);
    setCanSave(false);
  }

  const scenarioTableHeader = (
    <div className="p-d-flex p-jc-between p-ai-center">
      <div>
        <h4 className="p-mb-0 p-ml-3">{scenarioName}</h4>
      </div>
      <div>
        <ToggleButton
          onLabel={t('SAVED')}
          offLabel={t('SAVE_CHANGES')}
          onIcon="fad fa-check"
          offIcon="fad fa-save"
          className="g-save"
          checked={onChecked}
          disabled={!canSave}
          tabIndex={-1}
          onChange={(e) => saveStatus(e.value)} />
        <Button
          icon={`pi ${isCollapsed ? 'pi-angle-right' : 'pi-angle-down'}`}
          className="p-togglebutton p-ml-2"
          label={isCollapsed ? t('EXPAND') : t('COLLAPSE')}
          onClick={() => setIsCollapsed((v) => !v)}
        />
      </div>
    </div>
  );

  const startCoverageHeader = (landType) => {
    const startingCoverage = `${format(landType.landCoverage.value, 2)} ${landType.landCoverage.unit}`;
    return startingCoverage;
  }

  const endCoverageHeader = (landType) => {
    const endCoverage = `${format(landType.endLandCoverage.value, 2)} ${landType.landCoverage.unit}`;
    return endCoverage;
  }

  return (
    <div>
      <div className="scenario-transition-matrix">
        {scenario && (
          <DataTable
            loading={isUpdating}
            value={scenario}
            expandedRows={expandedRows}
            className="stm-parent-dt"
            dataKey="landId"
            onRowToggle={(e) => setExpandedRows(e.data)}
            header={scenarioTableHeader}
            rowExpansionTemplate={rowExpansionTemplate}
            rowHover
          >
            {!isCollapsed && (<Column expander headerStyle={{ width: '3rem' }} />)}
            {!isCollapsed && (<Column field="landType" header="Land Type" />)}
            {!isCollapsed && (<Column style={{ textAlign: 'right' }} field="landCoverage" header={scenarioStart} body={startCoverageHeader} />)}
            {!isCollapsed && (<Column style={{ textAlign: 'right' }} field="landCoverage" header={scenarioEnd} body={endCoverageHeader} />)}
          </DataTable>
        )}
      </div>
    </div>
  );
}

export default ScenarioTransitionMatrix;
