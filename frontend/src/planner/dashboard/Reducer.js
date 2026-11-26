import {
  AI_SEND_PROMPT_REQUEST,
  AI_SEND_PROMPT_SUCCESS,
  AI_SEND_PROMPT_FAILURE,
} from "./Constants";

const initialState = {
  messages: [],
  loading: false,
  error: null,
};

export const aiReducer = (state = initialState, action) => {
  switch (action.type) {
    case AI_SEND_PROMPT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        messages: [
          ...state.messages,
          { sender: "user", text: action.payload.prompt },
        ],
      };
    case AI_SEND_PROMPT_SUCCESS:
      return {
        ...state,
        loading: false,
        messages: [
          ...state.messages,
          { sender: "ai", text: action.payload.reply },
        ],
      };
    case AI_SEND_PROMPT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        messages: [
          ...state.messages,
          { sender: "ai", text: `Помилка: ${action.payload}` },
        ],
      };
    default:
      return state;
  }
};
