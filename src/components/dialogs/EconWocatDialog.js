import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Loading from '../Loading';
import SLMCostsGraph from '../charts/SLMCostsGraph';
import LikertScale from '../FocusAreaQuestionnaire/LikertScale';

const EconWocatDialog = ({ visible, setVisible, techData, setTechData }) => {
  const { t } = useTranslation();

  const dataKeys = [
    {
      title: 'Main purpose',
      key: 'main_purpose',
    },
    {
      title: 'Degradation Addressed',
      key: 'degradation_addressed',
    },
    {
      title: 'Total present value 2.5% ($/ha)',
      key: 'total_present_value_25',
    },
    {
      title: 'Annuity costs 2.5% ($/ha)',
      key: 'annuity_cost_25',
    },
  ];

  return (
    <Dialog
      header={t('COSTS_AND_BENEFITS_OF_SLM_TECHNOLOGIES')}
      visible={visible}
      style={{ width: '900px' }}
      draggable={false}
      maximizable
      modal
      onHide={() => {
        setVisible(false);
        setTechData(null);
      }}
    >
      <div className="p-grid p-formgrid">
        {!techData && visible && (
          <div className="p-col-12 p-mt-5">
            <Loading />
          </div>
        )}
        {techData && (
          <>
            <div className="p-col-12">
              <DataTable id="techdata-table" value={dataKeys} header={null}>
                <Column 
                  headerStyle={{ display: 'none' }} 
                  field="title" 
                  body={({ title }) => <strong>{title}</strong>} 
                />
                <Column 
                  headerStyle={{ display: 'none' }} 
                  body={({ key }) => techData[key]} 
                />
              </DataTable>
            </div>
            <div className="p-col-12 p-mt-4">
              <SLMCostsGraph data={techData} />
            </div>
            <div className="p-col-12 p-mt-4">
              <div className="p-grid p-mt-2">
                <div className="p-col-6">
                  <h5>
                    Socio Economic Production
                  </h5>
                  <LikertScale
                    id='socio_economic_production'
                    initialScale={Number(techData?.socio_economic_production)}
                    readOnly
                  />
                </div>
                <div className="p-col-6">
                  <h5>
                    Socio Economic Water
                  </h5>
                  <LikertScale
                    id='socio_economic_water'
                    initialScale={Number(techData?.socio_economic_water)}
                    readOnly
                  />
                </div>
                <div className="p-col-6 p-mt-4">
                  <h5>
                    Socio Economic Income
                  </h5>
                  <LikertScale
                    id='socio_economic_income'
                    initialScale={Number(techData?.socio_economic_income)}
                    readOnly
                  />
                </div>
                <div className="p-col-6 p-mt-4">
                  <h5>
                    Socio Cultural
                  </h5>
                  <LikertScale
                    id='socio_economic_cultural'
                    initialScale={Number(techData?.socio_economic_cultural)}
                    readOnly
                  />
                </div>
                <div className="p-col-6 p-mt-4">
                  <h5>
                    Ecological Water
                  </h5>
                  <LikertScale
                    id='ecological_water'
                    initialScale={Number(techData?.ecological_water)}
                    readOnly
                  />
                </div>
                <div className="p-col-6 p-mt-4">
                  <h5>
                    Ecological Soil
                  </h5>
                  <LikertScale
                    id='ecological_soil'
                    initialScale={Number(techData?.ecological_soil)}
                    readOnly
                  />
                </div>
                <div className="p-col-6 p-mt-4">
                  <h5>
                    Ecological Climate &amp; Disaster Risk Resistance
                  </h5>
                  <LikertScale
                    id='ecological_climate_disaster'
                    initialScale={Number(techData?.ecological_climate_disaster)}
                    readOnly
                  />
                </div>
                <div className="p-col-6 p-mt-4">
                  <h5>
                    Ecological Biodiversity
                  </h5>
                  <LikertScale
                    id='ecological_biodiversity'
                    initialScale={Number(techData?.ecological_biodiversity)}
                    readOnly
                  />
                </div>
              </div> 
              <div className="p-mt-4">
                <small>
                  <span className="likert-legend strongly_agree p-mr-2" /> Very positive (+50-100%) &nbsp;
                  <span className="likert-legend agree p-mr-2" />  Positive (+20-50%) &nbsp;
                  <span className="likert-legend somewhat_agree p-mr-2" />  Slightly positive (+5-20%)&nbsp;                  
                  <span className="likert-legend neither_agree_or_disagree p-mr-2" />  Negligible impact (-5-+5%) &nbsp;
                  <span className="likert-legend somewhat_disagree p-mr-2" />  Slightly negative (-5-20%) <br />
                  <span className="likert-legend disagree p-mr-2" />  Negative (-20-50%) &nbsp;
                  <span className="likert-legend strongly_disagree p-mr-2" />  Very negative (-50-100%) &nbsp;
                </small>
              </div>
            </div>
          </>
        )}
      </div>
    </Dialog>
  );
};

export default EconWocatDialog;
