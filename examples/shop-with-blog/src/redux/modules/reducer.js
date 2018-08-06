import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as reduxAsyncConnect } from 'redux-connect';
import deityReducers from 'falcon-core/redux/modules';
import { reducer as formReducer } from 'redux-form';
import contact from './contact';

export default combineReducers({
  contact,
  form: formReducer,
  reduxAsyncConnect,
  routing: routerReducer,
  ...deityReducers
});
