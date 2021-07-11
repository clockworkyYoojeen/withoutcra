import React from 'react'
import { useRef, useEffect } from 'react'

const Slide = (props) => {
    const { content, slideWidth, index } = props
    const { touchStart, touchEnd, touchMove, imgNoDrag } = props

    const slide = useRef()

    useEffect(() => {
        slide.current.innerHTML = content
    })

    return <div className="slide" ref={slide} style={{ width: slideWidth }}
        onMouseDown={touchStart(index)}
        onMouseUp={touchEnd}
        onTouchStart={touchStart(index)}
        onTouchEnd={touchEnd}
        onMouseLeave={touchEnd}
        onMouseMove={touchMove}
        onTouchMove={touchMove}
        onDragStart={imgNoDrag}
    ></div>
}

export default Slide