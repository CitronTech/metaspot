import React, { Component, PropTypes } from 'react'

class Logo extends Component {
  render () {
    return (
      <div>
      <svg 
      	xmlns="http://www.w3.org/2000/svg"
      	version="1.1"
      	x="0px" y="0px" 
      	viewBox="0 0 470 470" 
      	width="512" 
      	height="512">
      
      	<g>
      		<path style={{ fill: "#082947" }} d="M462.5,242.5c-4.142,0-7.5-3.357-7.5-7.5c0-38.635-88.401-80-220-80S15,196.365,15,235   c0,4.143-3.358,7.5-7.5,7.5S0,239.142,0,235c0-26.693,25.372-51.152,71.441-68.872C115.249,149.279,173.335,140,235,140   s119.751,9.279,163.559,26.128C444.628,183.848,470,208.307,470,235C470,239.142,466.642,242.5,462.5,242.5z"/>
      		<path style={{ fill: "#274B6D" }} d="M121.243,439.522c-1.272,0-2.562-0.324-3.743-1.006c-23.118-13.348-31.614-47.55-23.924-96.306   c7.312-46.363,28.319-101.307,59.152-154.711c30.833-53.403,67.912-99.068,104.407-128.582   c38.38-31.037,72.247-40.78,95.365-27.434c3.587,2.071,4.816,6.658,2.745,10.245c-2.072,3.587-6.658,4.813-10.245,2.745   C311.544,25.154,231.516,81.033,165.718,195C99.919,308.968,91.542,406.209,125,425.526c3.587,2.071,4.816,6.658,2.745,10.245   C126.356,438.178,123.835,439.522,121.243,439.522z"/>
      		<path style={{ fill: "#6DA8D6" }} d="M329.625,444.347c-20.431,0.002-45.329-11.299-72.49-33.264   c-36.495-29.515-73.574-75.179-104.407-128.583c-30.833-53.404-51.84-108.348-59.152-154.71   c-7.689-48.757,0.807-82.959,23.924-96.306c3.587-2.07,8.174-0.843,10.245,2.745c2.071,3.587,0.842,8.174-2.745,10.245   c-17.112,9.88-23.166,39.396-16.607,80.979c7.032,44.588,27.391,97.698,57.325,149.547   c57.217,99.103,125.197,154.279,163.955,154.285c5.813,0.001,10.963-1.239,15.327-3.759c3.587-2.07,8.174-0.843,10.245,2.745   c2.071,3.587,0.842,8.174-2.745,10.245C345.743,442.418,338.063,444.347,329.625,444.347z"/>
      		<path style={{ fill: "#082947" }} d="M235,330c-61.666,0-119.752-9.279-163.559-26.128C25.372,286.153,0,261.693,0,235   c0-4.143,3.358-7.5,7.5-7.5s7.5,3.357,7.5,7.5c0,38.635,88.401,80,220,80s220-41.365,220-80c0-4.143,3.358-7.5,7.5-7.5   s7.5,3.357,7.5,7.5c0,26.693-25.372,51.153-71.441,68.872C354.752,320.721,296.666,330,235,330z"/>
      		<circle style={{ fill: "#6DA8D6" }} cx="49.397" cy="185.057" r="20"/>
      		<circle style={{ fill: "#F2484B" }} cx="284.949" cy="421.749" r="19.997"/>
      		<circle style={{ fill: "#F2484B" }} cx="98.346" cy="98.543" r="19.997"/>
      		<g id="lemon" transform="translate(184, 184) scale(0.2)">
      			<path style="#FFD15C" d="M241.371,428.408V300.931c0-10.449-12.539-14.629-18.808-8.359l-89.861,89.861
      				c-4.18,4.18-4.18,12.539,1.045,16.718c27.167,21.943,60.604,35.527,96.131,39.706C235.102,440.947,241.371,434.678,241.371,428.408
      				z"/>
      			<path style={{ fill: "#FFD15C" }} d="M101.355,132.702c-21.943,27.167-35.527,60.604-39.706,96.131
      				c-1.045,6.269,4.18,12.539,11.494,12.539H200.62c10.449,0,14.629-12.539,8.359-18.808l-89.861-89.861
      				C113.894,127.478,105.535,127.478,101.355,132.702z"/>
      			<path style={{ fill: "#FFD15C" }} d="M61.649,272.718c4.18,36.571,18.808,68.963,39.706,96.131c4.18,5.224,11.494,5.224,16.718,1.045
      				l89.861-89.861c7.314-7.314,2.09-18.808-8.359-18.808H73.143C66.873,260.18,60.604,266.449,61.649,272.718z"/>
      			<path style={{ fill: "#FFD15C" }} d="M439.902,228.833c-4.18-36.571-18.808-68.963-39.706-96.131c-4.18-5.224-11.494-5.224-16.718-1.045
      				l-89.861,89.861c-7.314,7.314-2.09,18.808,8.359,18.808h127.478C434.678,241.371,440.947,235.102,439.902,228.833z"/>
      			<path style={{ fill: "#FFD15C" }} d="M241.371,200.62V73.143c0-6.269-5.224-11.494-12.539-11.494
      				c-36.571,4.18-68.963,18.808-96.131,39.706c-5.224,4.18-5.224,11.494-1.045,16.718l89.861,89.861
      				C228.833,215.249,241.371,211.069,241.371,200.62z"/>
      			<path style={{ fill: "#FFD15C" }} d="M260.18,73.143V200.62c0,10.449,12.539,14.629,18.808,8.359l89.861-89.861
      				c4.18-4.18,4.18-12.539-1.045-16.718c-27.167-21.943-60.604-35.527-96.131-39.706C266.449,60.604,260.18,65.829,260.18,73.143z"/>
      			<path style={{ fill: "#FFD15C" }} d="M400.196,368.849c21.943-27.167,35.527-60.604,39.706-96.131c1.045-6.269-4.18-12.539-11.494-12.539
      				H300.931c-10.449,0-14.629,12.539-8.359,18.808l89.861,89.861C387.657,374.073,396.016,374.073,400.196,368.849z"/>
      			<path style={{ fill: "#FFD15C" }} d="M272.718,439.902c36.571-4.18,68.963-18.808,96.131-39.706c5.224-4.18,5.224-11.494,1.045-16.718
      				l-89.861-89.861c-7.314-7.314-18.808-2.09-18.808,8.359v127.478C260.18,434.678,266.449,440.947,272.718,439.902z"/>
      			<path style={{ fill: "#FFD15C" }} d="M250.776,0C111.804,0,0,111.804,0,250.776c0,3.135,0,6.269,0,9.404
      				c5.224,133.747,114.939,241.371,250.776,241.371S496.327,393.927,501.551,260.18c0-3.135,0-6.269,0-9.404
      				C501.551,111.804,389.747,0,250.776,0z M250.776,468.114c-117.029,0-212.114-92.996-217.339-207.935c0-3.135,0-6.269,0-9.404
      				c0-120.163,97.176-217.339,217.339-217.339s217.339,97.176,217.339,217.339c0,3.135,0,6.269,0,9.404
      				C462.89,376.163,367.804,468.114,250.776,468.114z"/>
      		</g>
      		<path style={{ fill: "#274B6D" }} d="M140.375,444.347c-8.44,0-16.116-1.928-22.875-5.83c-3.587-2.071-4.816-6.658-2.745-10.245   c2.071-3.588,6.658-4.816,10.245-2.745c33.458,19.32,113.483-36.56,179.282-150.526c29.935-51.849,50.293-104.959,57.325-149.547   c6.558-41.583,0.505-71.099-16.607-80.979c-3.587-2.071-4.816-6.658-2.745-10.245c2.071-3.588,6.658-4.816,10.245-2.745   c23.118,13.347,31.614,47.549,23.924,96.306c-7.312,46.362-28.319,101.306-59.152,154.71   c-30.833,53.404-67.912,99.068-104.407,128.583C185.706,433.046,160.805,444.347,140.375,444.347z"/>
      		<path style={{ fill: "#6DA8D6" }} d="M348.757,439.522c-2.592,0-5.113-1.345-6.502-3.751c-2.071-3.587-0.842-8.174,2.745-10.245   c33.458-19.317,25.081-116.559-40.718-230.526S158.458,25.158,125,44.474c-3.587,2.069-8.174,0.843-10.245-2.745   c-2.071-3.587-0.842-8.174,2.745-10.245c23.119-13.348,56.986-3.604,95.365,27.434c36.496,29.514,73.575,75.179,104.407,128.582   c30.833,53.404,51.84,108.348,59.152,154.711c7.689,48.756-0.807,82.958-23.924,96.306   C351.319,439.198,350.029,439.522,348.757,439.522z"/>
      		<circle style={{ fill: "#6DA8D6" }} cx="371.654" cy="98.543" r="19.997" />
      	</g>
      </svg>
      </div>
    )
  }
}

export default Logo
