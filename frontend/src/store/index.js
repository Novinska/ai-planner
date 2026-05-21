import { createStore, applyMiddleware, combineReducers } from "redux";
import createSagaMiddleware from "redux-saga";
import { all } from "redux-saga/effects";
import dataReducer from "./Reducer";
import { rootDataSaga } from "./sagas";
import { watchAuth } from "../login/Sagas";

const sagaMiddleware = createSagaMiddleware();

const rootReducer = combineReducers({
  data: dataReducer,
});

function* rootSaga() {
  yield all([rootDataSaga(), watchAuth()]);
}

const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(rootSaga);

export default store;
