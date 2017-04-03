import _ from 'lodash';

import {colors} from 'material-ui/styles';

const fondations = [
  {title: 'Front', color: colors.lightBlue400},
  {title: 'Craft', color: colors.lightGreen400},
  {title: 'Devops', color: colors.orange400},
  {title: 'Data', color: colors.pink400},
  {title: 'Cloud', color: colors.teal400},
  {title: 'WeScale', color: colors.teal400},
  {title: 'Back', color: colors.red400},
  {title: 'Agile', color: colors.blueGrey400},
  {title: 'IoT', color: colors.purple200},
  {title: 'Mobile', color: colors.indigoA400}];

export const getFondationStyle = (fondation) => {
  let f = _(fondations).filter(f => f.title === fondation);
  return f.isEmpty() ? colors.grey100 : f.first();
};
