import {
  createStore,
  applyMiddleware,
  compose,
} from 'redux';
import thunk from 'redux-thunk';
import reducers from '@/store/reducers';
import clientMiddleware from '@/middlewares/clientMiddlware';
import apiBase from '@/api/apiBase';

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default initialState => {
  const store = createStore(
    reducers,
    initialState,
    composeEnhancer(
      applyMiddleware(
        thunk,
        clientMiddleware(apiBase),
      ),
      a => a
    )
  );

  return store;
}
