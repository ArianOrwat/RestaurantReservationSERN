import React from "react";

import "./Slider.scss";

class Slider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imgNum: 0,
      image: this.props.images[0],
      arrow: ["<", ">"],
      transition: 0,
      interval: ''
      //dots: []
    };
  }

  componentDidMount() {
    //this.defaultDots();
    this.intervalSet();
  }

  intervalSet = () => {
    this.setState({interval: setInterval(() => {
      this.changeToNext();
    }, this.props.interval)});
  }

  //TODO Dots

  // defaultDots = () => {
  //   const imagesArrayLength = this.props.images.length - 1;
  //   const dotsArrayBuffer = [];
  //   for (let i = 0; i < imagesArrayLength; i++) {
  //     dotsArrayBuffer.push(0);
  //   }
  //   this.setState({ dots: [1, ...dotsArrayBuffer] });
  // };

  transitionStart = () => {
    this.setState({ transition: 1 }, () => {
      setTimeout(() => this.setState({ transition: 0 }), 1000);
    });
    console.log(this.state);
  };

  changeToNext = () => {
    //console.log("next");
    this.transitionStart();
    clearInterval(this.state.interval);
    this.intervalSet();
    setTimeout(() => {
      if (this.props.images.length - 1 === this.state.imgNum) {
        this.setState({ imgNum: 0, image: this.props.images[0] });
        //this.defaultDots();
      } else {
        //const dot = this.state.dots.find(dot => dot === 1);
        this.setState(prevState => {
          return {
            imgNum: prevState.imgNum + 1,
            image: this.props.images[prevState.imgNum + 1]
          };
        });
      }
    }, 1000);
  };

  changeToPrev = () => {
    //console.log("prev");
    this.transitionStart();
    clearInterval(this.state.interval);
    this.intervalSet();
    setTimeout(() => {
      if (this.state.imgNum === 0) {
        this.setState({
          imgNum: this.props.images.length - 1,
          image: this.props.images[this.props.images.length - 1]
        });
        //this.defaultDots();
      } else {
        this.setState(prevState => {
          return {
            imgNum: prevState.imgNum - 1,
            image: this.props.images[prevState.imgNum - 1]
          };
        });
      }
    }, 1000);
  };
  render() {
    return (
      <>
        <div className="slider">
          <div className="darker"></div>
          <div className="text">
            <h2>{this.props.text1}</h2>
            <h1>{this.props.text2}</h1>
          </div>
          {this.state.transition ? (
            <div className="transition active"></div>
          ) : (
            <div className="transition"></div>
          )}
          <div className="leftArrow" onClick={() => this.changeToPrev()}>
            {this.state.arrow[0]}
          </div>
          <div className="rightArrow" onClick={() => this.changeToNext()}>
            {this.state.arrow[1]}
          </div>
          {/* <div className="dots">
            {this.state.dots.map((dot, id) =>
              dot ? (
                <div className="dot active" key={`dot${id}`}></div>
              ) : (
                <div className="dot" key={`dot${id}`}></div>
              )
            )}
          </div> */}
          <div
            style={{backgroundImage: `url(${this.state.image})`}}
            className="slider__img"
          />
        </div>
      </>
    );
  }
}

export default Slider;
