export const FETCH_DATA_REQUEST = "FETCH_DATA_REQUEST";
export const FETCH_DATA_SUCCESS = "FETCH_DATA_SUCCESS";

export const fetchDataRequest = (dataType) => ({
  type: FETCH_DATA_REQUEST,
  payload: { dataType },
});

export const fetchDataSuccess = (dataType, data) => ({
  type: FETCH_DATA_SUCCESS,
  payload: { dataType, data },
});
