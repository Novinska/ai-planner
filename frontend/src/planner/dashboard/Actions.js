import {
  AI_SEND_PROMPT_REQUEST,
  AI_SEND_PROMPT_SUCCESS,
  AI_SEND_PROMPT_FAILURE,
} from "./Constants";

export const aiSendPromptRequest = (prompt, categoryId = null) => ({
  type: AI_SEND_PROMPT_REQUEST,
  payload: { prompt, categoryId },
});

export const aiSendPromptSuccess = (reply, newTasks, updatedTasks) => ({
  type: AI_SEND_PROMPT_SUCCESS,
  payload: { reply, newTasks, updatedTasks },
});

export const aiSendPromptFailure = (error) => ({
  type: AI_SEND_PROMPT_FAILURE,
  payload: error,
});
