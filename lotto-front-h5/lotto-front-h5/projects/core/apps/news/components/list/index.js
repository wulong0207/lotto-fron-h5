import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router';

import cx from 'classnames';
import './index.scss';

function Img({ articleImg }) {
  let imgArr = articleImg.split(',') || [];
  if (imgArr.length <= 2) {
    imgArr = imgArr.slice(0, 1);
  } else if (imgArr.length >= 3) {
    imgArr = imgArr.slice(0, 3);
  }
  return (
    <div
      className={ cx('article-img', imgArr.length >= 3 ? 'space-center' : '') }
    >
      {imgArr.map((row, index) => {
        return <img src={ row } key={ index } />;
      })}
    </div>
  );
}

function Title({ article }) {
  return (
    <div className="title">
      <span style={ { color: article.color } }>{article.articleTitle}</span>
    </div>
  );
}

function Footer({ article }) {
  return (
    <div className="bottom">
      <span>
        <i>{article.typeName}</i>
        <i>{article.createBy}</i>
        <i>{article.releaseTime}</i>
      </span>
      {/* <span className = 'link'>
                <img src = {require('../../img/icon_share--trans@2x.png')} />
            </span> */}
    </div>
  );
}

class List extends Component {
  getArticleDetail(url) {
    window.location.href = '#/news' + url;
  }
  render() {
    const { articleList, fastBet } = this.props;
    return (
      <div className="list-detail">
        {articleList.map((article, index) => {
          let imgLength;
          if (article.articleImg) {
            imgLength = article.articleImg.split(',').length;
          }
          return (
            <div className="list" key={ index }>
              <Link
                to={ `show?url=${encodeURIComponent(
                  article.articleUrl.replace(/http:/gi, 'https:')
                )}&articleLabel=${article.articleLabel}&articleId=${article.id}&typeCode=${article.typeCode}` }
              >
                {imgLength <= 2 ? (
                  ''
                ) : (
                  <div className="top">
                    <Title article={ article } />
                  </div>
                )}

                {imgLength ? (
                  <div className="center">
                    {imgLength >= 1 ? (
                      <Img articleImg={ article.articleImg } />
                    ) : (
                      ''
                    )}
                    {imgLength <= 2 ? <Title article={ article } /> : ''}
                  </div>
                ) : (
                  ''
                )}
                <div className="footer">
                  <Footer article={ article } />
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    );
  }
}

List.PropTypes = {
  articleList: PropTypes.array
};

export default List;
