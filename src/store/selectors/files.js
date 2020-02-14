import _ from 'lodash';

import { createSelector } from 'reselect';

export const getFiles = createSelector([
  state => _.get(state, 'files'),
], files => files.files);
