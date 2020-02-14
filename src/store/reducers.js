import { combineReducers } from 'redux';

import blocks from '@/store/reducers/blocks';
import files from '@/store/reducers/files';

const reducers = {
  blocks,
  files
};

export default combineReducers(reducers);
