import React from 'react'
import Dots from './Dots'
import Slide from './Slide'
import { useState, useRef, useEffect } from 'react'


const ImageSlider = (props) => {
    const dotsComp = useRef()
    const { dots, sliderData } = props
    // store slide width in state
    const [slideWidth, setSlideWidth] = useState(0)

    // select necessary dom elements
    const slider = useRef()
    const dotsDiv = useRef()
    const outer = useRef()

    // setting some variables
    let isDragging = false,
        startPos = 0,
        currentTranslate = 0,
        prevTranslate = 0,
        animationID = 0,
        currentInd = 0

    // attaching listeners
    useEffect(() => {
        outer.current.addEventListener("contextmenu", preventRight)
        setSlideWidth(outer.current.clientWidth)
        window.addEventListener("resize", () => {
            setSlideWidth(outer.current.clientWidth)
        })
    }, [])

    // event handlers
    // prevent right click on container
    const preventRight = (e) => {
        e.preventDefault()
        e.stopPropagation()
        return false
    }
    const imgNoDrag = (e) => {
        if (e.target.tagName === 'IMG') {
            e.preventDefault()
            e.stopPropagation()
            return false
        }
    }
    // moving slider by clicking on dot
    const clickMove = (e) => {
        const elem = e.target
        currentInd = parseInt(elem.dataset.ind)
        currentTranslate = currentInd * -slideWidth
        prevTranslate = currentTranslate
        
        setSliderPosition()
    }
    // checking the beginning of swipe (or drag)
    const touchStart = (index) => {
        return (event) => {
            currentInd = index
            startPos = getPosX(event)
            isDragging = true

            animationID = requestAnimationFrame(animation)
            slider.current.classList.add('grabbing')
        }
    }
    // performing slider moving 
    const touchMove = (event) => {
        if (isDragging) {
            const currentPosition = getPosX(event)
            currentTranslate = prevTranslate + currentPosition - startPos
        }
    }
    // checking the end of swipe (or drag) and finally move slider
    const touchEnd = () => {
        isDragging = false

        const movedBy = currentTranslate - prevTranslate
        if (movedBy < -100 && currentInd < sliderData.length - 1) {
            currentInd++
        }
        if (movedBy > 100 && currentInd > 0) {
            currentInd--
        }

        setPositionByInd()
        cancelAnimationFrame(animationID)
        slider.current.classList.remove('grabbing')
        // forcing only child component (dots) to rerender without rendering entire component
        dotsComp.current.toRerender(currentInd)
    }

    // utils functions
    // checking event coords depending on device
    const getPosX = (event) => {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX
    }
    // performing animation
    const animation = () => {
        setSliderPosition()
        if (isDragging) {
            requestAnimationFrame(animation)
        }
    }
    // actually moving our slider
    const setSliderPosition = () => {
        slider.current.style.transform = `translateX(${currentTranslate}px)`
    }
    // setting new position (and moving)
    const setPositionByInd = () => {
        currentTranslate = currentInd * -slideWidth
        prevTranslate = currentTranslate
        setSliderPosition()
    }


    // JSX
    return (
        <div className="outer" ref={outer}>
            <div className="slider-container" ref={slider}>
                {sliderData.map((slide, index) => (
                    <Slide key={index}
                        index={index}
                        content={slide.content}
                        slideWidth={slideWidth}
                        touchStart={touchStart}
                        touchEnd={touchEnd}
                        touchMove={touchMove}
                        imgNoDrag={imgNoDrag}
                    />
                ))}
            </div>
            {
                dots ? (<Dots sliderData={sliderData} clickMove={clickMove} ref={dotsComp} currentInd={currentInd} />) : ('')
            }

        </div> // end outer
    )
}

export default ImageSlider
