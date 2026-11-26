import { createStore, applyMiddleware, combineReducers } from "redux";
import createSagaMiddleware from "redux-saga";
import { all } from "redux-saga/effects";
import dataReducer from "./Reducer";
import { rootDataSaga } from "./sagas";
import { watchAuth } from "../login/Saga";
import { aiReducer } from "../planner/dashboard/Reducer";
import { watchAiSaga } from "../planner/dashboard/Saga";

import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:5999";

const sagaMiddleware = createSagaMiddleware();

const rootReducer = combineReducers({
  data: dataReducer,
  ai: aiReducer,
});

function* rootSaga() {
  yield all([rootDataSaga(), watchAuth(), watchAiSaga()]);
}

const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(rootSaga);

export default store;
