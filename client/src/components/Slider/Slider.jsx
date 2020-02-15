import React from "react";

import "./Slider.scss";

class Slider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imgNum: 0,
      image: this.props.images[0],
      arrow: ["<", ">"],
      dots: []
    };
  }

  componentDidMount() {
      this.defaultDots();
  }

  defaultDots = () => {
    const imagesArrayLength = this.props.images.length - 1;
    const dotsArrayBuffer = [];
    for (let i = 0; i < imagesArrayLength; i++) {
      dotsArrayBuffer.push(0);
    }
    this.setState({ dots: [1, ...dotsArrayBuffer] });
  };

  changeToNext = () => {
    //console.log("next");
    if (this.props.images.length - 1 === this.state.imgNum) {
      this.setState({ imgNum: 0, image: this.props.images[0] });
      this.defaultDots();
    } else {
      const dot = this.state.dots.find(dot => dot === 1);
      console.log(dot)
      this.setState(function(prevState) {
        return {
          imgNum: prevState.imgNum + 1,
          image: this.props.images[prevState.imgNum + 1],
        };
      });
    }
  };

  changeToPrev = () => {
    //console.log("prev");
    if (this.state.imgNum === 0) {
      this.setState({
        imgNum: this.props.images.length - 1,
        image: this.props.images[this.props.images.length - 1]
      });
      this.defaultDots();
    } else {
      this.setState(function(prevState) {
        return {
          imgNum: prevState.imgNum - 1,
          image: this.props.images[prevState.imgNum - 1]
        };
      });
    }
  };
  render() {
    return (
      <>
        <div className="slider">
          <div className="darker"></div>
          <div className="leftArrow" onClick={() => this.changeToPrev()}>
            {this.state.arrow[0]}
          </div>
          <div className="rightArrow" onClick={() => this.changeToNext()}>
            {this.state.arrow[1]}
          </div>
          <div className="dots">
            {this.state.dots.map((dot, id) =>
              dot ? (
                <div className="dot active" key={`dot${id}`}></div>
              ) : (
                <div className="dot" key={`dot${id}`}></div>
              )
            )}
          </div>
          <img
            src={this.state.image}
            alt={`img`}
            key={`img`}
            className="slider__img"
          />
        </div>
      </>
    );
  }
}

export default Slider;
