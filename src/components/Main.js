require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';

// 获取图片相关的数据
let imageDatas = require('../data/imageDatas.json');

/**
 *  利用自执行函数，将数组的图片名信息转换为图片 url 信息, 并存储在 imageUrl 属性中
 *  @param {[Object]} imageDatasArray
 *  @return {[Object]} imageDatasArray
 */
imageDatas = (function genImageUrl (imageDatasArray) {
  for (let i = 0, j = imageDatasArray.length; i < j; i++ ) {
    var singleImageData = imageDatasArray[i];
    singleImageData.imageUrl = require('../images/' + singleImageData.fileName);

    imageDatasArray[i] = singleImageData;
  }
  return imageDatasArray;
})(imageDatas);

/**
 *  获取区间[low, high]内的一个随机值
 */
function getRangeRandom(low, high) {
  return Math.ceil(Math.random() * (high - low) + low);
}

/**
 *  获取区间0-30度之间的一个任意正负值
 */
 function get30DegRandom() {
   return (Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30);
 }


var ImgFigure = React.createClass({
  /**
   *  imgFigure 的点击处理函数 handleClick
   */
  handleClick(e) {

    if(this.props.arrange.isCenter) {
      this.props.inverse();
    } else {
      this.props.center();
    }

    e.stopPropagation();
    e.preventDefault();
  },

  render() {
    var styleObj = {};

    // 如果 props 属性中指定了图片位置则使用
    if(this.props.arrange.pos) {
      styleObj = this.props.arrange.pos;
    }

    // 如果图片的旋转角度有值并且不为0，添加旋转角度
    if(this.props.arrange.rotate) {
      // ['-moz-', '-ms-', '-webkit-', ''].forEach(function(value) {
      ['MozTransform', 'msTransform', 'WebkitTransform', 'transform'].forEach(function(value) {
        styleObj[value] = 'rotate(' + this.props.arrange.rotate +  'deg)';
      }.bind(this)); // bind(this) 是为了能在 forEach 方法中调用 this.props.arrange.rotate，因为此时在匿名函数内， this 已不是 ImgFigure Component
    }

    if(this.props.arrange.isCenter) {
      styleObj.zIndex = 11;
      styleObj.boxShadow = '3px 2px 3px #cde3ec';
    }

    var imgFigureClassName = 'img-figure';
    imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';

    return (
      // 表示自包含的语义内容, 并含有标题说明，每个 figure 是一张图片+描述
      <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
        <img src={this.props.data.imageUrl}
          alt={this.props.data.title}
          />
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
          <div className="img-back" onClick={this.handleClick}>
            <p>
              {this.props.data.desc}
            </p>
          </div>
        </figcaption>
      </figure>
    );
  }
});

// 大管家 ^^
var GalleryByReactApp = React.createClass({
  Constant: {
    centerPos: {
      left: 0,
      top: 0
    },
    hPosRange: { // 水平方向的取值范围，即左右区域分区
      leftSecX: [0, 0],
      rightSecX: [0, 0],
      y: [0, 0]
    },
    vPosRange: { // 垂直方向的取值范围，即上部分区域
      x: [0, 0],
      topY: [0, 0]
    }
  },

  /**
   *  翻转有图片的闭包函数
   *  @param index 输入当前被执行 inverse 操作的图片对应图片信息数组的 inverse 值
   *  @return {Function} 闭包函数，返回一个真正待被执行的函数
   */
   inverse(index) {
     return function(){
       var imgsArrangeArr = this.state.imgsArrangeArr;
       // 对 inverse 值取反
       imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;

       this.setState({
         imgsArrangeArr: imgsArrangeArr
       })
     }.bind(this);
   },

  /**
   *  重新布局所有图片
   *  @param centerIndex 制定居中排布哪个图片
   */
  reArrange(centerIndex) {
    var imgsArrangeArr = this.state.imgsArrangeArr, // 存放所有图片的位置信息
        Constant = this.Constant,
        centerPos = Constant.centerPos,
        hPosRange = Constant.hPosRange,
        vPosRange = Constant.vPosRange,
        hPosRangeLeftSecX = hPosRange.leftSecX,
        hPosRangeRightSecX = hPosRange.rightSecX,
        hPosRangeY = hPosRange.y,
        vPosRangeTopY = vPosRange.topY,
        vPosRangeX = vPosRange.x,

        imgsArrangeTopArr = [], // 上侧区域的图片
        topImgNum = Math.floor(Math.random() * 2), // 取一个或者不取
        topImgSpliceIndex = 0,
        imgsArrRangeCenterArr = imgsArrangeArr.splice(centerIndex, 1); // 从 centerIndex 位置开始剔除掉一个，拿到 centerIndex 图片的状态

        // 首先居中 centerIndex 图片, 不需要旋转
        imgsArrRangeCenterArr[0] = {
          pos: centerPos,
          rotate: 0,
          isCenter: true
        }


        // 取出要布局的上侧的图片信息
        topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
        imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

        // 布局上侧的图片
        imgsArrangeTopArr.forEach(function(value, index) {
          imgsArrangeTopArr[index] = {
            pos: {
              top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]) ,
              left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
            },
            rotate: get30DegRandom(),
            isCenter: false
          };
        });

        // 布局左右两侧的图片
        for(var i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
          // 左区域或者右区域的 x 取值范围
          var hPosRangeLORX = null;

          // 前半部分布局左边，右半部份布局右边
          if (i < k) {
            hPosRangeLORX = hPosRangeLeftSecX;
          } else {
            hPosRangeLORX = hPosRangeRightSecX;
          }

          imgsArrangeArr[i]= {
            pos: {
              top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
              left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
            },
            rotate: get30DegRandom(),
            isCenter: false
          }
        }

        // 将原位置的图片替换为设置了状态信息之后的图片
        // 上侧图片--只有一张
        if(imgsArrangeTopArr && imgsArrangeTopArr[0]) {
          imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
        }
        // 中间图片--只有一张
        imgsArrangeArr.splice(centerIndex, 0, imgsArrRangeCenterArr[0]);

        // 触发 Component 的重新渲染
        this.setState({
          imgsArrangeArr: imgsArrangeArr
        });

  },

  /**
   *  利用 reArrange 函数居中对于的 index 图片
   *  @param index 需要被居中的图片对应的图片信息数组对应的 index 值
   *  @return {Function}
   */
  center(index) {
    return function() {
      this.reArrange(index);
    }.bind(this);
  },

  getInitialState() {
    return {
      imgsArrangeArr: [
        /*{
          pos: {
            left: '0',
            top: '0'
          },
          rotate: 0, // 旋转角度
          isInverse: false, // 图片正反面
          isCenter: false
        }*/
      ]
    };
  },

  // 组件加载完之后，为每张图片计算其位置的范围
  componentDidMount() {
    // 首先拿到舞台的大小
    var stageDOM = ReactDOM.findDOMNode(this.refs.stage),
        stageW = stageDOM.scrollWidth,
        stageH = stageDOM.scrollHeight,
        halfStageW = Math.ceil(stageW / 2),
        halfStageH = Math.ceil(stageH / 2);

    // 拿到第一个 ImageFigure 的大小
    var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
        imgW = imgFigureDOM.scrollWidth,
        imgH = imgFigureDOM.scrollHeight,
        halfImgW = Math.ceil(imgW / 2),
        halfImgH = Math.ceil(imgH / 2);


    this.Constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    }

    // 数组的 0 和 1 分别表示最小值与最大值
    // 计算左侧、右侧区域图片排布位置的取值范围
    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;

    // 计算上侧区域图片排布位置的取值范围
    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;

    this.reArrange(0);
  },


  render() {

    var controllerUnits = [],
        imgFigures = [];

    imageDatas.forEach(function(value, index) {
      // 如果没有值，则填充为 0
      if(!this.state.imgsArrangeArr[index]) {
        this.state.imgsArrangeArr[index] = {
          pos: {
            left: 0,
            top: 0
          },
          rotate: 0,
          isInverse: false,
          isCenter: false
        }
      }

      // 将 ImgFigure 组件存入 imgFigures 数组
      imgFigures.push(<ImgFigure data={value} key={index} ref={'imgFigure' + index}
        arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)}
        center={this.center(index)} />);

    }.bind(this));

    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }
})

GalleryByReactApp.defaultProps = {
};

export default GalleryByReactApp;
