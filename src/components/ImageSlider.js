import React from 'react'
import { useState, useRef, useEffect } from 'react'


const ImageSlider = (props) => {
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
    })

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

        changeActiveDot(currentInd)
    }
    // select active dot 
    const changeActiveDot = (currentInd) => {
        const dots = dotsDiv.current.children
        Array.from(dots)
            .forEach((item, i) => {
                if (i === currentInd) return item.classList.add('active-dot')
                return item.classList.remove('active-dot')
            })
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

        changeActiveDot(currentInd)
    }
    // utils functions
    // checking event coords depending on device
    const getPosX = (event) => {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX
    }
    const insertContent = (obj) => {
        return { __html: obj }
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
        // currentTranslate = currentInd * -window.innerWidth
        currentTranslate = currentInd * -slideWidth
        prevTranslate = currentTranslate
        setSliderPosition()
    }

    // JSX
    return (
        <div className="outer" ref={outer}>
            <div className="slider-container" ref={slider}>
                {sliderData.map((slide, index) => {
                    return <div key={index} className="slide"
                        style={{ width: slideWidth }}
                        onMouseDown={touchStart(index)}
                        onMouseUp={touchEnd}
                        onTouchStart={touchStart(index)}
                        onTouchEnd={touchEnd}
                        onMouseLeave={touchEnd}
                        onMouseMove={touchMove}
                        onTouchMove={touchMove}
                        onDragStart={imgNoDrag}
                        dangerouslySetInnerHTML={insertContent(slide.content)}
                    >
                    </div>
                })}
            </div>
            <div className="dots" ref={dotsDiv}>
                {
                    dots ? (sliderData.map((el, i) => {
                        return <span key={i} data-ind={i} onClick={clickMove}></span>
                    })) : ('')
                }
            </div>
        </div> // end outer
    )
}

export default ImageSlider
