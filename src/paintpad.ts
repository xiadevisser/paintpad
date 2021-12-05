import { Button } from './button';
import { Canvas } from './canvas';
import { ColorPicker } from './colorpicker';
import { Slider } from './slider';

type PaintPadOptions = {
  width?: string;
  height?: string;
  lineWidth?: number;
  lineWidthMin?: number;
  lineWidthMax?: number;
  color?: string;
  imageName?: string;
  hasSlider?: boolean;
  hasColorPicker?: boolean;
  canClear?: boolean;
  canDownload?: boolean;
  canChangeState?: boolean;
}

export class PaintPad extends HTMLElement {
  private readonly canvas: Canvas;
  private readonly colorPicker?: ColorPicker;
  private readonly slider?: Slider;
  private readonly width: string = '500px';
  private readonly height: string = '500px';
  private readonly lineWidth: number = 10;
  private readonly lineWidthMin: number = 1;
  private readonly lineWidthMax: number = 30;
  private readonly color: string = '#000000';
  private readonly imageName: string = 'paintpad';
  private readonly hasSlider: boolean = true;
  private readonly hasColorPicker: boolean = true;
  private readonly canClear: boolean = true;
  private readonly canDownload: boolean = true;
  private readonly canChangeState: boolean = true;

  constructor(opt?: PaintPadOptions) {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    const wrapper = document.createElement('div');
    wrapper.id = 'wrapper';

    this.width = opt?.width ?? this.getAttribute('width') ?? this.width;
    this.height = opt?.height ?? this.getAttribute('height') ?? this.height;
    this.lineWidth = opt?.lineWidth ?? parseInt(this.getAttribute('lineWidth') ?? this.lineWidth.toString());
    this.lineWidthMin = opt?.lineWidthMin ?? parseInt(this.getAttribute('lineWidthMin') ?? this.lineWidthMin.toString());
    this.lineWidthMax = opt?.lineWidthMax ?? parseInt(this.getAttribute('lineWidthMax') ?? this.lineWidthMax.toString());
    this.color = opt?.color ?? this.getAttribute('color') ?? this.color;
    this.imageName = opt?.imageName ?? this.getAttribute('imageName') ?? this.imageName;
    this.hasSlider = opt?.hasSlider ?? (this.getAttribute('hasSlider') ? (this.getAttribute('hasSlider') == 'true') : this.hasSlider);
    this.hasColorPicker = opt?.hasColorPicker ?? (this.getAttribute('hasColorPicker') ? (this.getAttribute('hasColorPicker') == 'true') : this.hasColorPicker);
    this.canClear = opt?.canClear ?? (this.getAttribute('canClear') ? (this.getAttribute('canClear') == 'true') : this.canClear);
    this.canDownload = opt?.canDownload ?? (this.getAttribute('canDownload') ? (this.getAttribute('canDownload') == 'true') : this.canDownload);
    this.canChangeState = opt?.canChangeState ?? (this.getAttribute('canChangeState') ? (this.getAttribute('canChangeState') == 'true') : this.canChangeState);

    this.canvas = new Canvas(this.width, this.height, this.lineWidth, this.color, this.imageName);
    wrapper.append(this.canvas.get());

    if (this.hasSlider) {
      this.slider = new Slider(this.lineWidthMin, this.lineWidthMax, this.lineWidth, (v) => this.canvas.setLineWidth(v));
      wrapper.append(this.slider.get());
    }

    const btnContainer = document.createElement('div');
    btnContainer.id = 'btn-container';

    const btnContainerLeft = document.createElement('div');
    if (this.canClear) {
      const clearBtn = new Button('clear', () => this.canvas.clear());
      btnContainerLeft.append(clearBtn.get());
    }
    if (this.canDownload) {
      const downloadBtn = new Button('download', () => this.canvas.download());
      btnContainerLeft.append(downloadBtn.get());
    }
    if (this.canChangeState) {
      const undoBtn = new Button('undo', () => this.canvas.undo());
      btnContainerLeft.append(undoBtn.get());
      const redoBtn = new Button('redo', () => this.canvas.redo());
      btnContainerLeft.append(redoBtn.get());
    }
    btnContainer.append(btnContainerLeft);

    if (this.hasColorPicker) {
      const btnContainerRight = document.createElement('div');
      this.colorPicker = new ColorPicker(this.color, (v) => this.canvas.setColor(v));
      btnContainerRight.append(this.colorPicker.get());
      btnContainer.append(btnContainerRight);
    }

    wrapper.append(btnContainer);

    shadow.appendChild(this.getStyle());
    shadow.append(wrapper);
  }

  public clear(): void {
    this.canvas.clear();
  }

  public download(): void {
    this.canvas.download();
  }

  public undo(): void {
    this.canvas.undo();
  }

  public redo(): void {
    this.canvas.redo();
  }

  public setColor(color: string): void {
    this.canvas.setColor(color);
    this.colorPicker?.setColor(color);
  }

  public setLineWidth(lineWidth: number): void {
    this.canvas.setLineWidth(lineWidth);
    this.slider?.setValue(lineWidth);
  }

  public getDataURL(): string {
    return this.canvas.get().toDataURL('image/png');
  }

  public getBlob(callback: BlobCallback, type?: string | undefined, quality?: number): void {
    return this.canvas.get().toBlob(callback, type, quality);
  }

  private getStyle(): HTMLStyleElement {
    const style = document.createElement('style');
    style.innerHTML = `
    #wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: ${this.width};
    }

    canvas {
      background-color: #fff;
      border: 2px solid #d3d3d3;
    }

    #btn-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: ${this.width};
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
      opacity: 0.7;
      transition: opacity .2s;
      margin-top: 8px;
      width: ${this.width};
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

}

customElements.define('paint-pad', PaintPad);
