type Painting = {
  x: number;
  y: number;
  isDragging: boolean;
  color: string;
  lineWidth: number;
  index: number;
}

export class Canvas {
  private readonly canvas: HTMLCanvasElement;
  private readonly context: CanvasRenderingContext2D | null;
  
  private isPainting = false;
  private paintings: Painting[] = [];
  private currentIndex = 0;
  private color: string;
  private lineWidth: number;
  private imageName: string;

  constructor(width: string, height: string, lineWidth: number, color: string, imageName: string) {
    this.lineWidth = lineWidth;
    this.color = color;
    this.imageName = imageName;

    this.canvas = document.createElement('canvas');
    this.canvas.setAttribute('width', width);
    this.canvas.setAttribute('height', height);
    this.canvas.addEventListener('contextmenu', e => e.preventDefault());
    this.context = this.canvas.getContext('2d');

    this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
    this.canvas.addEventListener('mouseleave', this.onMouseLeave.bind(this));

    this.canvas.addEventListener('touchstart', this.onTouchStart.bind(this));
    this.canvas.addEventListener('touchmove', this.onTouchMove.bind(this));
    this.canvas.addEventListener('touchend', this.onTouchEnd.bind(this));
  }

  public get(): HTMLCanvasElement {
    return this.canvas;
  }

  public setLineWidth(lineWidth: number): void {
    this.lineWidth = lineWidth;
  }

  public setColor(color: string): void {
    this.color = color;
  }

  public clear(): void {
    if (this.context != null) {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.paintings = [];
    }
  }

  public download(): void {
    const link = document.createElement('a');
    link.href = this.canvas.toDataURL('image/png');
    link.download = this.imageName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  public undo(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
    this.repaint();
  }

  public redo(): void {
    if (this.currentIndex < this.getLastPaintingIndex()) {
      this.currentIndex++;
    }
    this.repaint();
  }

  public setWidth(width: string): void {
    this.canvas.setAttribute('width', width);
    this.repaint();
  }

  public setHeight(height: string): void {
    this.canvas.setAttribute('height', height);
    this.repaint();
  }

  public setImageName(name: string): void {
    this.imageName = name;
  }

  private addPainting(x: number, y: number, isDragging: boolean): void {
    this.paintings.push({
      x: x,
      y: y,
      isDragging: isDragging,
      color: this.color,
      lineWidth: this.lineWidth,
      index: this.currentIndex
    });
  }

  private repaint(): void {
    if (this.context != null) {
      const ctx = this.context;
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.lineJoin = 'round';

      for (let i = 0; i < this.paintings.length; i++) {
        const painting = this.paintings[i];
        if (painting.index <= this.currentIndex) {
          ctx.beginPath();
          if (painting.isDragging) {
            const prevPainting = this.paintings[i - 1];
            ctx.moveTo(prevPainting.x, prevPainting.y);
          } else {
            ctx.moveTo(painting.x - 1, painting.y);
          }
          ctx.lineTo(painting.x, painting.y);
          ctx.closePath();
          ctx.strokeStyle = painting.color;
          ctx.lineWidth = painting.lineWidth;
          ctx.stroke();
        }
      }
    }
  }

  private getLastPaintingIndex(): number {
    if (this.paintings.length > 0) {
      return this.paintings[this.paintings.length - 1].index;
    }
    return 0;
  }

  private onMouseUp(): void {
    this.isPainting = false;
  }

  private onMouseLeave(): void {
    this.isPainting = false;
  }

  private onMouseDown(e: MouseEvent): void {
    if (e.button == 0) {
      this.onPaintStart(e.pageX, e.pageY);
    }
  }

  private onMouseMove(e: MouseEvent): void {
    this.onPaintMove(e.pageX, e.pageY);
  }

  private onTouchEnd() {
    this.isPainting = false;
  }

  private onTouchStart(e: TouchEvent) {
    this.onPaintStart(e.touches[0].clientX, e.touches[0].clientY);
  }

  private onTouchMove(e: TouchEvent) {
    this.onPaintMove(e.touches[0].clientX, e.touches[0].clientY);
  }

  private onPaintStart(x: number, y: number) {
    this.isPainting = true;
    if (this.currentIndex < this.getLastPaintingIndex()) {
      this.paintings = this.paintings.filter(d => d.index <= this.currentIndex);
    }
    const clientX = x - this.canvas.getBoundingClientRect().left;
    const clientY = y - this.canvas.getBoundingClientRect().top;
    this.currentIndex++;
    this.addPainting(clientX, clientY, false);
    this.repaint();
  }

  private onPaintMove(x: number, y: number) {
    if (this.isPainting) {
      const clientX = x - this.canvas.getBoundingClientRect().left;
      const clientY = y - this.canvas.getBoundingClientRect().top;
      this.addPainting(clientX, clientY, true);
      this.repaint();
    }
  }
}