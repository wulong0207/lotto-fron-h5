/**
 * Created by housne on 24/7/2017.
 */
import { combineReducers } from 'redux';
import { bettings, bettingTimes, bettingCourage } from './betting';
import { football, currentIssue, matchIds } from './football';

export default combineReducers({
  matchIds,
  bettings,
  football,
  bettingTimes,
  currentIssue,
  bettingCourage
});
