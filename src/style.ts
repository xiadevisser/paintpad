export function getStyle(): HTMLStyleElement {
  const style = document.createElement('style');
  style.innerHTML = `
    #wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    canvas {
      background-color: #fff;
      border: 2px solid #d3d3d3;
    }

    #btn-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 6px;
    }
    
    button {
      width: 20px;
      height: 20px;
      background: none;
      border: none;
      padding: 0;
      cursor: pointer;
    }

    button:hover {
      border-bottom: 1px solid #d3d3d3;
      transition: all 1s ease;
    }
    
    input[type="range"] {
      -webkit-appearance: none;
      height: 2px;
      background: #444;
      margin-top: 10px;
      opacity: 0.7;
      transition: opacity .2s;
    }
    
    input[type="range"]:hover {
      opacity: 1;
    }
    
    input[type="range"]::-webkit-slider-thumb {
      appearance: none;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      border: 1px solid black;
      background: #fff;
      cursor: pointer;
      z-index: 1;
    }

    input[type="range"]::-moz-range-thumb {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      border: 1px solid black;
      cursor: pointer;
      z-index: 1;
    }

    input[type="color"] {
      width: 20px;
      height: 20px;
      border: none;
      background: none;
      cursor: pointer;
    }

    input[type="color"]:hover {
      border-bottom: 1px solid #d3d3d3;
      transition: all 1s ease;
    }
    `;
  return style;
}