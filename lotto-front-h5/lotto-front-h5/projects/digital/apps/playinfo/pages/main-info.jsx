import React, { Component } from 'react';
import Header from '@/component/header';
import LottoNum from './lotto-id.js';
import { getParameter } from '@/utils/utils';
import '../css/main.scss';

export default class NumberLotto extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabelist: [],
      tabelhead: [],
      tabelname: ''
    };
  }
  componentWillMount() {
    let playid = getParameter('playid');
    console.log(playid);
    this.lottoNum(playid);
  }
  // 彩种id更改table
  lottoNum(id) {
    this.setState({
      tabelist: LottoNum[id].tabelist,
      tabelhead: LottoNum[id].tabelhead,
      tabelname: LottoNum[id].name
    });
  }
  rowBall(num, color) {
    let arr = [];
    for (var i = 0; i < num; i++) {
      arr.push(<span className={ color == 'red' ? 'red-ball' : 'blue-ball' } />);
    }
    return arr;
  }
  render() {
    let tabelist = this.state.tabelist;
    let tabelhead = this.state.tabelhead;
    let tabelname = this.state.tabelname;
    return (
      <div className="num-cont">
        <Header title={ tabelname } />
        <div className="playinfo">
          {/* <p className="tabelname">{tabelname}</p> */}
          <table>
            <tbody>
              <tr className="tabel-header">
                {tabelhead
                  ? tabelhead.map((row, i) => {
                    return <td key={ i }>{row}</td>;
                  })
                  : null}
              </tr>
              {tabelist
                ? tabelist.map((e, i) => {
                  return (
                    <tr key={ i } className="tabel-cont">
                      <td>
                        <div className="l_one">{e.pname}</div>
                      </td>
                      {e.red || e.blue || e.col ? (
                        <td className="ball">
                          {e.col
                            ? e.col.map((r, k) => {
                              return (
                                <div key={ 'row_' + k }>
                                  {r.red ? this.rowBall(r.red, 'red') : ''}
                                  {r.blue
                                    ? this.rowBall(r.blue, 'blue')
                                    : ''}
                                </div>
                              );
                            })
                            : e.red ? this.rowBall(e.red, 'red') : null}
                          {e.col
                            ? null
                            : e.blue ? this.rowBall(e.blue, 'blue') : null}
                        </td>
                      ) : null}
                      <td className={ e.red || e.blue || e.col ? '' : 'msg' }>
                        {e.col ? (
                          e.col.map((m, n) => {
                            return (
                              <div key={ 'row' + n }>
                                <p className="explain">{m.explain}</p>
                              </div>
                            );
                          })
                        ) : typeof e.explain === 'string' ? (
                          <p>{e.explain}</p>
                        ) : (
                          e.explain.map((txt, i) => {
                            return <p key={ i }>{txt}</p>;
                          })
                        )}
                      </td>
                      {e.opportunity ? <td>{e.opportunity}</td> : null}
                      <td className="prize">
                        {typeof e.prize === 'string' ? (
                          <p>{e.prize}</p>
                        ) : (
                          e.prize.map((txt, i) => {
                            return (
                              <td className="txt" key={ i }>
                                {txt}
                              </td>
                            );
                          })
                        )}
                      </td>
                    </tr>
                  );
                })
                : null}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
