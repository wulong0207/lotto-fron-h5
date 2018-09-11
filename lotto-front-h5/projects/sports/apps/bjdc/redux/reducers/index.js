import { combineReducers } from 'redux';
// import { basketballBettings, basketballBettingSelected } from './betting';
import { order } from './order';
import { basketball } from './basketball';
import { basketballMix } from './mix';
import { spHistory } from './sphistory.js';
import { betSelected } from './bet.js';
import { basketballRules } from './rules';
import { optimization } from './optimization';

const basketballApp = combineReducers({
  spHistory,
  basketball,
  betSelected,
  basketballMix,
  optimization,
  basketballRules,
  order
  // basketballBettings,
  // basketballMixSingle,
  // basketballMixSingleData,
  // basketballBettingSelected,
});

export default basketballApp;
