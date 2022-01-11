import { Button } from 'primereact/button';
import { DataView } from 'primereact/dataview';
import { InputText } from 'primereact/inputtext';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getWocatTechnologies } from '../../services/landuse';
import { ToastContext } from '../../store';
import { handleError } from '../../utilities/errors';

const LandManagement = () => {
  const { t } = useTranslation();
  const { setError } = useContext(ToastContext);

  // Chunk size for each search.
  const ITEMS_CHUNK_SIZE = 10;

  // State related.
  const [isLoading, setIsLoading] = useState(false);

  // Search related.
  const [keyword, setKeyword] = useState('');

  // Pagination.
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  // Data.
  const [technologies, setTechnologies] = useState([]);

  const onSearch = async (e) => {
    e?.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await getWocatTechnologies(
        keyword,
        currentPage * ITEMS_CHUNK_SIZE,
        ITEMS_CHUNK_SIZE
      );
      setTechnologies(data?.items || []);
      setTotal(data?.total || 0);
    } catch (error) {
      setError(handleError(error));
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (keyword !== '') {
      onSearch();
    }
  }, [currentPage]); // eslint-disable-line

  const header = (
    <div className="p-grid p-formgrid">
      <div className="p-col-6 p-d-flex p-ai-center">
        <h5 className="p-mb-0">{t('APPLICABLE_WOCAT_SLM_TECHNOLOGIES')}</h5>
      </div>
      <div className="p-col-6">
        <form onSubmit={onSearch}>
          <div className="p-grid p-formgrid p-fluid">
            <label className="p-col-2 p-d-flex p-ai-center p-jc-end" htmlFor="keyword">
              {t('SEARCH')}:
            </label>
            <div className="p-col-10">
              <span className="p-input-icon-right">
                <i className="pi pi-search p-pr-1" />
                <InputText
                  value={keyword}
                  placeholder={t('ENTER_KEYWORD')}
                  id="keyword"
                  disabled={isLoading}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );

  const itemTemplate = (tech) => (
    <div className="p-col-12">
      <div className="p-d-flex p-ai-center">
        <div className="p-col-2 p-text-center">
          <img
            style={{ width: '250px', maxWidth: '100%' }}
            src={tech?.images[0]?.url}
            alt={tech?.images[0]?.caption}
          />
        </div>
        <div className="p-col-8">
          <div className="p-px-4">
            <a href={tech?.url || '#'} target="_blank" rel="noreferrer noopener">
              <h5>
                {tech?.name || ''} - {tech?.location || ''}
              </h5>
            </a>
            <p className="p-pr-4">{tech?.definition || ''}</p>
            <div className="p-grid">
              <span className="p-col">
                <a
                  className="p-d-flex p-ai-center"
                  href={tech?.map_url || '#'}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <i className="pi pi-map-marker" />
                  <span className="p-ml-2">
                    {tech?.location || 'N/A'}, {tech?.province || 'N/A'}
                  </span>
                </a>
              </span>
            </div>
          </div>
        </div>
        <div className="p-col-2">
          <Button label="Map" className="p-button-secondary p-d-block" icon="pi pi-map-marker" />
          <Button label="Choose" className="p-my-2 p-d-block" icon="pi pi-check" />
        </div>
      </div>
    </div>
  );

  return (
    <DataView
      paginator
      rows={ITEMS_CHUNK_SIZE}
      totalRecords={total}
      lazy
      paginatorPosition="both"
      first={currentPage * ITEMS_CHUNK_SIZE}
      value={technologies}
      onPage={(e) => setCurrentPage(e?.page || 0)}
      header={header}
      itemTemplate={itemTemplate}
      loading={isLoading}
      emptyMessage={t('NO_WOCAT_TECHNOLOGIES_FOUND')}
    />
  );
};

export default LandManagement;
