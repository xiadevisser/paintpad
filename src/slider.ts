export class Slider {
  private readonly slider: HTMLInputElement;

  constructor(min: number, max: number, value: number, onChange: (value: number) => void) {
    this.slider = document.createElement('input');
    this.slider.type = 'range';
    this.slider.min = min.toString();
    this.slider.max = max.toString();
    this.slider.value = value.toString();
    this.slider.title = this.slider.value;
    this.slider.addEventListener('change', () => onChange(parseInt(this.slider.value)));
    this.slider.addEventListener('change', () => this.slider.title = this.slider.value);
  }

  public get(): HTMLInputElement {
    return this.slider;
  }

  public setValue(value: number): void {
    this.slider.value = value.toString();
  }

  public setMinValue(value: number): void {
    this.slider.min = value.toString();
  }

  public setMaxValue(value: number): void {
    this.slider.max = value.toString();
  }
}