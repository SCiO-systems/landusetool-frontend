const landCoverDefaults = [
  {
    id: 'treecovered',
    name: 'Tree-covered',
    non_editable: 1,
    row: [
      {
        landType: 'Tree-covered',
        value: '',
        id: 'treecovered',
      },
      {
        landType: 'Grassland',
        value: '-',
        id: 'grassland',
      },
      {
        landType: 'Cropland',
        value: '-',
        id: 'cropland',
      },
      {
        landType: 'Wetland',
        value: '-',
        id: 'wetland',
      },
      {
        landType: 'Artificial area',
        value: '-',
        id: 'artificialarea',
      },
      {
        landType: 'Bare land',
        value: '-',
        id: 'bareland',
      },
      {
        landType: 'Water body',
        value: '',
        id: 'waterbody',
      },
    ],
  },
  {
    id: 'grassland',
    name: 'Grassland',
    non_editable: 2,
    row: [
      {
        landType: 'Tree-covered',
        value: '+',
        id: 'treecovered',
      },
      {
        landType: 'Grassland',
        value: '',
        id: 'grassland',
      },
      {
        landType: 'Cropland',
        value: '+',
        id: 'cropland',
      },
      {
        landType: 'Wetland',
        value: '-',
        id: 'wetland',
      },
      {
        landType: 'Artificial area',
        value: '-',
        id: 'artificialarea',
      },
      {
        landType: 'Bare land',
        value: '-',
        id: 'bareland',
      },
      {
        landType: 'Water body',
        value: '',
        id: 'waterbody',
      },
    ],
  },
  {
    id: 'cropland',
    name: 'Cropland',
    non_editable: 3,
    row: [
      {
        landType: 'Tree-covered',
        value: '+',
        id: 'treecovered',
      },
      {
        landType: 'Grassland',
        value: '-',
        id: 'grassland',
      },
      {
        landType: 'Cropland',
        value: '',
        id: 'cropland',
      },
      {
        landType: 'Wetland',
        value: '-',
        id: 'wetland',
      },
      {
        landType: 'Artificial area',
        value: '-',
        id: 'artificialarea',
      },
      {
        landType: 'Bare land',
        value: '-',
        id: 'bareland',
      },
      {
        landType: 'Water body',
        value: '',
        id: 'waterbody',
      },
    ],
  },
  {
    id: 'wetland',
    name: 'Wetland',
    non_editable: 4,
    row: [
      {
        landType: 'Tree-covered',
        value: '-',
        id: 'treecovered',
      },
      {
        landType: 'Grassland',
        value: '-',
        id: 'grassland',
      },
      {
        landType: 'Cropland',
        value: '-',
        id: 'cropland',
      },
      {
        landType: 'Wetland',
        value: '',
        id: 'wetland',
      },
      {
        landType: 'Artificial area',
        value: '-',
        id: 'artificialarea',
      },
      {
        landType: 'Bare land',
        value: '-',
        id: 'bareland',
      },
      {
        landType: 'Water body',
        value: '',
        id: 'waterbody',
      },
    ],
  },
  {
    id: 'artificialarea',
    name: 'Artificial area',
    non_editable: 5,
    row: [
      {
        landType: 'Tree-covered',
        value: '+',
        id: 'treecovered',
      },
      {
        landType: 'Grassland',
        value: '+',
        id: 'grassland',
      },
      {
        landType: 'Cropland',
        value: '+',
        id: 'cropland',
      },
      {
        landType: 'Wetland',
        value: '+',
        id: 'wetland',
      },
      {
        landType: 'Artificial area',
        value: '',
        id: 'artificialarea',
      },
      {
        landType: 'Bare land',
        value: '+',
        id: 'bareland',
      },
      {
        landType: 'Water body',
        value: '',
        id: 'waterbody',
      },
    ],

  },
  {
    id: 'bareland',
    name: 'Bare land',
    non_editable: 6,
    row: [
      {
        landType: 'Tree-covered',
        value: '+',
        id: 'treecovered',
      },
      {
        landType: 'Grassland',
        value: '+',
        id: 'grassland',
      },
      {
        landType: 'Cropland',
        value: '+',
        id: 'cropland',
      },
      {
        landType: 'Wetland',
        value: '+',
        id: 'wetland',
      },
      {
        landType: 'Artificial area',
        value: '-',
        id: 'artificialarea',
      },
      {
        landType: 'Bare land',
        value: '',
        id: 'bareland',
      },
      {
        landType: 'Water body',
        value: '',
        id: 'waterbody',
      },
    ],
  },
  {
    id: 'waterbody',
    name: 'Water body',
    non_editable: 7,
    row: [
      {
        landType: 'Tree-covered',
        value: '',
        id: 'treecovered',
      },
      {
        landType: 'Grassland',
        value: '',
        id: 'grassland',
      },
      {
        landType: 'Cropland',
        value: '',
        id: 'cropland',
      },
      {
        landType: 'Wetland',
        value: '',
        id: 'wetland',
      },
      {
        landType: 'Artificial area',
        value: '',
        id: 'artificialarea',
      },
      {
        landType: 'Bare land',
        value: '',
        id: 'bareland',
      },
      {
        landType: 'Water body',
        value: '',
        id: 'waterbody',
      },
    ],
  },
];

export default landCoverDefaults;
