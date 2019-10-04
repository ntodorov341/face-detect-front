import React from 'react';

const DemographicInfo = ({ demographics }) => {
    return (
        <div className='center ma'>
            <div className='mt2'>
                <p>{(demographics.age) ? `Age: ${demographics.age}` : `Age: 0`}</p>
                <p>{`Gender: ${(demographics.gender === 'masculine') ? 'Male' : 'Female' }`}</p>
                <p>{(demographics.race) ? `Race: ${demographics.race}` : `Race: -`}</p>
            </div>
        </div> 
    )
}

export default DemographicInfo;