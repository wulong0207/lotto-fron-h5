export const templates = [
  {
    lotteryCode: 100, // ssq 双色球
    getComponent: () => import('../templates/dlt')
  },
  {
    lotteryCode: 101, // qlc
    getComponent: () => import('../templates/qlc')
  },
  {
    lotteryCode: 102, // dlt
    getComponent: () => import('../templates/dlt')
  },
  {
    lotteryCode: 103, // pl5
    getComponent: () => import('../templates/pl5')
  },
  {
    lotteryCode: 104, // pl3
    getComponent: () => import('../templates/f3d')
  },
  {
    lotteryCode: 105, // f3d
    getComponent: () => import('../templates/f3d')
  },
  {
    lotteryCode: 107, // qxc == pl5
    getComponent: () => import('../templates/pl5')
  },
  {
    lotteryCode: 201, // ssc 重庆时时彩 ~205
    getComponent: () => import('../templates/ssc')
  },
  {
    lotteryCode: 210, // gd11x5
    getComponent: () => import('../templates/sd11x5')
  },
  {
    lotteryCode: 211, // hb11x5
    getComponent: () => import('../templates/sd11x5')
  },
  {
    lotteryCode: 212, // js11x5
    getComponent: () => import('../templates/sd11x5')
  },
  {
    lotteryCode: 213, // jxx11x5
    getComponent: () => import('../templates/sd11x5')
  },

  {
    lotteryCode: 214, // ln11x5
    getComponent: () => import('../templates/sd11x5')
  },
  {
    lotteryCode: 215, // sd11x5
    getComponent: () => import('../templates/sd11x5')
  },
  {
    lotteryCode: 273, // xj11x5
    getComponent: () => import('../templates/sd11x5')
  },
  {
    lotteryCode: 233, // 江苏k3
    getComponent: () => import('../templates/k3')
  },
  {
    lotteryCode: 234, // 江西k3
    getComponent: () => import('../templates/k3')
  },
  {
    lotteryCode: 300, // 竞彩足球
    getComponent: () => import('../templates/jczq')
  },
  {
    lotteryCode: 301, // 竞彩篮球
    getComponent: () => import('../templates/jclq')
  },
  {
    lotteryCode: 304, // 14场胜负彩
    getComponent: () => import('../templates/fourGame')
  },

  {
    lotteryCode: 305, // 9场胜负彩
    getComponent: () => import('../templates/ren-nine')
  },
  {
    lotteryCode: 306, // 北京单场
    getComponent: () => import('../templates/bd')
  },
  {
    lotteryCode: 307, // 胜负过关
    getComponent: () => import('../templates/bd')
  },
  {
    lotteryCode: 225, // 山东快乐扑克3
    getComponent: () => import('../templates/poker')
  }
];
