import { Menubar } from 'primereact/menubar';
import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { UserContext } from '../../store';
import LandManagement from './LandManagement';
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
  const { currentProject } = useContext(UserContext);

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
  ];

  if (currentProject.land_management_sustainability_method) {
    menuItems.push({
      index: 1,
      label: t('LAND_MANAGEMENT'),
      icon: 'pi pi-fw pi-angle-right',
      command: () => setMenuIndex(1),
      template: menuItemTemplate,
    });
  }

  return (
    <>
      {/* to eliminate default tab padding */}
      <div style={{ marginLeft: '-1rem', marginRight: '-1rem' }}>
        {menuItems.length > 1 && (
          <Menubar model={menuItems} className="p-mb-4" />
        )}
        <div className="p-pb-4">
          {menuIndex === 0 && <LandUse />}
          {menuIndex === 1 && <LandManagement />}
        </div>
      </div>
    </>
  );
};

export default PlanForLDN;
