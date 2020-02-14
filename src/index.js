import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from '@/store/store.js';
import RootContainer from '@/containers/RootContainer';

ReactDOM.render(<Provider store={store}>
  <RootContainer />
</Provider>, document.getElementById('base-wrapper'));
