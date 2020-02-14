export default function clientMiddleware(client) {
  return ({dispatch, getState}) => {
    return (next) => (action) => {
      if (typeof action === 'function') {
        return action(dispatch, getState);
      }

      const { promise, routine, payload, ...rest } = action;
      if (!promise) {
        return next(action);
      }

      const {REQUEST, SUCCESS, FAILURE} = routine;
      next({...rest, type: REQUEST});

      const actionPromise = promise(client, getState);
      actionPromise.then(
        (result) => next({...rest, result, type: SUCCESS, ...payload && { payload }}),
        (error) => {
          // logout user if expired token
          if (error.response.status === 401) {
            //dispatch(setToken(null));
          }
          next({...rest, error, type: FAILURE, ...payload && { payload }});
        }
      ).catch((error) => {
        console.error('MIDDLEWARE ERROR:', error);
        next({...rest, error, type: FAILURE});
      });

      return actionPromise;
    };
  };
}
