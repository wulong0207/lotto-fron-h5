/**
 * @author wangzhiyong
 * @createTime 2017/3/31
 * @description 竞彩足球，篮球的辅助类，由后端同事开发的，代码太冗余了 TODO后期去掉
 */
let footballHelper = {
  Es: {
    helper: {
      cache: {},
      /**
       * [NM2N1 过关串对应的子过关串]
       * @type []
       */
      NM2N1: {
        '1*1': [1],
        '2*1': [2],
        '3*1': [3],
        '4*1': [4],
        '5*1': [5],
        '6*1': [6],
        '7*1': [7],
        '8*1': [8],
        '3*3': [2],
        '3*4': [2, 3],
        '4*6': [2],
        '4*11': [2, 3, 4],
        '5*10': [2],
        '5*20': [2, 3],
        '5*26': [2, 3, 4, 5],
        '6*15': [2],
        '6*35': [2, 3],
        '6*50': [2, 3, 4],
        '6*57': [2, 3, 4, 5, 6],
        '4*4': [3],
        '4*5': [3, 4],
        '5*16': [3, 4, 5],
        '6*20': [3],
        '6*42': [3, 4, 5, 6],
        '5*5': [4],
        '5*6': [4, 5],
        '6*22': [4, 5, 6],
        '6*6': [5],
        '6*7': [5, 6],
        '7*7': [6],
        '7*8': [6, 7],
        '7*21': [5],
        '7*35': [4],
        '7*120': [2, 3, 4, 5, 6, 7],
        '8*8': [7],
        '8*9': [7, 8],
        '8*28': [6],
        '8*56': [5],
        '8*70': [4],
        '8*247': [2, 3, 4, 5, 6, 7, 8]
      },
      getN1: function (nm) {
        return footballHelper.Es.helper.NM2N1[nm];
      },
      /**
       * @param  过关串数组，获取最小过关数
       * @return {[type]}
       */
      getMinGgNum: function (types) {
        var ntypes = [];
        for (var i = types.length; i--;) {
          ntypes = ntypes.concat(footballHelper.Es.helper.getN1(types[i]));
        }
        ntypes.sort();
        return parseInt(ntypes[0], 10);
      },
      parseNM: function (nm) {
        if (!(nm in footballHelper.Es.helper.cache)) {
          if (nm == '单关') {
            footballHelper.Es.helper.cache[nm] = [1, 1, [1]];
          } else {
            var tmp = footballHelper.Handle.trim(nm).split('*');
            footballHelper.Es.helper.cache[nm] = [footballHelper.Handle.intt(tmp[0]), footballHelper.Handle.intt(tmp[1]), footballHelper.Es.helper.getN1(nm)];
          }
        }
        return footballHelper.Es.helper.cache[nm];
      },
      countNM: function (code, n1s) {
        code = footballHelper.Handle.map(code, function () {
          return footballHelper.Handle.intt(this);
        });
        return footballHelper.Handle.reduce(n1s, function (zs, type) {
          var cl = footballHelper.MathUtil.cl(code, footballHelper.Handle.intt(type));
          return zs + footballHelper.Handle.reduce(cl, function (zs, g) {
                return zs + footballHelper.MathUtil.a(g);
              }, 0);
        }, 0);
      },
      getCodesCount: function (d, t, n, del) {
        if (n == '单关') {
          return footballHelper.Handle.reduce(t, function (s, l) {
            return s + footballHelper.Handle.reduce(l, function (s, t) {
                  return s + footballHelper.Handle.intt(t);
                }, 0);
          }, 0);
        }
        var nm = footballHelper.Es.helper.parseNM(n),
            group = footballHelper.MathUtil.dtl(d, t, nm[0]);
        return footballHelper.Handle.reduce(group, function (zs, g) {
          var al = del ? footballHelper.MathUtil.al(g, function (c) {
                var flag = '-' + c[0].split('-')[1];
                return footballHelper.Handle.some(c, function () {
                  return this.indexOf(flag) === -1;
                });
              }) : footballHelper.MathUtil.al(g);
          return zs + footballHelper.Handle.reduce(al, function (zs, g) {
                return zs + footballHelper.Es.helper.countNM(g, nm[2]);
              }, 0);
        }, 0);
      },
      getAllc1: function (types) {
        var g = {}, g2 = [];
        footballHelper.Handle.forEach(types, function (type) {
          footballHelper.Handle.forEach(footballHelper.Es.helper.getN1(type), function (t) {
            g[t] = true;
          });
        });
        for (var k in g) {
          g2.push(k == 1 ? '单关' : (k + '*' + 1));
        }
        g2.sort(function (a, b) {
          return parseInt(a, 10) > parseInt(b, 10) ? 1 : -1;
        });
        return g2;
      },
      splitNM: function (code, n1s) {
        return footballHelper.Handle.reduce(n1s, function (r, type) {
          return r.concat(footballHelper.MathUtil.cl(code, footballHelper.Handle.intt(type)));
        }, []);
      },
      getSigleCodes: function (d, t, n, del) {
        var nm = footballHelper.Es.helper.parseNM(n), group, len = nm[0], diff = len - (d.length + t.length);
        if (nm[1] > 1 && diff > 0) {
          for (var i = diff; i--;) {
            t.push([0]);
          }
        }//多串中有子串，用0sp值的补全。
        group = footballHelper.MathUtil.dtl(d, t, len);
        return footballHelper.Handle.reduce(group, function (codes, g) {
          var al = footballHelper.MathUtil.aln(g);
          return codes.concat(footballHelper.Handle.reduce(al, function (rc, c) {
            return rc.concat(footballHelper.Es.helper.splitNM(c, nm[2]));
          }, []));
        }, []);
      },
      
    },
    algo: {
      bonus: {
        minRec: [], maxRec: [], ggTypes: [], beishu: 1, cache: [], range: [],
        /**
         * @param list 注数内容
         * @return 结果集合 bodetail： 内容 （转义成 3.35×9×1倍×2 = 60.3|3.35×9×1倍×2 = 60.3 每一株以|分隔）bonus：金额之和  codeCount:注数
         */
        getBonusSum: function (list) {
          var cl = {}, sum = 0, bs = footballHelper.Es.algo.bonus.beishu, bodetail = [];
          for (var i = 0, j = list.length; i < j; i++) {
            var code = list[i], b = 1, len = code.length;
            var ht = '';
//						for (var x = code.length; x--;) {b *= code[x]; ht += code[x]+"×";}
            for (var x = code.length; x--;) {
              
              var sp;
              
              if (typeof code[x] == 'string' && code[x].indexOf('^') > -1) {
                var c = code[x].split('^');
                var matchno = c[0], sp = c[1];
                ht += "[" + matchno + "]" + sp + "×";
              } else {
                sp = code[x];
                ht += sp + "×";
              }
              var codessp = Number(footballHelper.Handle.getReaplceByVar(sp + ""));
              b *= codessp;
            }
            if (b) {
              var sinB = parseFloat(footballHelper.Handle.cauScale(2, b * 2 / Math.pow(10, code.length * 2)));//单注单倍四舍六入五成双
              var val = parseFloat(footballHelper.Handle.cauScale(2, sinB * bs)); //打倍后
//							sum+=Math.round(b*100)/100*2*bs;
              sum += val;
              if (bodetail[code.length] == null) {
                bodetail[code.length] = ht + bs + "倍×2 = " + val;
              } else {
                bodetail[code.length] += "|" + ht + bs + "倍×2 = " + val;
              }
              if (!(len in cl)) {
                cl[len] = 0;
              }
              cl[len]++;
            }
          }
          return {bonus: parseFloat(footballHelper.Handle.cauScale(2, sum)), codeCount: cl, bodetail: bodetail};
        },
        /**
         * @param n：命中长次数
         * @param min:true 最小sp，false或undefined：最大sp
         * @return 根据过关方式返回 最大或最少sp的组合
         */
        getHitSingleCodes: function (n, min) {
          var HR = footballHelper.Es.helper, list = [], dl = [], tl = [], danSort = min ? footballHelper.Es.algo.bonus.minRec.slice() : footballHelper.Es.algo.bonus.maxRec.slice(), dir = min ? 1 : -1;
          danSort.sort(function (a, b) {
            if (a.isdan === b.isdan) {
              return (a.sum > b.sum ? 1 : -1) * dir;
            }
            else {
              return a.isdan ? -1 : 1;
            }
          });
          footballHelper.Handle.forEach(danSort, function (o, i) {
            if (i >= n) {
              var t = [0];
              t.isdan = o.isdan;
              t.sum = o.sum;
              t.matchno = o.matchno;
              o = t;
            }
            if (o.isdan) {
              dl.push(o);
            } else {
              tl.push(o);
            }
          });
          footballHelper.Handle.forEach(footballHelper.Es.algo.bonus.ggTypes, function (type) {
            list = list.concat(HR.getSigleCodes(dl, tl, type));
          });
          return list;
        },
        /**
         * @param opts 投注内容
         * @param ggtype 过关方式
         * @return 最大奖金
         */
        getMaxBonus: function (opts, ggType) {
          if (opts.length < 2 && ggType.indexOf('单关') == -1) {
            return 0;
          }
          footballHelper.Es.algo.bonus.ggTypes = ggType;
          footballHelper.Es.algo.bonus.maxRec = opts;
          return footballHelper.Es.algo.bonus.getBonusSum(footballHelper.Es.algo.bonus.getHitSingleCodes(opts.length)).bonus;
        },
        setBeishu: function (bs) {
          footballHelper.Es.algo.bonus.beishu = bs;
          return this;
        },

          getHitDetailList:function(min, max, ggType){
              var d = new Date();
              var list = [], freeTypes, maxCodes, maxSum, minCodes, minSum,cache = [];
              footballHelper.Es.algo.bonus.minRec = min;
              footballHelper.Es.algo.bonus.maxRec = max;
              footballHelper.Es.algo.bonus.ggTypes = ggType;
              freeTypes = footballHelper.Es.helper.getAllc1(footballHelper.Es.algo.bonus.ggTypes);

              var i = Math.max(footballHelper.Es.algo.bonus.maxRec.length, footballHelper.Es.algo.bonus.minRec.length), ii=i,
                  //isSlide=document.getElementById('isjprizesuc'),
                  isSlide=null,
                  min_hit = footballHelper.Es.helper.getMinGgNum(footballHelper.Es.algo.bonus.ggTypes);
              function getHitNums(c){
                  return maxSum.codeCount[parseInt(c, 10) || 1]||0;
              }

              function getZzClac (isSlide,i,ii,min_hit,maxCodes,maxSum,minCodes,minSum,list,cache,freeTypes){
                  if(i>=min_hit){
                      if (isSlide && i<ii && i>min_hit) {
                          getZzClac(isSlide,i-1,ii,min_hit,maxCodes,maxSum,minCodes,minSum,list,cache,freeTypes);
                      }else{
                          maxCodes = footballHelper.Es.algo.bonus.getHitSingleCodes(i);
                          maxSum = footballHelper.Es.algo.bonus.getBonusSum(maxCodes);
                          minCodes = footballHelper.Es.algo.bonus.getHitSingleCodes(i, true);
                          minSum = footballHelper.Es.algo.bonus.getBonusSum(minCodes);
                          if (isSlide) {
                              list.push({min: minSum.bonus,max: maxSum.bonus});
                          }else{
                              cache[i] = [minCodes, minSum, maxCodes, maxSum];
                              list.push({
                                  num: i,
                                  hitNum: footballHelper.Handle.map(freeTypes, getHitNums),
                                  bs: footballHelper.Es.algo.bonus.beishu,
                                  min: minSum.bonus,
                                  mindetail: minSum.bodetail,
                                  max: maxSum.bonus,
                                  maxdetail: maxSum.bodetail
                              });
                          }
                          getZzClac(isSlide,i-1,ii,min_hit,maxCodes,maxSum,minCodes,minSum,list,cache,freeTypes);
                      }
                  }


                  function getHitNums(c){
                      return maxSum.codeCount[parseInt(c, 10) || 1]||0;
                  }
              }

              getZzClac(isSlide,i,ii,min_hit,maxCodes,maxSum,minCodes,minSum,list,cache,freeTypes);

              list.ggTypes = freeTypes;
              console.log("耗时:"+(new Date() -d));
              return list;
          },
        /**
         * @param min每场的最小玩法集合的sp
         * @param max每场的最大玩法结合的sp
         * @param ggType 过关方式集合
         * @return 返回根据过关方式  命中N场的所对应的最大和最小奖金和注数内容
         */
        getHitList: function (min, max, ggType) {
          var list = [], freeTypes, maxCodes, maxSum, minCodes, minSum;
          footballHelper.Es.algo.bonus.minRec = min;
          footballHelper.Es.algo.bonus.maxRec = max;
          footballHelper.Es.algo.bonus.ggTypes = ggType;
          freeTypes = footballHelper.Es.helper.getAllc1(footballHelper.Es.algo.bonus.ggTypes);
          let cache = [];
          var i = Math.max(footballHelper.Es.algo.bonus.maxRec.length, footballHelper.Es.algo.bonus.minRec.length), ii = i,
              //isSlide=document.getElementById('isjprizesuc'),
              isSlide = null,
              min_hit = footballHelper.Es.helper.getMinGgNum(footballHelper.Es.algo.bonus.ggTypes);
          
          function getHitNums(c) {
            return maxSum.codeCount[parseInt(c, 10) || 1] || 0;
          }

            maxCodes = footballHelper.Es.algo.bonus.getHitSingleCodes(i);
            maxSum = footballHelper.Es.algo.bonus.getBonusSum(maxCodes);
            minCodes = footballHelper.Es.algo.bonus.getHitSingleCodes(min_hit, true);
            minSum = footballHelper.Es.algo.bonus.getBonusSum(minCodes);
            if (isSlide) {
                list.push({min: minSum.bonus,max: maxSum.bonus});
            }else{
                // cache[i] = [minCodes, minSum, maxCodes, maxSum];
                list.push({
                    num: i,
                    hitNum: footballHelper.Handle.map(freeTypes, getHitNums),
                    bs: footballHelper.Es.algo.bonus.beishu,
                    min: minSum.bonus,
                    mindetail: minSum.bodetail,
                    max: maxSum.bonus,
                    maxdetail: maxSum.bodetail
                });
            }
          list.ggTypes = freeTypes;
          return list;
        }
      }
    },
    jczq: {
      algo: this, allBf: [], bfCheckMap: {}, isHtgg: false,
      /**
       * @return 根据比分玩法的31种彩果，组合成互斥成立的其他玩法对应的结果
       */
      init: function () {
        if (footballHelper.Es.jczq.allBf.length == 0) {
          var len = 0;
          for (var i = 0; i < 6; i++) {
            for (var j = 0; j < 6; j++) {
              if (i == 3 && j > 3 || i > 3 && j > 2) {
                continue;
              }
              footballHelper.Es.jczq.allBf[len++] = {
                name: i + '' + j,
                sum: i + j,
                diff: Math.abs(i - j),
                spf: i > j ? 3 : (i < j ? 0 : 1)
              };
            }
          }
          footballHelper.Es.jczq.allBf.push({name: '3A', sum: 7, spf: 3}, {name: '1A', sum: 7, spf: 1}, {
            name: '0A',
            sum: 7,
            spf: 0
          });
          for (i = footballHelper.Es.jczq.allBf.length; i--;) {
            var conf = footballHelper.Es.jczq.allBf[i], item = {}, jqs = conf.sum, spf = conf.spf;
            item['bf-' + conf.name] = 1;
            item['jqs-' + jqs] = 1;
            item['spf-' + spf] = 1;
            if (spf === 3) {
              if (jqs > 2) {
                item['bqc-03'] = 1;
              }
              item['bqc-13'] = 1;
              item['bqc-33'] = 1;
            } else if (spf === 1) {
              if (jqs > 1) {
                item['bqc-01'] = 1;
                item['bqc-31'] = 1;
              }
              item['bqc-11'] = 1;
            } else if (spf === 0) {
              item['bqc-00'] = 1;
              item['bqc-10'] = 1;
              if (jqs > 2) {
                item['bqc-30'] = 1;
              }
            }
            footballHelper.Es.jczq.bfCheckMap[conf.name] = item;
          }
          var sb = "";
          for (var a in  footballHelper.Es.jczq.bfCheckMap) {
            var c = footballHelper.Es.jczq.bfCheckMap[a];
            sb += a + ":{";
            for (var b in c) {
              sb += b + ":" + c[b] + ",";
            }
            sb += "},"
            
          }
          // console.log(sb);
        }
      },
      //判断当前的投注内容是不是混投
      isHt: function (opts) {
        //spf-3#3.00,spf-1#3.20,spf-0#2.10|rspf-3@+1#1.56,rspf-1@+1#3.70,rspf-0@+1#4.60|bf-10#8.25  周一001^bf-3A#5.00
        var str = '';
        for (var i = 0; i < opts.length; i++) {
          var opta = opts[i].split("|");
          for (var j = 0; j < opta.length; j++) {
            var optar = opta[j].split(",");
            for (var k = 0; k < optar.length; k++) {
              if (i == 0 && j == 0 && k == 0)
                str = optar[k].split("-")[0].split("^")[1];
              else if (str != optar[k].split("-")[0].split("^")[1]) {
                return true;
              }
            }
          }
        }
        return false;
      },
      //竞彩足球混投，玩法互斥判断
      testRqSpfByBf: function (str, bf) {
        //spf-3#1.67,spf-1#3.45,spf-0#4.15D
        var rq = parseInt(str.split('#')[0].split('@')[1], 10);
        if (rq > 0) {
          if (bf.name == '0A') {
            if (rq === 1) {
              return str.indexOf('rspf-0') === 0 || str.indexOf('rspf-1') === 0;
            }
            return str.indexOf('rspf-') === 0;
          }
          if (bf.spf < 1) {
            if (rq < bf.diff) {
              return str.indexOf('rspf-0') === 0;
            } else if (rq === bf.diff) {
              return str.indexOf('rspf-1') === 0;
            }
          }
          return str.indexOf('rspf-3') === 0;
        } else {
          rq = Math.abs(rq);
          if (bf.name == '3A') {
            if (rq === 1) {
              return str.indexOf('rspf-3') === 0 || str.indexOf('rspf-1') === 0;
            }
            return str.indexOf('rspf-') === 0;
          }
          if (bf.spf > 0) {
            if (bf.diff > rq) {
              return str.indexOf('rspf-3') === 0;
            } else if (bf.diff === rq) {
              return str.indexOf('rspf-1') === 0;
            }
          }
          return str.indexOf('rspf-0') === 0;
        }
      },
      //处理单个比分假设成立，互斥之后，留下的结果
      filterInvalidOpts: function (single, bf) {
        var ret = [], len = 0, filter = footballHelper.Es.jczq.bfCheckMap[bf.name];
        
        function test(str) {
          if (str.indexOf('rspf') === 0) {
            return footballHelper.Es.jczq.testRqSpfByBf(str, bf);
          }
          return str.split('#')[0] in filter;
        }
        
        for (var i = 0, j = single.length; i < j; i++) {
//					var types = single[i].split(',').filter(test);
          var types = footballHelper.JS.filter(single[i].split(','), test);
          if (types.length) {
            ret[len++] = types;
          }
        }
        return ret;
      },
      /**
       *通过互斥筛选出单场比赛的最大sp集合和最小sp集合
       */
      getSgBound: function (str) {
        var single, matchNo, minSum = 9e9, maxSum = -1, isHhgg = footballHelper.Es.jczq.isHtgg,
            minOpts = [], maxOpts = [], minBf, maxBf, dan = str.indexOf('D') > -1;
        if (str.indexOf('^') > -1) {
          var strs = str.split('^');
          matchNo = strs[0];
          single = strs[1].split('|');
        } else {
          single = str.split('|');
        }
        //是混投走这里
        if (isHhgg) {
          //通过互斥来循环筛选出每场比赛的最大最小奖金投注选项
          footballHelper.Handle.forEach(footballHelper.Es.jczq.allBf, function (bf) {
            
            var optsAl = footballHelper.MathUtil.al(footballHelper.Es.jczq.filterInvalidOpts(single, bf)), hits, sum;
            for (var i = 0, j = optsAl.length; i < j; i++) {
              hits = optsAl[i];
              sum = 0;
              for (var k = hits.length; k--;) {
                hits[k] = parseFloat(hits[k].split('#')[1]) || 1;
                sum += hits[k];
              }
              if (sum > maxSum) {
                maxSum = sum;
                maxOpts = hits.slice();
                maxBf = bf.name;
              }
              if (sum < minSum) {
                minSum = sum;
                minOpts = hits.slice();
                minBf = bf.name;
              }
            }
          });
        } else {
          //不是混投，直接赛选出每场的最大和最小sp即可
          var optsAl = str.split(','), sp;
          for (var i = 0, j = optsAl.length; i < j; i++) {
            sp = parseFloat(optsAl[i].split('#')[1]) || 1;
            if (sp > maxSum) {
              maxSum = sp;
              maxOpts = [sp];
            }
            if (sp < minSum) {
              minSum = sp;
              minOpts = [sp];
            }
          }
        }
        minOpts.sum = minSum;
        minOpts.bf = minBf;
        minOpts.matchno = matchNo;
        maxOpts.sum = maxSum;
        maxOpts.bf = maxBf;
        maxOpts.matchno = matchNo;
        minOpts.isdan = maxOpts.isdan = dan;
        return [minOpts, maxOpts];
      },
      /**
       *通过互斥筛选出单场比赛的最大sp集合和最小sp集合
       */
      getLimitOpts: function (opts) {
        var minOpts = [], maxOpts = [], j = 0;
        footballHelper.Handle.forEach(opts, function (opt) {
          if (opt) {
            var real = footballHelper.Es.jczq.getSgBound(opt);
            minOpts[j] = real[0];
            maxOpts[j++] = real[1];
          }
        });
        minOpts.sort(function (a, b) {
          return a.sum > b.sum ? 1 : -1;
        });
        maxOpts.sort(function (a, b) {
          return a.sum > b.sum ? -1 : 1;
        });
        return {min: minOpts, max: maxOpts};
      },
      //得到每场的假设成立的最小奖金和最大奖金比分结果
      getBfRange: function (opts) {
        return footballHelper.Handle.map(opts, function (opt) {
          var real = footballHelper.Es.jczq.getSgBound(opt);
          return [real[0].bf, real[1].bf];
        });
      },
      /**
       * 奖金范围
       * @param opts 投注内容
       * @param ggType 过关方式
       * @noMin false 返回最大和最小，true只要最大奖金
       * @param bs 倍数
       */
      getBonusRange: function (opts, ggType, noMin, bs) {
        footballHelper.Es.jczq.isHtgg = footballHelper.Es.jczq.isHt(opts);
        if (bs) {
          footballHelper.Es.algo.bonus.setBeishu(bs);
        }
        if (noMin) {
          var t = footballHelper.Es.jczq.getLimitOpts(opts);
          return [0, footballHelper.Es.algo.bonus.getMaxBonus(t.max, ggType)];
        } else {
          //数组例如：3场比赛，2串1过关，  这里就会返回命中2场和3场的最小和最大奖金，根据场次从大到小排序
          var info = footballHelper.Es.jczq.getHitList(opts, ggType);
          //取最后一个的min得到方案的最小奖金，取第一个的max得到最大奖金
          return [info[info.length - 1].min, info[0].max];
        }
      },
      //返回命中N场的结果
      getHitList: function (opts, ggType) {
        var real = footballHelper.Es.jczq.getLimitOpts(opts);
        return footballHelper.Es.algo.bonus.getHitList(real.min, real.max, ggType);
      },
        getHitDetailList : function(opts, ggType){
            var real = footballHelper.Es.jczq.getLimitOpts(opts);
            return footballHelper.Es.algo.bonus.getHitDetailList(real.min, real.max, ggType);
        },
      /**
       * @param code ： "sf-1#1.30,sf-2#2.64|rfsf-2@-5.5#1.82|dxf-2#1.75" 每一场选的内容
       * @return ["2-sf","1-rfsf","1-dxf"]
       */
      getPlayNum: function (code) {
        return footballHelper.Handle.map(code.split('|'), function (plays) {
          return plays.split(',').length + '-' + plays.split('-')[0];
        });
      },
      //计算注数
      getCodesCount: function (opts, ggType, del) {
        var HR = footballHelper.Es.helper, zs = 0, dl = [], tl = [];
        footballHelper.Handle.forEach(opts, function (lc) {
          var gc = footballHelper.Es.jczq.getPlayNum(lc);
          gc.isdan = lc.indexOf('D') > -1;
          //根据你是否是定胆放入   胆 或 拖得集合中
          if (gc.isdan) {
            dl.push(gc);
          } else {
            tl.push(gc);
          }
        });
        footballHelper.Handle.forEach(ggType, function (type) {
          zs += HR.getCodesCount(dl, tl, type, del);
        }, this);
        return zs;
      }
    },
    jclq: {
      algo: this, allSfc: [], checkMapBySfc: {}, isHtgg: false,
      //初始化竞彩篮球的互斥玩法结果集
      init: function () {
        for (var i = 0; i < 2; i++) {//0=s,1=f
          for (var j = 0; j < 6; j++) {
            footballHelper.Es.jclq.allSfc.push({
              name: i + '' + (j + 1),
              diff: j * 5 + 1,
              win: i == 1 ? 2 : 1
            });
          }
        }
        for (var i = footballHelper.Es.jclq.allSfc.length; i--;) {
          var curSfc = footballHelper.Es.jclq.allSfc[i], item = {};
          item['sfc-' + curSfc.name] = 1;
          item['sf-' + curSfc.win] = 1;
          item['dxf-1'] = 1;
          item['dxf-2'] = 1;
          footballHelper.Es.jclq.checkMapBySfc[curSfc.name] = item;
        }
      },
      /**
       * @param opts 投注内容
       * 判断是否是混合投注
       * @return boolean true是混合  false：不是
       */
      isHt: function (opts) {
        //nspf-3#3.00,nspf-1#3.20,nspf-0#2.10|spf-3@+1#1.56,spf-1@+1#3.70,spf-0@+1#4.60|bf-10#8.25
        var str = '';
        for (var i = 0; i < opts.length; i++) {
          var opta = opts[i].split("|");
          for (var j = 0; j < opta.length; j++) {
            var optar = opta[j].split(",");
            for (var k = 0; k < optar.length; k++) {
              if (i == 0 && j == 0 && k == 0)
                str = optar[k].split("-")[0];
              else if (str != optar[k].split("-")[0]) {
                return true;
              }
            }
          }
        }
        return false;
      },
      testRfSfBySfc: function (str, sfc, def) {
        var rf = parseInt(str.split('#')[0].split('@')[1], 10),
            isSf1 = str.indexOf('rfsf-1') === 0;
        if (rf < -26)
          rf = -26;
        else if (rf > 26)
          rf = 26;
        return sfc.win === 1 ? ((rf + sfc.diff < 0) ? !isSf1 : isSf1) :
            ((rf - sfc.diff > 0) ? isSf1 : !isSf1);
      },
      filterInvalidOpts: function (single, bf) {
        var ret = [], len = 0, filter = footballHelper.Es.jclq.checkMapBySfc[bf.name];
        
        function test(str) {
          if (str.indexOf('rfsf-') === 0) {
            return footballHelper.Es.jclq.testRfSfBySfc(str, bf);
          }
          return str.split('#')[0] in filter;
        }
        
        for (var i = 0, j = single.length; i < j; i++) {
//					var types = single[i].split(',').filter(test);
          var types = footballHelper.JS.filter(single[i].split(','), test);
          if (types.length) {
            ret[len++] = types;
          }
        }
        return ret;
      },
      getSgBound: function (str) {
        //通过|分割单场投注的玩法内容
        var single, matchNo, minSum = 9e9, maxSum = -1, isHhgg = footballHelper.Es.jclq.isHtgg, minOpts = [], maxOpts = [], minBf, maxBf, dan = str.indexOf('D') > -1;//如果包含D则视为定胆
        if (str.indexOf('^') > -1) {
          var strs = str.split('^');
          matchNo = strs[0];
          single = strs[1].split('|');
        } else {
          single = str.split('|');
        }
        //是混投走这里
        if (isHhgg) {
          //通过互斥来循环筛选出每场比赛的最大最小奖金投注选项
          footballHelper.Handle.forEach(footballHelper.Es.jclq.allSfc, function (bf) {
            var optsAl = footballHelper.MathUtil.al(footballHelper.Es.jclq.filterInvalidOpts(single, bf)), hits, sum;
            for (var i = 0, j = optsAl.length; i < j; i++) {
              hits = optsAl[i];
              sum = 0;
              for (var k = hits.length; k--;) {
                hits[k] = parseFloat(hits[k].split('#')[1]) || 1;
                sum += hits[k];
              }
              if (sum > maxSum) {
                maxSum = sum;
                maxOpts = hits.slice();
                maxBf = bf.name;
              }
              if (sum < minSum) {
                minSum = sum;
                minOpts = hits.slice();
                minBf = bf.name;
              }
            }
          });
        } else {
          //不是混投，直接赛选出每场的最大和最小sp即可
          var optsAl = str.split(','), sp;
          for (var i = 0, j = optsAl.length; i < j; i++) {
            sp = parseFloat(optsAl[i].split('#')[1]) || 1;
            if (sp > maxSum) {
              maxSum = sp;
              maxOpts = [sp];
            }
            if (sp < minSum) {
              minSum = sp;
              minOpts = [sp];
            }
          }
        }
        minOpts.sum = minSum;
        minOpts.bf = minBf;
        minOpts.matchno = matchNo;
        maxOpts.sum = maxSum;
        maxOpts.bf = maxBf;
        maxOpts.matchno = matchNo;
        minOpts.isdan = maxOpts.isdan = dan;
        return [minOpts, maxOpts];
      },
      getLimitOpts: function (opts) {
        var minOpts = [], maxOpts = [], j = 0;
        footballHelper.Handle.forEach(opts, function (opt) {
          if (opt) {
            var real = footballHelper.Es.jclq.getSgBound(opt);
            minOpts[j] = real[0];
            maxOpts[j++] = real[1];
          }
        });
        minOpts.sort(function (a, b) {
          return a.sum > b.sum ? 1 : -1;
        });
        maxOpts.sort(function (a, b) {
          return a.sum > b.sum ? -1 : 1;
        });
        return {min: minOpts, max: maxOpts};
      },
      //得到每场的假设成立的最小奖金和最大奖金比分结果
      getBfRange: function (opts) {
        return footballHelper.Handle.map(opts, function (opt) {
          var real = footballHelper.Es.jc.getSgBound(opt);
          return [real[0].bf, real[1].bf];
        });
      },
      /**
       * 奖金范围
       * @param opts 投注内容
       * @param ggType 过关方式
       * @noMin false 返回最大和最小，true只要最大奖金
       * @param bs 倍数
       */
      getBonusRange: function (opts, ggType, noMin, bs) {
        footballHelper.Es.jclq.isHtgg = footballHelper.Es.jclq.isHt(opts);
        if (bs) {
          footballHelper.Es.algo.bonus.setBeishu(bs);
        }
        if (noMin) {
          var t = footballHelper.Es.jclq.getLimitOpts(opts);
          return [0, footbaLlHelper.Es.algo.bonus.getMaxBonus(t.max, ggType)];
        } else {
          var info = footballHelper.Es.jclq.getHitList(opts, ggType);
          return info.length ? [info[info.length - 1].min, info[0].max] : [0, 0];
        }
      },
      //返回命中N场的结果
      getHitList: function (opts, ggType) {
        var real = footballHelper.Es.jclq.getLimitOpts(opts);
        return footballHelper.Es.algo.bonus.getHitList(real.min, real.max, ggType);
      },
        getHitDetailList : function(opts, ggType){
            var real = footballHelper.Es.jclq.getLimitOpts(opts);
            return footballHelper.Es.algo.bonus.getHitDetailList(real.min, real.max, ggType);
        },
      /**
       * @param code ： "sf-1#1.30,sf-2#2.64|rfsf-2@-5.5#1.82|dxf-2#1.75" 每一场选的内容
       * @return ["2-sf","1-rfsf","1-dxf"]
       */
      getPlayNum: function (code) {
        return footballHelper.Handle.map(code.split('|'), function (plays) {
          return plays.split(',').length + '-' + plays.split('-')[0];
        });
      },
      //计算注数
      getCodesCount: function (opts, ggType, del) {
        var HR = footballHelper.Es.helper, zs = 0, dl = [], tl = [];
        footballHelper.Handle.forEach(opts, function (lc) {
          var gc = footballHelper.Es.jclq.getPlayNum(lc);
          gc.isdan = lc.indexOf('D') > -1;
          if (gc.isdan) {
            dl.push(gc);
          } else {
            tl.push(gc);
          }
        });
        footballHelper.Handle.forEach(ggType, function (type) {
          zs += HR.getCodesCount(dl, tl, type, del);
        }, this);
        return zs;
      }
    }
  },
  /****************************************组合工具类***********************************************/
  MathUtil: {
    c: function (len, m) {
      return (function (n1, n2, j, i, n) {
        for (; j <= m;) {
          n2 *= j++;
          n1 *= i--
        }
        return n1 / n2
      })(1, 1, 1, len, len)
    },
    cl: function (arr, n, z) {
      var r = [];
      
      function fn(t, a, n) {
        if (n === 0 || z && r.length == z) {
          r[r.length] = t;
          return t
        }
        for (var i = 0, l = a.length - n; i <= l; i++) {
          if (!z || r.length < z) {
            var b = t.slice();
            b.push(a[i]);
            fn(b, a.slice(i + 1), n - 1)
          }
        }
      }
      
      fn([], arr, n);
      return r
    },
    p: function (n, m) {
      for (var i = n - m, c = 1; i < n;) {
        c *= ++i
      }
      return c
    },
    pl: function (arr, n, z) {
      var r = [];
      
      function fn(t, a, n) {
        if (n === 0 || z && r.length == z) {
          r[r.length] = t;
          return t
        }
        for (var i = 0, l = a.length; i < l; i++) {
          if (!z || r.length < z) {
            fn(t.concat(a[i]), a.slice(0, i).concat(a.slice(i + 1)), n - 1)
          }
        }
      }
      
      fn([], arr, n);
      return r
    },
    dt: function (d, t, m) {
      return d >= m ? 0 : footballHelper.MathUtil.c(t, m - d)
    },
    dtl: function (d, t, n, z) {
      var r = [];
      if (d.length <= n) {
        r = footballHelper.MathUtil.cl(t, n - d.length, z);
        for (var i = r.length; i--;) {
          r[i] = d.concat(r[i])
        }
      }
      return r;
    },
    bl: function (ml, b) {
      var A, bs, B = 0,
          bl = [];
      for (var i = ml.length; i--;) {
        B += (1 / ml[i]);
      }
      A = b / B;
      for (i = ml.length; i--;) {
        bs = A / ml[i];
        bl[i] = bs;
      }
      return bl;
    },
    round2: function (n) {
      if (/\d+\.\d\d5/.test(n.toString())) {
        var m = n.toString().match(/\d+\.\d(\d)/);
        return (m && m[1] % 2 == 1) ? parseFloat(n).toFixed(2) : parseFloat(m[0])
      } else {
        return parseFloat(parseFloat(n).toFixed(2))
      }
    },
    a: function (A1) {
      var ret = 1;
      for (var i = 0, j = A1.length; i < j; i++) {
        ret *= A1[i]
      }
      return j ? ret : 0
    },
    al: function (A2, fn) {
      var n = 0,
          codes = [],
          code = [],
          isTest = footballHelper.Handle.isFunction(fn);
      
      function each(A2, n) {
        if (n >= A2.length) {
          if (!isTest || false !== fn(code)) {
            codes.push(code.slice())
          }
          code.length = n - 1;
        } else {
          var cur = A2[n];
          for (var i = 0, j = cur.length; i < j; i++) {
            code.push(cur[i]);
            each(A2, n + 1);
          }
          if (n) {
            code.length = n - 1;
          }
        }
      }
      
      if (A2.length) {
        each(A2, n);
      }
      return codes
    },
    aln: function (A2, fn) {
      var n = 0,
          codes = [],
          code = [],
          isTest = footballHelper.Handle.isFunction(fn);
      
      function each(A2, n) {
        if (n >= A2.length) {
          if (!isTest || false !== fn(code)) {
            codes.push(code.slice())
          }
          code.length = n - 1;
        } else {
          var cur = A2[n];
          for (var i = 0, j = cur.length; i < j; i++) {
            if (cur.matchno) {
              code.push(cur.matchno.concat('^').concat(cur[i]));
            } else {
              code.push(cur[i]);
            }
            
            each(A2, n + 1);
          }
          if (n) {
            code.length = n - 1;
          }
        }
      }
      
      if (A2.length) {
        each(A2, n);
      }
      return codes
    }
  },
  
  Handle: {
    
    'forEach': function (o, f, z) {
      if (o) {
        for (var i = 0, j = o.length; i < j; i++) {
          if (false === f.call(z || o[i], o[i], i, o, j)) {
            break;
          }
        }
      }
      return z || o;
    },
    'isFunction': function (s) {
      return typeof(s) == 'function' && s.call;
    },
    'trim': function (s) {
      return s.replace(/^\s+|\s+$/g, '');
    },
    'map': function (a, f, o) {
      return footballHelper.Handle.each(a, function (v, k, a, j) {
        this.push(f.call(o || v, v, k, a, j))
      }, [])
    },
    'intt': function (n) {
      return parseInt(n, 10);
    },
    'reduce': function (a, fn, b, o) {
      footballHelper.Handle.each(a, function (v, k, a, j) {
        if (b === undefined) {
          b = v;
        } else {
          b = fn.call(o || v, b, v, k, a, j);
        }
      });
      return b;
    },
    'each': function (o, f, z) {
      return (o && footballHelper.Handle.arrayLike(o)) ? footballHelper.Handle.forEach(o, f, z) : footballHelper.Handle.forIn(o, f, z);
    },
    'arrayLike': function (o) {
      return typeof o === 'object' && isFinite(o.length);
    },
    'forIn': function (o, f, z) {
      var k, i = 0;
      if (o) {
        for (k in o) {
          if (footballHelper.Handle.has(o, k) && false === f.call(z || o[k], o[k], k, o, i++)) {
            break;
          }
        }
      }
      return z || o;
    },
    'has': function (o, k) {
      var _has = {}.hasOwnProperty;
      return _has.call(o, k);
    },
    'parseSingle': function (list, min) {//从中奖单注集内统计n串1的个数和奖金和
      function sortMaxCon(a, b) {
        return parseFloat(a.sumsp > parseFloat(b.sumsp) ? 1 : -1);
      }
      
      var cl = {}, sum = 0, info = [], bs = this.bs, content = [], content_s = [], sp_con = [];
      for (var i = 0, j = list.length; i < j; i++) {
        var code = list[i], b = 1, len = code.length, con = [];
        for (var x = code.length; x--;) {
          var codes = code[x];
          var codessp = Number(footballHelper.Handle.getReaplceByVar(codes.sp + ""));
          b *= codessp;
          if (codes)
            con.push(codes.gameid + "-" + codes.isrpf + "-" + codes.val);
        }
        if (con.length > 1) content.push(con.join("^"));
        if (b) {//为0时不计入统计
          var sp = parseFloat(footballHelper.Handle.cauScale(2, b * 2 / Math.pow(10, code.length * 2)));
          if (min) content_s.push({"sumsp": sp, con: con.join("^")});
          sp_con.push(sp);
          if (!(len in cl)) {
            cl[len] = 0;
          }
          cl[len]++;
        }
      }
      var resultsum = min ? parseFloat(footballHelper.Handle.cauScale(2, eval("Math.min(" + sp_con.join(",") + ")"))) : parseFloat(footballHelper.Handle.cauScale(2, eval(sp_con.join("+"))));
      var resultcontent = min ? content_s.sort(sortMaxCon).slice(0, 1)[0].con : content.join("/");
      return {bonus: resultsum, codeCount: cl, content: resultcontent};
    },
    'getReaplceByVar': function (valu) {
      return valu.indexOf(".") != -1 ? (valu.substring(valu.indexOf(".") + 1, valu.length).length < 2 ? valu.replace(".", "") + "0" : valu.toString().replace(".", "")) : (valu + "00");
    },
    
    /**
     * 四舍六入五成双 - 奖金计算方式
     * @param mod 精度-要处理的小数点位数（ 值必须大于0）
     * @param big 处理值（值必须大于0）
     * @returns
     */
    'cauScale': function (mod, big) {
      if (mod <= 0) return big;
      if (big <= 0) return big;
      var mathstr = big.toString();
      var dian = mathstr.indexOf(".");
      if (dian > 0 && mathstr.length - dian - 1 > mod) {
        var base = mathstr.substring(0, dian);
        var adress = mathstr.substring(dian + 1, mathstr.length);
        if (adress.length <= mod) {
          base = base + "." + adress;
        } else if (adress.length >= mod + 1) {
          var v = parseInt(adress.substring(mod, mod + 1), 10);//精确位小数后一位
          var v1 = parseInt(adress.substring(mod - 1, mod), 10);//精确位小数。
          var m = 0;
          
          if (v >= 6) { //精确位后大于等于6，精确位进一
            m++;
          } else if (v <= 4) {//精确位后小于等于4，精确位后舍弃
            ;
          }
          //			else if (v == 5 && adress.length > mod + 1) {//精确位后为5时，精确位后一位还有其他值，精确位进一
          //				m++;
          //			}
          else if (v == 5 && v1 % 2 == 0) {//精确位后为5时，精确位前为偶时，精确位后一位舍弃。
            ;
          } else if (v == 5 && v1 % 2 == 1) {//精确位后为5时，精确位前为奇时，精确位进一
            m++;
          }
          var s = adress.substring(0, mod - 1);
          var fl = s + v1;
          if (m > 0 && parseInt(s, 10) > 0) {
            fl = parseInt(fl, 10) + 1;
            if (fl >= Math.pow(10, mod)) {
              base = parseInt(base, 10) + 1;
              fl = fl % 100;
            }
            big = base.toString() + "." + fl.toString();
          }
          else if (m > 0 && parseInt(s, 10) == 0) {
            fl = v1 + 1;
            if (fl >= Math.pow(10, mod)) {
              base = parseInt(base, 10) + 1;
              fl = fl % 100;
            } else if (fl < 10) {
              var tempfl = '';
              for (var k = 0; k < mod - 1; k++) {
                tempfl += '0';
              }
              fl = tempfl + fl;
            }
            else if (fl == 10) {
              var tempfl = '';
              for (var k = 0; k < mod - 2; k++) {
                tempfl += '0';
              }
              fl = tempfl + fl;
            }
            big = base.toString() + "." + fl.toString();
          }
          else {
            big = base + "." + fl;
          }
        }
      }
      //	if(mod<=0) return big;
      //	if(big<=0) return big;
      //	big = Math.floor(big*100)/100;
      return big;
    }
  },


//足彩所有的彩种id初始化
  footballLotteryId: {
    JCZQLotteryIds: {
      HT: 30001,//混投
      SPF: 30002,//胜平负
      RSPF: 30003,//让球胜平负
      BF: 30004,//比分
      ZJQ: 30005,//总进球
      BQC: 30006//半全场
    },
    JCLQLotteryIds: {
      SF: 30101,//篮球胜负
      RSF: 30102,//让分
      DXF: 30103,//大小分
      SFC: 30104,//胜分差
      HT: 30105//混合过关
    },
    //检验是否jczq彩种
    checkIsJczqLotteryId: function (lotteryId) {
      for (var i in footballHelper.footballLotteryId.JCZQLotteryIds) {
        if (lotteryId === footballHelper.footballLotteryId.JCZQLotteryIds[i]) {
          return true;
          
        }
      }
      
      return false;
    },
    //检验是否jclq彩种
    checkIsJclqLotteryId: function (lotteryId) {
      for (var i in footballHelper.footballLotteryId.JCLQLotteryIds) {
        if (lotteryId === footballHelper.footballLotteryId.JCLQLotteryIds[i]) {
          return true;
        }
      }
      
      return false;
    }
    
  },
  JS: {
    forEach: function (o, f, z) {
      if (o) {
        for (var i = 0, j = o.length; i < j; i++) {
          if (false === f.call(z || o[i], o[i], i, o, j)) {
            break;
          }
        }
      }
      return z || o;
    },
    isFunction: function (s) {
      return typeof(s) == 'function' && s.call;
    },
    trim: function (s) {
      return s.replace(/^\s+|\s+$/g, '');
    },
    intt: function (n) {
      return parseInt(n, 10);
    },
    reduce: function (a, fn, b, o) {
      footballHelper.JS.each(a, function (v, k, a, j) {
        if (b === none) {
          b = v;
        } else {
          b = fn.call(o || v, b, v, k, a, j);
        }
      });
      return b;
    },
    each: function (fn, _b) {
      return footballHelper.JS.forEach(this, fn, _b);
    },
    map: function (a, f, o) {
      return each(a, function (v, k, a, j) {
        this.push(f.call(o || v, v, k, a, j))
      }, [])
    },
    filter: function (a, f, o) {
      return footballHelper.JS.forEach(a, function (v, k, a, j) {
        if (f.call(o || v, v, k, a, j)) {
          this.push(v)
        }
      }, [])
    }
  }
  
}
export default footballHelper;
