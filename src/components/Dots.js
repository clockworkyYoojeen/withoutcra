import React from 'react'
import { useState, useRef, useImperativeHandle, forwardRef } from 'react'

const Dots = forwardRef((props, ref) => 
{
    const {sliderData, clickMove, currentInd, changeActive} = props
    const [active, changeStateDot] = useState(0)
    
    const dotsRef = useRef()
    
    useImperativeHandle(ref, () => ({
        // function to use in parent component
        toRerender: (ind) => changeStateDot(ind),
        current: dotsRef.current
    }));
    // changing state to rerender dots 
    const changeActiveDot = (e) => {
        const elem = e.target
        const ind = parseInt(elem.dataset.ind)
        changeStateDot(ind)
    }
      
    const dots = sliderData.map((el, i) => {
        return <span key={i} data-ind={i} onClick={(e) => {changeActiveDot(e); clickMove(e)}}   className={(i == active) ? "active-dot" : ""}></span>
    })
        
    return <div className="dots" ref={dotsRef}>
        {dots}
    </div>
}   
)

export default Dots