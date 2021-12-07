import { Button } from './button';
import { Canvas } from './canvas';
import { ColorPicker } from './colorpicker';
import { Slider } from './slider';
import { getStyle } from './style';

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
  isClearable?: boolean;
  isDownloadable?: boolean;
  isStateChangeable?: boolean;
}

export class PaintPad extends HTMLElement {
  private readonly canvas: Canvas;
  private readonly slider: Slider;
  private readonly colorPicker: ColorPicker;
  private readonly clearBtn: Button;
  private readonly downloadBtn: Button;
  private readonly undoBtn: Button;
  private readonly redoBtn: Button;

  private readonly wrapper: HTMLDivElement;
  private readonly btnContainer: HTMLDivElement;

  private readonly width: string = '500px';
  private readonly height: string = '500px';
  private readonly lineWidth: number = 10;
  private readonly lineWidthMin: number = 1;
  private readonly lineWidthMax: number = 30;
  private readonly color: string = '#000000';
  private readonly imageName: string = 'paintpad';
  private readonly hasSlider: boolean = true;
  private readonly hasColorPicker: boolean = true;
  private readonly isClearable: boolean = true;
  private readonly isDownloadable: boolean = true;
  private readonly isStateChangeable: boolean = true;

  constructor(opt?: PaintPadOptions) {
    super();

    this.width = opt?.width ?? this.getAttribute('width') ?? this.width;
    this.height = opt?.height ?? this.getAttribute('height') ?? this.height;
    this.lineWidth = opt?.lineWidth ?? parseInt(this.getAttribute('lineWidth') ?? this.lineWidth.toString());
    this.lineWidthMin = opt?.lineWidthMin ?? parseInt(this.getAttribute('lineWidthMin') ?? this.lineWidthMin.toString());
    this.lineWidthMax = opt?.lineWidthMax ?? parseInt(this.getAttribute('lineWidthMax') ?? this.lineWidthMax.toString());
    this.color = opt?.color ?? this.getAttribute('color') ?? this.color;
    this.imageName = opt?.imageName ?? this.getAttribute('imageName') ?? this.imageName;
    this.hasSlider = opt?.hasSlider ?? (this.getAttribute('hasSlider') ? (this.getAttribute('hasSlider') == 'true') : this.hasSlider);
    this.hasColorPicker = opt?.hasColorPicker ?? (this.getAttribute('hasColorPicker') ? (this.getAttribute('hasColorPicker') == 'true') : this.hasColorPicker);
    this.isClearable = opt?.isClearable ?? (this.getAttribute('isClearable') ? (this.getAttribute('isClearable') == 'true') : this.isClearable);
    this.isDownloadable = opt?.isDownloadable ?? (this.getAttribute('isDownloadable') ? (this.getAttribute('isDownloadable') == 'true') : this.isDownloadable);
    this.isStateChangeable = opt?.isStateChangeable ?? (this.getAttribute('isStateChangeable') ? (this.getAttribute('isStateChangeable') == 'true') : this.isStateChangeable);

    const shadow = this.attachShadow({ mode: 'open' });
    this.wrapper = document.createElement('div');
    this.wrapper.id = 'wrapper';

    this.canvas = new Canvas(this.width, this.height, this.lineWidth, this.color, this.imageName);
    this.wrapper.append(this.canvas.get());

    this.slider = new Slider(this.lineWidthMin, this.lineWidthMax, this.lineWidth, (v) => this.setLineWidth(v));
    this.wrapper.append(this.slider.get());

    this.btnContainer = document.createElement('div');
    this.btnContainer.id = 'btn-container';

    const btnContainerLeft = document.createElement('div');
    this.clearBtn = new Button('clear', () => this.clear());
    btnContainerLeft.append(this.clearBtn.get());
    this.downloadBtn = new Button('download', () => this.download());
    btnContainerLeft.append(this.downloadBtn.get());
    this.undoBtn = new Button('undo', () => this.undo());
    btnContainerLeft.append(this.undoBtn.get());
    this.redoBtn = new Button('redo', () => this.redo());
    btnContainerLeft.append(this.redoBtn.get());
    this.btnContainer.append(btnContainerLeft);

    const btnContainerRight = document.createElement('div');
    this.colorPicker = new ColorPicker(this.color, (v) => this.setColor(v));
    btnContainerRight.append(this.colorPicker.get());
    this.btnContainer.append(btnContainerRight);

    this.wrapper.append(this.btnContainer);

    shadow.appendChild(getStyle());
    shadow.append(this.wrapper);

    this.setWidth(this.width);

    this.setVisibility(this.slider.get(), this.hasSlider);
    this.setVisibility(this.colorPicker.get(), this.hasColorPicker);
    this.setVisibility(this.clearBtn.get(), this.isClearable);
    this.setVisibility(this.downloadBtn.get(), this.isDownloadable);
    this.setVisibility(this.redoBtn.get(), this.isStateChangeable);
    this.setVisibility(this.undoBtn.get(), this.isStateChangeable);
  }

  public setWidth(width: string): void {
    this.canvas.setWidth(width);
    this.wrapper.style.width = width;
    this.btnContainer.style.width = width;
    this.slider.get().style.width = width;
  }

  public setHeight(height: string): void {
    this.canvas.setHeight(height);
  }

  public setLineWidth(lineWidth: number): void {
    this.canvas.setLineWidth(lineWidth);
    this.slider.setValue(lineWidth);
  }

  public setLineWidthMin(lineWidth: number): void {
    this.slider.setMinValue(lineWidth);
  }

  public setLineWidthMax(lineWidth: number): void {
    this.slider.setMaxValue(lineWidth);
  }

  public setColor(color: string): void {
    this.canvas.setColor(color);
    this.colorPicker.setColor(color);
  }

  public setImageName(name: string): void {
    this.canvas.setImageName(name);
  }

  public setSlider(isVisible: boolean): void {
    this.setVisibility(this.slider.get(), isVisible);
  }

  public setColorPicker(isVisible: boolean): void {
    this.setVisibility(this.colorPicker.get(), isVisible);
  }

  public setClearable(isVisible: boolean): void {
    this.setVisibility(this.clearBtn.get(), isVisible);
  }

  public setDownloadable(isVisible: boolean): void {
    this.setVisibility(this.downloadBtn.get(), isVisible);
  }

  public setStateChangeable(isVisible: boolean): void {
    this.setVisibility(this.redoBtn.get(), isVisible);
    this.setVisibility(this.undoBtn.get(), isVisible);
  }

  private setVisibility(element: HTMLElement, isVisible: boolean,) {
    if (isVisible) {
      element.style.display = 'inline-block';
    } else {
      element.style.display = 'none';
    }
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

  public getDataURL(): string {
    return this.canvas.get().toDataURL('image/png');
  }

  public getBlob(callback: BlobCallback, type?: string | undefined, quality?: number): void {
    return this.canvas.get().toBlob(callback, type, quality);
  }

  private attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    switch (name) {
      case 'width':
        this.setWidth(newValue);
        break;
      case 'height':
        this.setHeight(newValue);
        break;
      case 'linewidth':
        this.setLineWidth(parseInt(newValue));
        break;
      case 'linewidthmin':
        this.setLineWidthMin(parseInt(newValue));
        break;
      case 'linewidthmax':
        this.setLineWidthMax(parseInt(newValue));
        break;
      case 'color':
        this.setColor(newValue);
        break;
      case 'imagename':
        this.setImageName(newValue);
        break;
      case 'hasslider':
        this.setSlider(newValue == 'true');
        break;
      case 'hascolorpicker':
        this.setColorPicker(newValue == 'true');
        break;
      case 'isclearable':
        this.setClearable(newValue == 'true');
        break;
      case 'isdownloadable':
        this.setDownloadable(newValue == 'true');
        break;
      case 'isstatechangeable':
        this.setStateChangeable(newValue == 'true');
        break;
    }
  }

  static get observedAttributes() {
    return ['width', 'height', 'linewidth', 'linewidthmin', 'linewidthmax', 'color', 'imagename',
      'hasslider', 'hascolorpicker', 'isclearable', 'isdownloadable', 'isstatechangeable'];
  }
}

customElements.define('paint-pad', PaintPad);
