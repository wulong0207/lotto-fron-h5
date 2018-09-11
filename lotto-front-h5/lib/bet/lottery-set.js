/**
 * Created by wangzhiyong
 * date:2017-02-22
 * desc:彩票种类集合
 *
 */
// var Footbal14win = require("./lottery/footbal14win");
// var ElevenChoseFive = require("./lottery/eleven-chosefive");
// var DoubleBall = require("./lottery/double-ball");
// var Football = require("./lottery/football");
// var Jsk3 = require("./lottery/jsk3");
// var BigLotto = require("./lottery/big-lotto.js");

import Footbal14win from './lottery/footbal14win';
import ElevenChoseFive from './lottery/eleven-chosefive';
import DoubleBall from './lottery/double-ball';
import Football from './lottery/football';
import Jsk3 from './lottery/jsk3';
import BigLotto from './lottery/big-lotto.js';

var LotterySet = {
  Footbal14win: new Footbal14win(), // 足彩-14胜负与任选9
  ElevenChoseFive: new ElevenChoseFive(), // 11选5
  DoubleBall: new DoubleBall(), // 双色球
  Football: new Football(), // 足球
  BasketBall: new Football(), // 篮球
  Jsk3: new Jsk3(), // 江苏快3
  BigLotto: new BigLotto() // 大乐透
};
export default LotterySet;
