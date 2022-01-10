import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Menubar } from 'primereact/menubar';

import LandUse from './LandUse';

const getMenuItemClasses = (index, currentIndex) => {
  let classNames = 'p-button p-component p-button-text p-mr-2';
  if (index !== currentIndex) {
    classNames += ' p-button-secondary';
  } else {
    classNames += ' p-text-bold';
  }
  return classNames;
};

const PlanForLDN = () => {
  const { t } = useTranslation();
  const [menuIndex, setMenuIndex] = useState(0);

  const menuItemTemplate = (item, options) => (
    <button
      type="button"
      className={getMenuItemClasses(item.index, menuIndex)}
      target={item.target}
      onClick={options.onClick}
    >
      <span className={options.iconClassName} />
      <span className={options.labelClassName}>{item.label}</span>
    </button>
  );

  const menuItems = [
    {
      index: 0,
      label: t('LAND_USE'),
      icon: 'pi pi-fw pi-angle-right',
      command: () => setMenuIndex(0),
      template: menuItemTemplate,
    },
    {
      index: 1,
      label: t('LAND_MANAGEMENT'),
      icon: 'pi pi-fw pi-angle-right',
      command: () => setMenuIndex(1),
      template: menuItemTemplate,
    },
    {
      index: 2,
      label: t('SOIL_ORGANIC_CARBON'),
      icon: 'pi pi-fw pi-angle-right',
      command: () => setMenuIndex(2),
      template: menuItemTemplate,
    },
  ];

  return (
    <>
      {/* to eliminate default tab padding */}
      <div style={{ marginLeft: '-1rem', marginRight: '-1rem' }}>
        <Menubar model={menuItems} />
        <div className="p-py-4">
          {menuIndex === 0 && (
            <LandUse />
          )}
          {menuIndex === 1 && (
            <span>Land Management</span>
          )}
          {menuIndex === 2 && (
            <span>Soil Organic Carbon</span>
          )}
        </div>
      </div>
    </>
  );
};

export default PlanForLDN;
