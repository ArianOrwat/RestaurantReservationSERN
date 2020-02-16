import React from 'react';

import Slider from '../../components/Slider/Slider';

import './homepage.scss';

const HomePage = () => (
    <div className="homepage">
        <Slider images={['/img/slider_img_1.jpg', '/img/slider_img_2.jpg', '/img/slider_img_3.jpg']} text1='Welcome to' text2='Divaldo Restaurant' interval={10000}/>
    </div>
)

export default HomePage;