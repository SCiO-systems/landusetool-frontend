import LandCoverDefaults from '../data/land-cover-defaults';
import InitialSchenario from '../data/initial-scenario';

const camelize = (str) => str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => {
    if (/\s+/.test(match)) return ''; // or if (/\s+/.test(match)) for white spaces
    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  });
export const generateLUImpactMatrixSchema = (luClasses, usesDefault) => {
  if (usesDefault) return LandCoverDefaults;
  if (!luClasses || luClasses.length === 0) return LandCoverDefaults;
  const matrixSchema = [];

  luClasses.forEach((lc, index, luc) => {
    const matrixEntry = {
      id: camelize(lc.key),
      name: lc.key,
      non_editable: index + 1,
    };

    const row = [];
    luc.forEach((element) => {
      row.push({
        landType: element.key,
        value: element.key === lc.key ? '' : '-',
        id: camelize(element.key),
      });
    });

    matrixEntry.row = row;

    matrixSchema.push(matrixEntry);
  });

  return matrixSchema;
};

export const generateScenarioSchema = (luClasses, usesDefault) => {
  if (usesDefault) return InitialSchenario;
  if (!luClasses || luClasses.length === 0) return InitialSchenario;
  return {};
};
