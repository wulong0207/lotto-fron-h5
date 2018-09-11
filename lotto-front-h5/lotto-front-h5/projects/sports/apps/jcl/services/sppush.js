import io from 'socket.io-client';
import { BASKETBALL_FETCH_DATA_SUCCESS } from '../redux/actions/basketball';
import store from '../store';
import { loopBets } from '../utils/bet';
import {
  getCurrentMode,
  getGameById,
  getSelectBet,
  getSP,
  getCurrentStore,
  deepClone
} from '../utils/basketball';

export class SPEntity {
  constructor() {
    // 投注实体
    this.entity = {
      // 键名：键值
      // <id>: {<selection>: <sp>, ...}
    };
  }

  /**
   * 根据传入投注内容刷新当前实体的投注内容
   */
  update(id, selectList, spMap) {
    let newEntity = {};

    selectList.map((val, i) => {
      newEntity[val] = (this.entity[id] || {})[val] || spMap[val];
    });

    this.entity[id] = newEntity;
  }

  // 获取SP值
  getSP(id, sel) {
    return (this.entity[id] || {})[sel];
  }
}

class SpPush {
  constructor() {
    this.originSP = {
      // <mode> : <SPEntity>
    };
    this.changes = [];
  }

  startSocket() {
    let socketUri = 'wss://ts.2ncai.com/';
    if (process.env.RUN_ENV === 'sit') {
      socketUri = 'wss://sitts.2ncai.com/';
    } else if (process.env.RUN_ENV === 'uat') {
      socketUri = 'wss://uatts.2ncai.com/';
    } else if (process.env.RUN_ENV === 'dev') {
      socketUri = 'ws://192.168.69.33:19092/';
    }
    this.socket = io.connect(socketUri, {
      reconnectionAttempts: 10
    });
    this.socket.on('connect', () => {
      console.log(`socket ${socketUri} connected`);
    });
    this.socket.on('getPushBasketballSp', data => {
      const updateData = JSON.parse(decodeURIComponent(data));
      console.log(updateData);
      this.saveOldPanKou();
      this.updateSp(updateData);
      this.getSPChanges();
    });
  }

  show() {
    store.dispatch({
      type: 'SP_PANKOU'
    });
  }

  updateSp(data) {
    let bd = deepClone(getCurrentStore('basketball'));
    bd.requestSuccessTime = new Date().getTime();
    let dict = this.generateDictionary(data);
    let date = new Date();
    let serviceTime = `${date.getFullYear()}-${date.getMonth()}-${date.getDay()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    let games = bd.data.map((v, i) => {
      let sp = dict[v.id];
      if (!sp) {
        return v;
      }

      // 更新大小分
      v = this.changeFiled(v, sp.bs, ['p_score', 'b', 's', 'serviceTime']);
      // 更新胜负及让分胜负
      v = this.changeFiled(v, sp.wf, [
        'w',
        'l',
        'serviceTime',
        'let_score',
        'let_w',
        'let_l',
        'serviceTime'
      ]);
      // 更新大小分
      v = this.changeFiled(v, sp.ws.lost, [
        'L15',
        'L610',
        'L1115',
        'L1620',
        'L2125',
        'L26',
        'serviceTime'
      ]);
      v = this.changeFiled(v, sp.ws.win, [
        'w15',
        'w610',
        'w1115',
        'w1620',
        'w2125',
        'w26',
        'serviceTime'
      ]);

      if (sp.bs[3]) {
        v.bsServerTime = sp.bs[3];
      }
      if (sp.wf[2]) {
        v.wServerTime = sp.wf[2];
      }
      if (sp.wf[6]) {
        v.fwServerTime = sp.wf[6];
      }
      if (sp.ws.lost[6]) {
        v.wlServerTime = sp.ws.lost[6];
      }
      if (sp.ws.win[6]) {
        v.wwServerTime = sp.ws.win[6];
      }

      if (
        v.serviceTime &&
        this.getTime(v.serviceTime) > this.getTime(serviceTime)
      ) {
        serviceTime = v.serviceTime;
      }

      return v;
    });

    store.dispatch({
      type: BASKETBALL_FETCH_DATA_SUCCESS,
      data: {
        data: games,
        serverTime: serviceTime
      }
    });
  }

  getTime(dateStr) {
    return new Date(dateStr.replace(/-/g, '/')).getTime();
  }

  /**
   * 更新字段
   */
  changeFiled(data, arr, fields) {
    if (arr && arr.length && data) {
      arr.map((val, i) => {
        if (fields[i] && val) {
          if (fields[i] == 'serviceTime') {
            if (data.serviceTime) {
              data.serviceTime =
                this.getTime(val) > this.getTime(data.serviceTime)
                  ? val
                  : data.serviceTime;
            } else {
              data.serviceTime = val;
            }
          } else {
            data[fields[i]] = val;
          }
        }
      });
    }

    return data;
  }

  /**
   * 根据数组生成返回ID与内容对应的键值对象
   */
  generateDictionary(data) {
    let result = {};
    if (data && data.length) {
      data.map((val, i) => {
        result[val.id] = val;
      });
    }

    return result;
  }

  /**
   * 存储旧的盘口信息
   */
  saveOldPanKou() {
    // 旧的SP值信息
    let { originSP } = this;
    let mode = getCurrentMode();
    originSP[mode] = originSP[mode] || new SPEntity();
    // 新的SP存储
    let newSPSrc = {};
    let state = getCurrentStore();
    let gameDatas = state.basketball.data;
    // 得到所有玩法投注内容
    loopBets(
      state.betSelected.bets,
      (item, field) => {
        // 获取SP值
        let selectList = getSelectBet(item, mode);
        let sp = getSP(gameDatas, item.id);
        originSP[mode].update(item.id, selectList, sp);
      },
      true
    );
  }

  /**
   * 清除信息
   */
  clear() {
    this.originSP = {};
    this.changes = [];
  }

  // 获取当前SP值的数据变化
  getSPChanges() {
    // 旧的SP值信息
    let { originSP } = this;
    let state = getCurrentStore();
    let gameDatas = state.basketball.data;
    let mode = getCurrentMode();
    let result = [];
    // 得到所有玩法投注内容
    loopBets(
      state.betSelected.bets,
      (item, field) => {
        // 获取SP值
        let selectList = getSelectBet(item, mode);
        let sp = getSP(gameDatas, item.id);
        let game = getGameById(item.id).game;

        selectList.map((val, i) => {
          // 是否有更新
          if (!originSP[mode]) return;
          let old = originSP[mode].getSP(item.id, val);
          if (!old) return;
          let date;

          if (val.indexOf('rfsf') >= 0) date = game.fwServerTime;
          else if (val.indexOf('dxf') >= 0) date = game.bsServerTime;
          else if (val.indexOf('sfc-1') >= 0) date = game.wlServerTime;
          else if (val.indexOf('sfc-0') >= 0) date = game.wwServerTime;
          else if (val.indexOf('sf') >= 0) date = game.wServerTime;

          let cur = {
            cc: field, // 场次
            date,
            old,
            last: sp[val] // 最新的
          };

          if (cur.old == cur.last) return;

          result.push(cur);
        });
      },
      true
    );

    this.changes = result;

    return result;
  }
}

export default new SpPush();
