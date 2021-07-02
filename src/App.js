import React from 'react';
import ImageSlider from './components/ImageSlider'
import sliderData from './components/sliderData'
import sliderData2 from './components/sliderData2'
import sliderData3 from './components/sliderData3'


function App(){ 
  return  (
    <React.Fragment>
    <div className="bikes">
      {/* passing option for dots to be shown, and some html for slides */}
      <ImageSlider dots={true} sliderData={sliderData} />
    </div>
    <section className="section-text-info">
      <h1>Slider without dots</h1>
    <div className="text-info">
      {/* passing option for dots not to be shown, and some html for slides */}
      <ImageSlider dots={false} sliderData={sliderData2} />
    </div>
    </section>
    <section className="section-clients-say">
      <h1>Another without dots</h1>
    <div className="clients-say">
      {/* passing option for dots not to be shown, and some html for slides */}
      <ImageSlider dots={false} sliderData={sliderData3} />
    </div>
    </section>
    </React.Fragment>
  )
}

export default App