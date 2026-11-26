import { FETCH_DATA_REQUEST, FETCH_DATA_SUCCESS } from "./Actions";

const initialState = {
  tasks: [],
  events: [],
  loading: false,
};

export default function dataReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_DATA_REQUEST:
      return { ...state, loading: true };
    case FETCH_DATA_SUCCESS:
      return {
        ...state,
        [action.payload.dataType]: action.payload.data,
        loading: false,
      };
    default:
      return state;
  }
}
