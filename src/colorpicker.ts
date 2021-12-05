export class ColorPicker {
  private readonly colorPicker: HTMLInputElement;

  constructor(color: string, onChange: (value: string) => void) {
    this.colorPicker = document.createElement('input');
    this.colorPicker.type = 'color';
    this.colorPicker.value = color;
    this.colorPicker.addEventListener('change', () => onChange(this.colorPicker.value));
  }

  public get(): HTMLInputElement {
    return this.colorPicker;
  }

  public setColor(color: string) {
    this.colorPicker.value = color;
  }
}