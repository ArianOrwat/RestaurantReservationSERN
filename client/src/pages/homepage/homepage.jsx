import React from 'react';

import Slider from '../../components/Slider/Slider';

import './homepage.scss';

const HomePage = () => (
    <div className="homepage">
        <Slider images={['/img/img1.jpg', '/img/img2.jpg']}/>
    </div>
)

export default HomePage;