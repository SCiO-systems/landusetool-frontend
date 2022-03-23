import React, { useState, useEffect, useContext, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputNumber } from 'primereact/inputnumber';
import { FileUpload } from 'primereact/fileupload';
import { Button } from 'primereact/button';
import { ToggleButton } from 'primereact/togglebutton';
import { useTranslation } from 'react-i18next';

import { findIntersectingArea } from '../services/projects';
import { uploadProjectFile, deleteFile } from '../services/files';
import { ToastContext } from '../store';
import { handleError } from '../utilities/errors';

const ScenarioTransitionMatrix = ({ inputScenario, onSave, projectId, isUpdating }) => {
  const { t } = useTranslation();
  const [expandedRows, setExpandedRows] = useState([]);
  const [scenarioStart, setScenarioStart] = useState(null);
  const [scenarioEnd, setScenarioEnd] = useState(null);
  const [scenario, setScenario] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [processionPolygonForId, setProcessionPolygonForId] = useState(-1);
  const [scenarioName, setScenarioName] = useState(null)
  const [onChecked, setOnChecked] = useState(false)
  const [canSave, setCanSave] = useState(true)
  const { setError, setSuccess } = useContext(ToastContext);
  const fileUploadRefs = useRef({});

  useEffect(() => {
    if (inputScenario !== undefined) {
      setScenarioName(inputScenario.scenarioName);
      setScenario(inputScenario.landTypes);
      setScenarioStart(inputScenario.scenarioPeriod.scenarioStart);
      setScenarioEnd(inputScenario.scenarioPeriod.scenarioEnd);
    }
  }, [inputScenario]);

  const format = (num, decimals) => num.toFixed(decimals).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')

  const onEditorValueChange = (props, value, landId, fileId = null) => {
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

    if (fileId !== null) {
      row.breakDown[props.rowIndex].landCoverage.file_id = fileId;
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

    setOnChecked(false);
    setScenario([...scenario]);
  }

  const coverageEditor = (props, landId) => {
    const row = scenario.find((item) => item.landId === landId);

    const { value } = props.rowData.landCoverage;

    return <InputNumber
      value={props.rowData.landCoverage.value}
      onValueChange={(e) => onEditorValueChange(props, e.value, landId)}
      disabled={isUploading || processionPolygonForId === (`${landId}${props.rowData.landId}`)}
      min={0} max={row.breakDownLimit.value + value} showButtons
      suffix="ha"
    />

  }

  const uploadFile = async (props, landTypeId, files) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', files[0]);
    let fileId = null;
    let shouldDeleteFile = false;
    try {
      const { data: res } = await uploadProjectFile(projectId, formData);
      fileId = res.id;
      setIsUploading(false);
      const uniqueButton = `${landTypeId}${props.rowData.landId}`;
      fileUploadRefs.current[uniqueButton]?.clear();
      setProcessionPolygonForId(uniqueButton);
      const { hectares } = await findIntersectingArea(projectId, fileId);
      if (hectares <= 0) {
        setError('This polygon does not belong to the region of interest for this project.');
        shouldDeleteFile = true;
      } else {
        const row = scenario.find((item) => item.landId === landTypeId);
        const { value } = props.rowData.landCoverage;
        const max = row.breakDownLimit.value + value;
        if (hectares > max) {
          setError('The hectares of this polygon are greater than the available area.');
          shouldDeleteFile = true;
        } else {
          onEditorValueChange({ ...props }, hectares, landTypeId, fileId);
          setSuccess('Done', 'Polygon has been applied to this transition.');
        }
      }
    } catch (error) {
      setError(handleError(error));
    } finally {
      setProcessionPolygonForId(-1);
      setIsUploading(false);
    }

    if (fileId !== null && shouldDeleteFile) {
      try {
        await deleteFile(projectId, fileId);
      } catch (error) {
        // eslint-disable-next-line
        console.error(error); // fail silently
      }
    }
  };

  const requiredValidator = () => true

  const uploadButton = (props, landTypeId) => (
    <div className="p-d-flex p-jc-end">
      {props.rowData?.landCoverage?.file_id && (
        <Button
          icon='pi pi-check-circle'
          label=""
          style={{ cursor: 'default' }}
          tooltip="A polygon has already been submitted for this land type."
          tooltipOptions={{ position: 'top' }}
          type="button"
          onClick={() => {}}
          className="p-button p-button-success p-mr-2"
        />
      )}
      <FileUpload
        ref={(ref) => { fileUploadRefs.current[`${landTypeId}${props.rowData.landId}`] = ref; }}
        disabled={isUploading || processionPolygonForId === (`${landTypeId}${props.rowData.landId}`)}
        accept=".geojson"
        chooseLabel=""
        chooseOptions={{
          label: (processionPolygonForId === (`${landTypeId}${props.rowData.landId}`))
            ? t('PROCESSING_POLYGON')
            : '',
          icon: (processionPolygonForId === (`${landTypeId}${props.rowData.landId}`)) ? 'pi pi-spin pi-spinner' : 'pi pi-upload',
          iconOnly: (processionPolygonForId !== (`${landTypeId}${props.rowData.landId}`)),
          className: (processionPolygonForId !== (`${landTypeId}${props.rowData.landId}`))
            ? `p-button-icon-only`
            : ``,
        }}
        icon="fad fa-upload"
        mode="basic"
        multiple={false}
        customUpload
        auto
        uploadHandler={(event) => uploadFile(props, landTypeId, event.files)}
      />
    </div>
  );

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
          style={{ textAlign: 'right' }}
          body={startCoverageHeader}
          editorValidatorEvent="blur"
          editor={(props) => coverageEditor(props, landType.landId)}
          editorValidator={(props) => requiredValidator(props)}
        />
        <Column
          field="upload"
          header=""
          body={(_data, props) => uploadButton(props, landType.landId)}
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
        <Button
          icon={`pi ${isCollapsed ? 'pi-angle-right' : 'pi-angle-down'}`}
          className="p-togglebutton p-mr-2"
          label={isCollapsed ? t('EXPAND') : t('COLLAPSE')}
          onClick={() => setIsCollapsed((v) => !v)}
        />
        <ToggleButton
          onLabel={t('SAVED')}
          offLabel={t('SAVE_CHANGES')}
          onIcon="fad fa-check"
          offIcon="fad fa-save"
          className="g-save"
          checked={onChecked}
          tabIndex="false"
          disabled={!canSave}
          onChange={(e) => saveStatus(e.value)} />
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
