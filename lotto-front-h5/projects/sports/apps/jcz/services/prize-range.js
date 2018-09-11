/** **********************奖金优化的奖金范围**************************/
const prizeRange = {
  allSg: null,
  jqs2bf: [
    ['00'],
    ['01', '10'],
    ['02', '20', '11'],
    ['03', '30', '12', '21', '21', '12'],
    ['04', '40', '13', '31', '22', '31', '13'],
    ['05', '50', '14', '41', '23', '32', '32', '23', '41', '14'],
    ['15', '51', '24', '42', '33', '42', '24', '51', '15'],
    ['25', '52', '34', '43', '43', '34', '52', '25']
  ],
  getAllSG: function(codeList) {
    // 所有比分赛果
    let hits = [],
      jqsmap = prizeRange.jqs2bf;
    function jqs2bf(jqs) {
      let x = [];
      for (let i = jqs.length; i--;) {
        x = x.concat(jqsmap[jqs[i]] || []);
      }
      return x;
    }
    for (let y in codeList) {
      let a = codeList[y];
      let s = null,
        p = null,
        f = null,
        bs = {},
        j2b = null;
      if ('JQS' in a) {
        j2b = jqs2bf(a.JQS);
        if (!('BF' in a)) {
          a.BF = [];
        }
        a.BF = a.BF.concat(j2b);
      }
      if ('BF' in a) {
        for (let i = a.BF.length; i--;) {
          let v = a.BF[i],
            v2,
            b =
              v.charAt(1) === 'A' ? v.charAt(0) - 1 : v.charAt(0) - v.charAt(1);
          if (b === 0) {
            p = 1;
            v2 = 1;
          } else if (b > 0) {
            s = 1;
            v2 = 3;
          } else {
            f = 1;
            v2 = 0;
          }
          bs[v] =
            a.id +
            '_' +
            v +
            '|' +
            a.id +
            '_' +
            v2 +
            '|' +
            a.id +
            '_j' +
            (parseInt(v.charAt(0)) + parseInt(v.charAt(1)));
        }
      }
      if ('SPF' in a) {
        for (let i = a.SPF.length; i--;) {
          let v = a.SPF[i];
          if (v === '3' && !s) {
            bs['10'] = a.id + '_10|' + a.id + '_3' + '|' + a.id + '_j1';
          }
          if (v === '1' && !p) {
            bs['00'] = a.id + '_00|' + a.id + '_1' + '|' + a.id + '_j0';
          }
          if (v === '0' && !f) {
            bs['01'] = a.id + '_01|' + a.id + '_0' + '|' + a.id + '_j1';
          }
        }
      }
      let vs = [];
      for (let k in bs) {
        vs.push(bs[k]);
      }
      hits.push(vs);
    }

    return prizeRange.EsMathAl(hits);
  },
  getPrizeRange: function(codeList, list) {
    // 计算奖金范围
    let allSg = this.getAllSG(codeList),
      maxPrize = 0,
      minPrize = 0,
      isInCode = prizeRange.isInCode,
      prizes = [];
    for (let i in allSg) {
      let g = allSg[i];
      g = g.join('|') + '|';
      let pz = 0;
      for (let i = 0, j = list.length; i < j; i++) {
        let vss = list[i]['content'];
        if (isInCode(g, vss)) {
          let prize = parseFloat(list[i]['prize']) || 0;
          pz += prize;
          if (prize > 0) {
            if (minPrize === 0) {
              minPrize = prize;
            } else {
              minPrize = Math.min(prize, minPrize);
            }
          }
        }
      }
      prizes.push(pz);
    }

    maxPrize = Math.max.apply(Math, prizes).toFixed(2);
    return [minPrize, maxPrize];
  },
  isInCode: function(_long, _shot) {
    _shot = _shot.split(',');
    for (let i = _shot.length; i--;) {
      if (_long.indexOf(_shot[i]) === -1) {
        return false;
      }
    }
    return true;
  },
  EsMathAl: function(A2, fn) {
    let n = 0,
      codes = [],
      code = [],
      isTest = typeof fn === 'function',
      stop;
    if (A2.length) {
      each(A2, n);
    }
    function each(A2, n) {
      if (n >= A2.length) {
        if (!isTest || fn(code) !== false) {
          codes.push(code.slice());
        }
        code.length = n - 1;
      } else {
        let cur = A2[n];
        for (let i = 0, j = cur.length; i < j; i++) {
          code.push(cur[i]);
          each(A2, n + 1);
        }
        if (n) {
          code.length = n - 1;
        }
      }
    }
    return codes;
  }
};

export default prizeRange;
