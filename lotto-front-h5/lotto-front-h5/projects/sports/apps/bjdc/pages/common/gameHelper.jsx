import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import BoxView from "../../components/box-view.jsx";
import {getGameAreaTitle} from "../../utils.js";
import Empty from "../../components/empty.jsx";
import {getCurrentStore} from "../../utils/basketball.js";

//检查是否处在销售阶段, true有销售的玩法，false无
export function checkSell(mode, sv){
    switch(mode){
        //混合过关
        case 'mix': {
            return !(sv.statusWf == 4 && sv.statusLetWf == 4 &&
                     sv.statusBigSmall == 4 && sv.statusScoreWf == 4);
        }break;
        //胜负
        case 'sf': {
            return sv.statusWf != 4;
        }break;
        //胜分差
        case 'sfc': {
            return sv.statusScoreWf != 4;
        }break;
        //大小分
        case 'dxf': {
            return sv.statusBigSmall != 4;
        }break;
        //让分胜负
        case 'rfsf': {
            return sv.statusLetWf != 4;
        }break;
        //单关
        case 'single' :{
            return !((sv.statusWf == 2 || sv.statusWf == 4) &&
                     (sv.statusLetWf == 2 || sv.statusLetWf == 4)&&
                       (sv.statusBigSmall == 2 || sv.statusBigSmall == 4) &&
                        (sv.statusScoreWf == 2 || sv.statusScoreWf == 4));
        }break;
        default: {
            return true;
        }
    }
}

//生成赛事，并生成包含赛事的容器
export function renderBoxView(mode, data, renderGame){
    let hasData = false;

    if(data){
        let result = data.map((val, index)=>{
            let subHasData = false;
            let length = 0;
            let subResult = val.matchs.map((sv, si)=>{
                if(checkSell(mode, sv)){
                    length++;
                    hasData = true;
                    subHasData = true;
                    return renderGame(sv, si);
                }
            });
            let title = getGameAreaTitle(val.date, length);

            if(subHasData){
                return <BoxView title={title} key={index}>
                    {subResult}
                </BoxView>
            }
        });

        return hasData ? result: hasData;
    }else{
        return hasData;
    }
}

//生成比赛场次
export function renderGames(mode, data, renderGame){
    let games = renderBoxView(mode, data, renderGame);
    let {basketball} = getCurrentStore();
    let empty = basketball.requestStatus == "pending"?<div className="loading">
                <div className="loader"></div>
                <span>加载中...</span>
            </div>:<Empty/>;
    return games ? games: empty;
}
