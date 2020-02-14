import {
  createStore,
  applyMiddleware,
  compose,
} from 'redux';
import thunk from 'redux-thunk';
import reducers from '@/store/reducers';
import clientMiddleware from '@/middlewares/clientMiddlware';
import apiBase from '@/api/apiBase';

export default initialState => {
  const store = createStore(
    reducers,
    initialState,
    compose(
      applyMiddleware(
        thunk,
        clientMiddleware(apiBase),
      ),
    )
  );

  return store;
}
