import { combineReducers } from 'redux';
import { footballBettings, footballBettingSelected } from './betting';
import { footballOrders } from './order';
import { football } from './football';
import { footballMix, footballMixSingle, footballMixSingleData } from './mix';
import { footballRules } from './rules';
import { optimization } from './optimization';

const footballApp = combineReducers({
  football,
  footballMix,
  optimization,
  footballRules,
  footballOrders,
  footballBettings,
  footballMixSingle,
  footballMixSingleData,
  footballBettingSelected
});

export default footballApp;
