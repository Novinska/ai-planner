import { call, put, takeEvery } from "redux-saga/effects";
import { FETCH_DATA_REQUEST, FETCH_DATA_SUCCESS } from "./Actions";
import { request } from "../services/apiServices";

function* fetchDataSaga(action) {
  const { dataType } = action.payload;
  try {
    const methodName = dataType === "tasks" ? "fetchTasks" : "fetchEvents";
    const data = yield call(apiService[methodName]);

    yield put(fetchDataSuccess(dataType, data));
  } catch (e) {
    console.error(`Error loading ${dataType}:`, e);
  }
}

export function* rootDataSaga() {
  yield takeEvery(FETCH_DATA_REQUEST, fetchDataSaga);
}
