import * as types from '@/store/types/blocks';



const initialState =  {};

export default function blocks(state = initialState, action) {
  switch (action.type) {
    case types.fetchBlocks.SUCCESS: {
      return {
        ...state,
        blocks: action.payload,
      };
    }
    case types.fetchBlocks.FAILURE: {
      return initialState;
    }
    default: {
      return state;
    }
  }
}
