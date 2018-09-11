import React, {Component } from 'react';
import PropTypes from 'prop-types';
import Alert from '@/services/message';
import { isEmpty } from 'lodash';
import "../css/pages/mix.scss";
import BoxView from "../components/box-view.jsx";
import Match from "../components/match.jsx"; //胜负
import {getGameAreaTitle} from "../utils.js";
import {getSelected} from "../utils/bet.js";
import BetBar from "@/component/bet-bar.jsx";
import {renderGames} from "./common/gameHelper.jsx";

import {select,calcBet} from "../redux/actions/bet.js";
import { toggle } from '../redux/actions/sphistory.js';
import { connect } from 'react-redux';

//胜负
class SFPage extends Component {
    constructor (props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount () {

    }

    componentWillReceiveProps (nextProps) {

    }

    //胜负, 让分胜负,大小分,通用选择
    onSelectSF(selection, data, betKind){
        this.props.onSelectSF(selection, data, betKind);
    }

    //生成比赛
    renderGame(game, i){
        let {toggleSP, onSelectSF, bets} = this.props;
        let selection = getSelected(bets, game, "sf");

        return <div className="game" key={i}>
            <div className="">
                <Match sellMark={2} field="sf" select={selection} onSelect={this.onSelectSF.bind(this)} onCenterClick={toggleSP} data={game}/>
            </div>
        </div>
    }

    render () {
        let {data, bet} = this.props;

        return (
            <div className="yc-mix">
                {renderGames("sf", data, this.renderGame.bind(this))}
            </div>
      );
    }
}

SFPage.propTypes = {

};


const mapStateToProps = state => {
    return {
        bets: state.betSelected.bets, //投注选择
    }
}

const mapDispatchToProps = dispatch => {
    return {
        toggleSP(data, betKind){
            dispatch(toggle(data, betKind));
        },
        onSelectSF(selection, data, mainBetKind){
            dispatch(select(selection, data, "sf"));
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SFPage)
