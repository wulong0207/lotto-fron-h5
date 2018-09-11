import React, { Component } from 'react';
import { getParameter } from '@/utils/utils';
import Header from '@/component/header';
import UserIcon from '../../components/user-icon'; // 用户头像
import http from '@/utils/request';
import './index.scss';

function List({ list, goPageTitle }) {
  return (
    <div className="list">
      {list.map((m, i) => {
        return (
          <div key={ i } onClick={ () => goPageTitle(m) }
            className="list-title">
            <div className="left">
              {m.articleImg ? <img src={ m.articleImg.split(',')[0] } /> : ''}
            </div>
            <div className="right">
              <div className="title">{m.articleTitle}</div>
              <div className="date">
                <span className="blue">{m.typeName}</span>
                <span>{m.createBy}</span>
                <span>{m.releaseTime}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

class News extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: []
    };
  }
  componentDidMount() {
    this.getOffsetHeight();
    this.getLabel();
    document.body.scrollTop = 0;
  }
  getOffsetHeight() {
    window.addEventListener(
      'message',
      function(event) {
        const po =
          typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (po.height) {
          document.getElementById('ifr').style.height = po.height + 'px';
        }
      },
      false
    );
  }
  getLabel() {
    http
      .get('/news/label', {
        params: {
          articleLabel: getParameter('articleLabel'),
          endRow: 5,
          id: getParameter('articleId'),
          startRow: 0,
          typeCode: getParameter('typeCode')
        }
      })
      .then(res => {
        let { list } = this.state;
        this.setState({ list: res.data || [] });
      })
      .catch(err => {
        console.log(err);
        // Message.toast(err.message);
      });
  }

  goPage() {
    window.location.href = 'account.html#/login';
  }
  goPageTitle(article) {
    window.location.href = `news.html#/show?url=${encodeURIComponent(
      article.articleUrl.replace(/http:/gi, 'https:')
    )}&articleLabel=${article.articleLabel}&articleId=${article.id}&typeCode=${article.typeCode}`;
    this.getOffsetHeight();
    document.body.scrollTop = 0;
  }

  render() {
    const url = getParameter(decodeURIComponent('url'));
    let { list } = this.state;
    return (
      <div className="detail">
        <Header title="2N彩票资讯">
          {/* 用户头像 */}
          <UserIcon />
        </Header>
        <iframe
          id="ifr"
          scrolling="no"
          src={
            url.indexOf('?') > -1
              ? `${url}&domain=//m.2ncai.com`
              : `${url}?domain=//m.2ncai.com`
          }
          width="100%"
        />
        {list.length > 0 ? (
          <List list={ list } goPageTitle={ this.goPageTitle.bind(this) } />
        ) : (
          ''
        )}
      </div>
    );
  }
}

export default News;
