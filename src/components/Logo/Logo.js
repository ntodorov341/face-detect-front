import React from 'react';
import Tilt from 'react-tilt'

const Logo = () => {
    return (
        <Tilt className="Tilt br2 shadow-2 center" options={{
            max:            35,     // max tilt rotation (degrees)
            scale:          1.2,     
         }} style={{ 
            height: 200, 
            width: 200 }} >
         <div className="Tilt-inner pa4 br2 shadow-2 center" style={{
            height:100, 
            width:100}}>  
        </div>
        </Tilt>
    )
}

export default Logo;