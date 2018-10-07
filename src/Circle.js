import React from 'react';


const Circle = ({circleText, effortPoints, owner, sheetIndex, progressPercent, currentSprintProgressPercent, selected}) => {
  // const scale = effortPoints / 25;
  const scale = normalize(effortPoints) / 22;
  //console.log(circleText, currentSprintProgressPercent);
  const circleColors = {
    0: 'linear-gradient(-60deg, #278181, #27BDBC, #78CDD0)',
    1: 'linear-gradient(-60deg, #288141, #42A24A, #7DC688)',
    2: 'linear-gradient(-60deg, #81287B, #B04097, #C67DB5)',
    3: 'linear-gradient(-60deg, #CD4C29, #F04E23, #F47B5B)',
    4: 'linear-gradient(-60deg, #28587F, #2879BC, #7AA8CE)',
  };

  const hrStyle = {
    top: (scale*282)+'px',
    width: (scale*564)+'px',
    margin: '0 0 0 '+(scale*-35)+'px',
  };
  const outerCircleStyle = {
    height: (scale*500)+'px',
    width: (scale*500)+'px',
    padding: (scale*35)+'px',
    zIndex: selected ? 11 : 1,
  };
  const progressCircleStyle = {
    margin: (scale*-33)+'px' + 0 + 0 + (scale*-33)+'px',
    width: (scale*569)+'px',
    height: (scale*569)+'px',
    left: '33px',
    transformOrigin: 'center center',
    top: '33px',
    background: makeConicGrad(Math.round(progressPercent), Math.round(currentSprintProgressPercent)),
    boxShadow: `inset ${scale*4}px ${scale*4}px ${scale*6}px 0 rgba(0, 0, 0, 0.3), ${scale*3}px ${scale*3}px ${scale*4}px rgba(255, 255, 255, 1)`,
  };
  const circleStyle = {
    height: (scale*500)+'px',
    width: (scale*500)+'px',
    fontSize: (scale*70)+'px',
    boxShadow: `inset ${scale*3}px ${scale*3}px ${scale*4}px rgba(255, 255, 255, 1), ${scale*6}px ${scale*6}px ${scale*10}px 0 rgba(0, 0, 0, 0.3)`,
    textShadow: `${scale*2}px ${scale*2}px ${scale*2}px rgba(0, 0, 0, 0.6)`,
    backgroundImage: circleColors[sheetIndex]
  };
  return (
    <div style={outerCircleStyle} className="outer-circle">
      <div style={progressCircleStyle} className="progress-circle"></div>
      {/*<div style={progressCircleStyle} className="progress-circle" data-start="180" data-value="90"></div>*/}
      {/*<div className="progress-circle difference" data-start="270" data-value="50"></div>*/}
      <hr style={hrStyle}/>
      <hr style={Object.assign({transform: 'rotate(-90deg)'}, hrStyle)}/>
      <hr style={Object.assign({transform: 'rotate(-45deg)'}, hrStyle)}/>
      <hr style={Object.assign({transform: 'rotate(-135deg)'}, hrStyle)}/>
      <div style={circleStyle} className="circle">
        <span className="project">{circleText}</span>
        <span className="owner">({owner})</span>
      </div>
    </div>
  );
};

function normalize(effortPoints){
  const mx = (Math.log((effortPoints-1))/(Math.log(20-1)));
  const preshiftNormalized = mx*(10-1);
  return preshiftNormalized + 1;
}

function makeConicGrad(progressPercent, differencePercent) {
  const progressColor = 'rgba(244, 123, 91, 0.8)';
  const differenceColor = 'rgba(244, 210, 91, 0.8)';
  const differenceSegment = (100-progressPercent >= differencePercent) ? `${differenceColor} ${progressPercent}%, ${differenceColor} ${progressPercent+differencePercent}%,` : '';
  return `conic-gradient(${progressColor} ${progressPercent}%, ${differenceSegment} rgba(0,0,0,0) 0)`;
}

export default Circle;