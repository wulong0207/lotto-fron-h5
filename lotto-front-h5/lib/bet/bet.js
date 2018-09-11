/**
 * Created by wangzhiyong
 * date:2017-02-21
 * desc:所有投注计算的基类.
 */
// var LotterySet = require("./lottery-set");
import LotterySet from './lottery-set';
class Bet {
  /**
   *
   * @param {string,required}option 所属彩种
   */
  constructor(option) {
    this.option = option;
  }

  /**
   *  @param {object,required}betInfo 投注信息
   */
  calc(...betInfo) {//rest参数，有可能是多个参数
    return LotterySet[this.option] ? LotterySet[this.option].calc(...betInfo) : (() => {
          throw (new Error("无效彩种"));
        })();
  }

  calcDetail(...betInfo) {
    return LotterySet[this.option] ? LotterySet[this.option].calcDetail(...betInfo) : (() => {
          throw (new Error("无效彩种"));
        })();
  }
}

export default Bet;
