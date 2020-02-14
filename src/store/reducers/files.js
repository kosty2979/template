import * as types from '@/store/types/files';


const initialState =  {};

export default function files(state = initialState, action) {
  switch (action.type) {
    case types.fetchFiles.REQUEST:
      return state;

    case types.fetchFiles.SUCCESS: {
      const {
        files,
      } = action.result;

      return {
        ...state,
        files,
      };
    }
    case types.fetchFiles.FAILURE:
      return state;

    default: {
      return state;
    }
  }
}
