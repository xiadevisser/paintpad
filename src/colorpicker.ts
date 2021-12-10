export class ColorPicker {
  private readonly colorPicker: HTMLInputElement;

  constructor(color: string, onInput: (value: string) => void) {
    this.colorPicker = document.createElement('input');
    this.colorPicker.type = 'color';
    this.colorPicker.value = color;
    this.colorPicker.addEventListener('input', () => onInput(this.colorPicker.value));
  }

  public get(): HTMLInputElement {
    return this.colorPicker;
  }

  public setColor(color: string) {
    this.colorPicker.value = color;
  }
}