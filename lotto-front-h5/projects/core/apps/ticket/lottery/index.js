import Common from './common.jsx';
import F3D from './f3d.jsx';
import Sport from './sport.jsx';
import SSQ from './ssq.jsx';

// 生成各彩种的通用处理
export default function(ticket) {
  ticket = ticket || {};

  switch (ticket.lotteryCode) {
    case 306: // 北京单场
      return new Sport(ticket);
    case 105: // 福彩3D
      return new F3D(ticket);
    case 100: // 双色球
    case 102: // 大乐透
      return new SSQ(ticket);
    case 107: // 七星彩
    default: {
      // 是竞技彩
      if (ticket.sportList) {
        return new Sport(ticket);
      }

      // 数字彩
      return new Common(ticket);
    }
  }
}
