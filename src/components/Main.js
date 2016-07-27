require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

// 获取图片相关的数据
let imageDatas = require('../data/imageDatas.json');

/** 利用自执行函数，将图片名信息转换为图片 url 信息
 *  @arg {[json Object]} imageDatasArray
 *  @return {[array Object]} imageDatasArray
 */
imageDatas = (function genImageUrl (imageDatasArray) {
  for (let i = 0, j = imageDatasArray.length; i < j; i++ ) {
    var singleImageData = imageDatasArray[i];
    singleImageData.imageUrl = require('../images/' + singleImageData.fileName);

    imageDatasArray[i] = singleImageData;
  }
  return imageDatasArray;
})(imageDatas);

class AppComponent extends React.Component {
  render() {
    return (
      <session className="stage">
        <session className="img-sec">

        </session>
        <nav className="controller-nav">

        </nav>
      </session>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
