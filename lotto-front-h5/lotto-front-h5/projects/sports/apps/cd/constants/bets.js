export const BETS_CONFIG = [
  {
    lotteryCode: 300,
    getComponent() {
      return import('../components/matches/bets/football');
    }
  },
  {
    lotteryCode: 301,
    getComponent() {
      return import('../components/matches/bets/football');
    }
  }
];

export const DEFAULT_LOTTERY_TEAM_LOGO = {
  300: {
    home: require('../components/matches/images/football@2x.png'),
    guest: require('../components/matches/images/football2@2x.png')
  },
  301: {
    home: require('../components/matches/images/basketball@2x.png'),
    guest: require('../components/matches/images/basketball2@2x.png')
  }
};

export function IS_MIXED_LOTTERYCHILDCOLD(lotteryChildCode) {
  switch (lotteryChildCode) {
    case 30002:
    case 30003:
    case 30101:
    case 30102:
      return false;
  }
  return true;
}
