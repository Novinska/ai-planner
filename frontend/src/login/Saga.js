import { takeEvery, call } from "redux-saga/effects";
import { LOGIN_REQUEST } from "./Actions";
import { authService } from "../services/services";

function* loginSaga() {
  yield call(authService.loginWithGoogle);
}

export function* watchAuth() {
  yield takeEvery(LOGIN_REQUEST, loginSaga);
}
