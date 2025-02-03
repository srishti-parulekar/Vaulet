import React from 'react'
import Card from "../../components/Card"
const CardDetails = () => {
  return (
    <>
    <div className='form-div'>
    <div className="topBlur"></div>
    <div className="bottomBlur"></div>
    <div style={{display: "flex", flexDirection: "column"}}>
    <h2 className="hero-title--gradient" style={{fontSize: "2rem"}}>Enter your Card Details</h2>
    <Card />
    </div>
    </div>
    </>
  )
}

export default CardDetails;