import React from 'react';

export default props => {
  return (
    <div className="basketball-app">
      { props.children }
    </div>
  )
}

// import React, { Component } from 'react';
// import BasketBallPageContent from './content';
// import BasketBallPageHeader from './header';
// import http from '../../../utils/request';
// import { formatDate } from './utils';

// export default class BasketBallPageContainer extends Component {

//   constructor (props) {
//     super(props);
//     this.state = {
//       mode: 'mode4',
//       data: [],
//       mach_info: null,
//       serverTime: new Date(),
//       status: 'pending'
//     };
//   }

//   setMode (mode) {
//     this.setState({ mode });
//   }

//   fetch () {
//     this.setState({status: 'pending'});
//     http.get('/pc/jc/basketball').then(res => {
//       this.setState({
//         data: res.data.data,
//         serverTime: new Date(res.data.serverTime),
//         status: 'success'
//       });
//     });
//   }

//   componentDidMount () {

//     this.fetch();
//   }

//   renderContent () {
//     const status = this.state.status;
//     const data = this.state.data;
//     let content;
//     if(status === 'pendding') {
//       content = (<div className="pendding">pendding...</div>);
//     } else if(status !== 'pendding' && !data.length) {
//       content = (<div className="empty">empty</div>);
//     } else {
//       content = (
//         <BasketBallPageContent
//           mode={ this.state.mode }
//           data={ data }
//         />
//       )
//     }
//     return content;
//   }

//   renderStatusBar() {
//     if (!this.state.data.length) return (<div />);
//     return (
//       <div className="match-status-bar">
//         <span>客队</span>
//         <div className="status-detail">{formatDate(this.state.serverTime)} {this.state.data.length}场可投注</div>
//         <span>主队</span>
//       </div>
//     );
//   }

//   render () {
//     return (
//       <div className="basketball-page">
//         <BasketBallPageHeader
//           mode={ this.state.mode }
//           setMode={ this.setMode.bind(this) }
//         />
//         { this.renderStatusBar() }
//         { this.renderContent() }
//       </div>
//     );
//   }

// }
