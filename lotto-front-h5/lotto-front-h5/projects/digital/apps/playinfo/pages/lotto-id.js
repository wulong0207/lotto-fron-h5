/*
 * @Author: zouyuting
 * @Date: 2017-12-11 17:11:15
 * @Desc: 彩种id
 */
const tabelhead1 = ['奖级', '中奖条件', '中奖说明', '单注奖金'];
const tabelhead2 = ['玩法', '中奖规则', '中奖机会', '单注奖金'];
const tabelhead3 = ['玩法类型', '中奖规则', '单注奖金'];
const tabelhead4 = ['奖级', '中奖规则', '奖金'];
const all11x5 = {
  num: 210,
  name: '中奖说明',
  tabelhead: tabelhead2,
  tabelist: [
    {
      pname: '任选二',
      explain: '所投注的2个号码与开奖的任意2个号码相同',
      opportunity: '1/5.5',
      prize: '6元'
    },
    {
      pname: '任选三',
      explain: '所投注的3个号码与开奖的任意3个号码相同',
      opportunity: '1/16.5',
      prize: '19元'
    },
    {
      pname: '任选四',
      explain: '所投注的4个号码与开奖的任意4个号码相同',
      opportunity: '1/66',
      prize: '78元'
    },
    {
      pname: '任选五',
      explain: '所投注的5个号码与开奖的任意5个号码相同',
      opportunity: '1/462',
      prize: '540元'
    },
    {
      pname: '任选六',
      explain: '所投注的6个号码与开奖的任意5个号码相同',
      opportunity: '1/77',
      prize: '90元'
    },
    {
      pname: '任选七',
      explain: '所投注的7个号码与开奖的任意5个号码相同',
      opportunity: '1/22',
      prize: '26元'
    },
    {
      pname: '任选八',
      explain: '所投注的8个号码与开奖的任意5个号码相同',
      opportunity: '1/8.25',
      prize: '9元'
    },
    {
      pname: '前一直选',
      explain: '所投注的1个号码与开奖的第1个号码相同',
      opportunity: '1/11',
      prize: '13元'
    },
    {
      pname: '前二直选',
      explain: '选2个号码与开奖的前2个号码相同且顺序一致',
      opportunity: '1/110',
      prize: '130元'
    },
    {
      pname: '前二组选',
      explain: '选2个号码与开奖的前2个号码相同',
      opportunity: '1/55',
      prize: '65元'
    },
    {
      pname: '前三直选',
      explain: '选3个号码与开奖的前3个号码相同且顺序一致',
      opportunity: '1/990',
      prize: '1170元'
    },
    {
      pname: '前三组选',
      explain: '选3个号码与开奖的前3个号码相同',
      opportunity: '1/165',
      prize: '195元'
    }
  ]
};
const ssc = {
  num: 201,
  name: '中奖说明',
  tabelhead: tabelhead3,
  tabelist: [
    {
      pname: '五星直选',
      explain: '选5个号码，与开奖号码完全按位全部相符即中奖',
      prize: '100000元'
    },
    // {
    //   pname: '五星(通选)',
    //   explain: '选5个号码，与开奖号码完全按位全部相符即中奖',
    //   prize: '20440元'
    // },
    // {
    //   pname: '五星(通选)',
    //   explain: '选5个号码，与开奖号码前三位或后三位按位相符即中奖',
    //   prize: '220元'
    // },
    // {
    //   pname: '五星(通选)',
    //   explain: '选5个号码，与开奖号码前二位或后二位按位相符即中奖',
    //   prize: '20元'
    // }
    {
      pname: '五星(通选)',
      explain: [
        '选5个号码，与开奖号码完全按位全部相符即中奖',
        '选5个号码，与开奖号码前三位或后三位按位相符即中奖',
        '选5个号码，与开奖号码前二位或后二位按位相符即中奖'
      ],
      prize: '20440元'
    },
    {
      pname: '三星直选',
      explain: '选3个号码，与开奖号码连续后三位按位相符即中奖',
      prize: '1000元'
    },
    {
      pname: '三星组六',
      explain: '选3个号码，开奖号码后三位为组六号且包含选中即中奖',
      prize: '160元'
    },
    {
      pname: '三星组三',
      explain: '选2个号码，开奖号码后三位为组三号且包含选中即中奖',
      prize: '320元'
    },
    {
      pname: '二星直选',
      explain: '每位至少选1个号码，按位猜对开奖后2位即中奖',
      prize: '100元'
    },
    {
      pname: '二星组选',
      explain: '选2个号码，与开奖号码连续后二位相符即中奖',
      prize: '50元'
    },
    {
      pname: '一星',
      explain: '选1个号码，与开奖号码个位相符即中奖',
      prize: '10元'
    },
    {
      pname: '大小单双',
      explain: '与开奖号码后二位数字属性按位相符即中奖',
      prize: '4元'
    }
  ]
};
const k3 = {
  num: 233,
  name: '中奖说明',
  tabelhead: tabelhead3,
  tabelist: [
    {
      pname: '和值',
      explain: '对三个号码的和值进行投注,与开奖号和值相同',
      prize: '9~240元'
    },
    {
      pname: '三同号通选（豹子）',
      explain:
        '对所有相同的三个号码（111、222、…、666）进行全包投注,与开奖号相同',
      prize: '40元'
    },
    {
      pname: '三同号单选（豹子）',
      explain:
        '从所有相同的三个号码（111、…、666）中任意选择一组号码进行投注,与开奖号相同',
      prize: '240元'
    },
    {
      pname: '二同号复选（对子）',
      explain:
        '对三个号码中两个指定的相同号码和一个任意号码进行投注,与开奖号相同',
      prize: '15元'
    },
    {
      pname: '二同号单选（对子）',
      explain:
        '对三个号码中两个指定的相同号码和一个指定的不同号码进行投注,与开奖号相同',
      prize: '80元'
    },
    {
      pname: '三不同号',
      explain: '对三个各不相同的号码进行投注,与开奖号相同',
      prize: '40元'
    },
    {
      pname: '二不同号',
      explain:
        '对三个号码中两个指定的不同号码和一个任意号码进行投注,与开奖号相同',
      prize: '8元'
    },
    {
      pname: '三连号通选',
      explain:
        '对所有三个相连的号码（123、234、345、456）进行投注,与开奖号相同',
      prize: '10元'
    }
  ]
};
export default {
  100: {
    num: 100,
    name: '双色球设奖与奖级表',
    tabelhead: tabelhead1,
    tabelist: [
      {
        pname: '一等奖',
        red: '6',
        blue: '1',
        explain: '中6+1',
        prize: '最高1000万'
      },
      {
        pname: '二等奖',
        red: '6',
        explain: '中6+0',
        prize: '浮动'
      },
      {
        pname: '三等奖',
        red: '5',
        blue: '1',
        explain: '中5+1',
        prize: '3000元'
      },
      {
        pname: '四等奖',
        col: [
          { red: '5', explain: '中5+0' },
          { red: '4', blue: '1', explain: '中4+1' }
        ],
        prize: '200元'
      },
      {
        pname: '五等奖',
        col: [
          { red: '4', explain: '中4+0' },
          { red: '3', blue: '1', explain: '中3+1' }
        ],
        prize: '10元'
      },
      {
        pname: '六等奖',
        col: [
          { red: '2', blue: '1', explain: '中2+1' },
          { red: '1', blue: '1', explain: '中1+1' },
          { blue: '1', explain: '中0+1' }
        ],
        prize: '5元'
      }
    ]
  },
  101: {
    num: 101,
    name: '七乐彩设奖与奖级表',
    tabelhead: tabelhead1,
    tabelist: [
      {
        pname: '一等奖',
        red: '7',
        explain: '中7+0',
        prize: '最高500万'
      },
      {
        pname: '二等奖',
        red: '6',
        blue: '1',
        explain: '中6+1',
        prize: '浮动'
      },
      {
        pname: '三等奖',
        red: '6',
        explain: '中6+0',
        prize: '浮动'
      },
      {
        pname: '四等奖',
        red: '5',
        blue: '1',
        explain: '中5+1',
        prize: '200元'
      },
      {
        pname: '五等奖',
        red: '5',
        explain: '中5+0',
        prize: '50元'
      },
      {
        pname: '六等奖',
        red: '4',
        blue: '1',
        explain: '中4+1',
        prize: '10元'
      },
      {
        pname: '七等奖',
        red: '4',
        explain: '中4+0',
        prize: '5元'
      }
    ]
  },
  102: {
    num: 102,
    name: '大乐透设奖与奖级表',
    tabelhead: tabelhead1,
    tabelist: [
      {
        pname: '一等奖',
        red: '5',
        blue: '2',
        explain: '中5+2',
        prize: '浮动，最高1600万'
      },
      {
        pname: '二等奖',
        red: '5',
        blue: '1',
        explain: '中5+1',
        prize: '浮动'
      },
      {
        pname: '三等奖',
        col: [
          { red: '5', explain: '中5+0' },
          { red: '4', blue: '2', explain: '中4+2' }
        ],
        prize: '浮动'
      },
      {
        pname: '四等奖',
        col: [
          { red: '4', blue: '1', explain: '中4+1' },
          { red: '3', blue: '2', explain: '中3+2' }
        ],
        prize: '200元'
      },
      {
        pname: '五等奖',
        col: [
          { red: '4', explain: '中4+0' },
          { red: '3', blue: '1', explain: '中3+1' },
          { red: '2', blue: '2', explain: '中2+2' }
        ],
        prize: '10元'
      },
      {
        pname: '六等奖',
        col: [
          { red: '3', explain: '中3+0' },
          { red: '2', blue: '1', explain: '中2+1' },
          { red: '1', blue: '2', explain: '中1+2' },
          { blue: '2', explain: '中0+2' }
        ],
        prize: '5元'
      }
    ]
  },
  103: {
    num: 103,
    name: '排列5中奖说明',
    tabelhead: tabelhead3,
    tabelist: [
      {
        pname: '直选投注',
        explain: '买5个号码，数字相同或且顺序一致即中奖',
        prize: '10万元'
      }
    ]
  },
  104: {
    num: 104,
    name: '排列3中奖说明',
    tabelhead: tabelhead3,
    tabelist: [
      {
        pname: '直选投注',
        explain: '买3个号码，数字相同或且顺序一致即中奖',
        prize: '1040元'
      },
      {
        pname: '直选和值投注',
        explain: '买一个和值与三个开奖号和值相同即中奖',
        prize: '1040元'
      },
      {
        pname: '组三包号投注',
        explain: '买2个号码，开奖号码为组三号且相同即中奖',
        prize: '346元'
      },
      {
        pname: '组三直选投注',
        explain: '买1个对子，1个单号，猜对开奖号即中奖',
        prize: '346元'
      },
      {
        pname: '组三和值投注',
        explain: '买1个和值与开奖号和值相同且为组三即中奖',
        prize: '346元'
      },
      {
        pname: '组六包号投注',
        explain: '买3个号码，开奖号码为组六且相同即中奖',
        prize: '173元'
      },
      {
        pname: '组六和值投注',
        explain: '买1个和值，与开奖号和值相同且为组六即中',
        prize: '173元'
      }
    ]
  },
  105: {
    num: 105,
    name: '福彩3D中奖说明',
    tabelhead: tabelhead3,
    tabelist: [
      {
        pname: '直选投注',
        explain: '买3个号码，数字相同且顺序一致即中奖',
        prize: '1040元'
      },
      {
        pname: '直选和值投注',
        explain: '买一个和值与三个开奖号和值相同即中奖',
        prize: '1040元'
      },
      {
        pname: '组三包号投注',
        explain: '买2个号码，开奖号码为组三号且相同即中奖',
        prize: '346元'
      },
      {
        pname: '组三直选投注',
        explain: '买1个对子，1个单号，猜对开奖号即中奖',
        prize: '346元'
      },
      {
        pname: '组三和值投注',
        explain: '买1个和值与开奖号和值相同且为组三即中奖',
        prize: '346元'
      },
      {
        pname: '组六包号投注',
        explain: '买3个号码，开奖号码为组六且相同即中奖',
        prize: '173元'
      },
      {
        pname: '组六和值投注',
        explain: '买1个和值，与开奖号和值相同且为组六即中',
        prize: '173元'
      }
    ]
  },
  107: {
    num: 107,
    name: '七星彩奖金计算说明',
    tabelhead: tabelhead4,
    tabelist: [
      {
        pname: '一等奖',
        explain: '定位中7码',
        prize: '最高500万'
      },
      {
        pname: '二等奖',
        explain: '定位连续中6码',
        prize: '浮动奖金'
      },
      {
        pname: '三等奖',
        explain: '定位连续中5码',
        prize: '1800元'
      },
      {
        pname: '四等奖',
        explain: '定位连续中4码',
        prize: '300元'
      },
      {
        pname: '五等奖',
        explain: '定位连续中3码',
        prize: '20元'
      },
      {
        pname: '六等奖',
        explain: '定位连续中2码',
        prize: '5元'
      }
    ]
  },
  // 11选5
  210: all11x5,
  211: all11x5,
  212: all11x5,
  213: all11x5,
  214: all11x5,
  215: all11x5,
  273: all11x5,
  // 时时彩
  201: ssc,
  202: ssc,
  203: ssc,
  204: ssc,
  205: ssc,
  // 快3
  230: k3,
  231: k3,
  232: k3,
  233: k3,
  234: k3,

  222: {
    num: 222,
    name: '幸运农场',
    tabelhead: tabelhead3,
    tabelist: [
      {
        pname: '前一数投',
        explain: '投注号码与开奖出现的第一个位置的号码相符',
        prize: '25元'
      },
      {
        pname: '前一红投',
        explain: '投注号码与开奖中按开奖顺序出现的第一个位置为红色号码相符',
        prize: '5元'
      },
      {
        pname: '任选二',
        explain: '投注号码与开奖号码中任意2个位置的号码相符',
        prize: '8元'
      },
      {
        pname: '选二连组',
        explain:
          '投注号码与开奖号码中按开奖顺序出现的2个连续位置的号码相符（顺序不限）',
        prize: '31元'
      },
      {
        pname: '选二连直',
        explain:
          '投注号码与开奖号码中按开奖顺序出现的2个连续位置的号码按位相符',
        prize: '62元'
      },
      {
        pname: '任选三',
        explain: '投注号码与开奖号码中任意3个位置的号码相符',
        prize: '24元'
      },
      {
        pname: '选三前组',
        explain:
          '投注号码与开奖号码中按开奖顺序出现的前3个位置的号码相符（顺序不限）',
        prize: '1300元'
      },
      {
        pname: '选三前直',
        explain: '投注号码与开奖号码中按开奖顺序出现的前3个位置的号码按位相符',
        prize: '8000元'
      },
      {
        pname: '任选四',
        explain: '投注号码与开奖号码中任意4个位置的号码相符',
        prize: '80元'
      },
      {
        pname: '任选五',
        explain: '投注号码与开奖号码中任意5个位置的号码相符',
        prize: '320元'
      }
    ]
  },
  225: {
    num: 225,
    name: '快乐扑克3',
    tabelhead: tabelhead3,
    tabelist: [
      {
        pname: '花色投注(同花全包)',
        explain: '当期开出的3个开奖号码花色相同即中奖',
        prize: '22元'
      },
      {
        pname: '花色投注(同花单选)',
        explain:
          '当期开出的3个开奖号码花色相同，且投注号码的花色与开奖号码的花色相同即中奖',
        prize: '90元'
      },
      {
        pname: '连号投注(顺子全包)',
        explain: '当期开出的3个中奖号码为三连号即中奖',
        prize: '33元'
      },
      {
        pname: '连号投注(顺子单选)',
        explain:
          '当期开出的3个开奖号码为三连号，且投注号码与开奖号码相同即中奖',
        prize: '400元'
      },
      {
        pname: '同号投注(豹子全包)',
        explain: '当期开出的3个开奖号码为同一个号码即中奖',
        prize: '500元'
      },
      {
        pname: '同号投注(豹子单选)',
        explain: '当期开出的3个开奖号码为三连号且花色均为投注的一种花色即中奖',
        prize: '6400元'
      },
      {
        pname: '同号投注(对子全包)',
        explain: '当期开出的3个开奖号码为同一个号码，且与投注号码相同即中奖',
        prize: '7元'
      },
      {
        pname: '同号投注(对子单选)',
        explain: '当期开出的3个开奖号码有且只有2个号码相同即中奖',
        prize: '88元'
      },
      {
        pname: '任选投注(任选一)',
        explain: '投注号码与当期3个开奖号码中任意1个相同即中奖',
        prize: '5元'
      },
      {
        pname: '任选投注(任选二)',
        explain: '投注的2个号码与当期3个开奖号码中任意2个相同即中奖',
        prize: '33元'
      },
      {
        pname: '任选投注(任选三)',
        explain: '投注号码包含当期全部开奖号码即中奖',
        prize: '116元'
      },
      {
        pname: '任选投注(任选四)',
        explain: '投注号码包含当期全部开奖号码即中奖',
        prize: '46元'
      },
      {
        pname: '任选投注(任选五)',
        explain: '投注号码包含当期全部开奖号码即中奖',
        prize: '22元'
      },
      {
        pname: '任选投注(任选六)',
        explain: '投注号码包含当期全部开奖号码即中奖',
        prize: '12元'
      }
    ]
  }
};
