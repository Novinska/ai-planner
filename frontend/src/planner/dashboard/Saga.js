import { call, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
  AI_SEND_PROMPT_REQUEST,
  AI_SEND_PROMPT_SUCCESS,
  AI_SEND_PROMPT_FAILURE,
} from "./Constants";

function* handleSendPrompt(action) {
  try {
    const response = yield call(
      axios.post,
      "http://localhost:5999/api/ai/chat",
      {
        prompt: action.payload.prompt,
        categoryId: action.payload.categoryId,
      },
    );

    const { reply, newTasks, updatedTasks } = response.data;

    yield put({
      type: AI_SEND_PROMPT_SUCCESS,
      payload: { reply, newTasks, updatedTasks },
    });
  } catch (error) {
    console.error("Помилка у Сазі при роботі з ШІ:", error);
    const errorMsg =
      error.response?.data?.error || "Не вдалося зв'язатися з ШІ-асистентом";

    yield put({
      type: AI_SEND_PROMPT_FAILURE,
      payload: errorMsg,
    });
  }
}

export function* watchAiSaga() {
  yield takeLatest(AI_SEND_PROMPT_REQUEST, handleSendPrompt);
}
