type Painting = {
  x: number;
  y: number;
  isDragging: boolean;
  color: string;
  lineWidth: number;
  index: number;
}

export class Tool {
  public static readonly free = 'free';
  public static readonly line = 'line';
}

export class Canvas {
  private readonly paintCanvas: HTMLCanvasElement;
  private readonly previewCanvas: HTMLCanvasElement;
  private readonly paintCtx: CanvasRenderingContext2D | null;
  private readonly previewCtx: CanvasRenderingContext2D | null;

  private isPainting = false;
  private paintings: Painting[] = [];
  private currentIndex = 0;
  private color: string;
  private lineWidth: number;
  private tool: Tool;
  private imageName: string;

  constructor(width: string, height: string, lineWidth: number, color: string, tool: Tool, imageName: string) {
    this.lineWidth = lineWidth;
    this.color = color;
    this.tool = tool;
    this.imageName = imageName;

    this.paintCanvas = document.createElement('canvas');
    this.paintCanvas.id = 'paint-canvas';
    this.paintCanvas.setAttribute('width', width);
    this.paintCanvas.setAttribute('height', height);
    this.paintCanvas.addEventListener('contextmenu', e => e.preventDefault());
    this.paintCtx = this.paintCanvas.getContext('2d');

    this.previewCanvas = document.createElement('canvas');
    this.previewCanvas.id = 'preview-canvas';
    this.previewCanvas.setAttribute('width', width);
    this.previewCanvas.setAttribute('height', height);
    this.previewCanvas.addEventListener('contextmenu', e => e.preventDefault());
    this.previewCtx = this.previewCanvas.getContext('2d');

    this.previewCanvas.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.previewCanvas.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.previewCanvas.addEventListener('mouseup', this.onMouseUp.bind(this));
    this.previewCanvas.addEventListener('mouseleave', this.onMouseLeave.bind(this));

    this.previewCanvas.addEventListener('touchstart', this.onTouchStart.bind(this));
    this.previewCanvas.addEventListener('touchmove', this.onTouchMove.bind(this));
    this.previewCanvas.addEventListener('touchend', this.onTouchEnd.bind(this));
  }

  public getPaintCanvas(): HTMLCanvasElement {
    return this.paintCanvas;
  }

  public getPreviewCanvas(): HTMLCanvasElement {
    return this.previewCanvas;
  }

  public setLineWidth(lineWidth: number): void {
    this.lineWidth = lineWidth;
  }

  public setColor(color: string): void {
    this.color = color;
  }

  public setTool(tool: Tool): void {
    this.tool = tool;
  }

  public clear(): void {
    if (this.paintCtx != null) {
      this.paintCtx.clearRect(0, 0, this.paintCanvas.width, this.paintCanvas.height);
      this.paintings = [];
    }
  }

  public download(): void {
    const link = document.createElement('a');
    link.href = this.paintCanvas.toDataURL('image/png');
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
    this.paintCanvas.setAttribute('width', width);
    this.previewCanvas.setAttribute('width', width);
    this.repaint();
  }

  public setHeight(height: string): void {
    this.paintCanvas.setAttribute('height', height);
    this.previewCanvas.setAttribute('height', height);
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
    if (this.paintCtx != null) {
      const ctx = this.paintCtx;
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
            ctx.moveTo(painting.x, painting.y);
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

  private onMouseUp(e: MouseEvent): void {
    this.onPaintEnd(e.pageX, e.pageY);
  }

  private onMouseLeave(e: MouseEvent): void {
    this.onPaintEnd(e.pageX, e.pageY);
  }

  private onMouseDown(e: MouseEvent): void {
    if (e.button == 0) {
      this.onPaintStart(e.pageX, e.pageY);
    }
  }

  private onMouseMove(e: MouseEvent): void {
    this.onPaintMove(e.pageX, e.pageY);
  }

  private onTouchEnd(e: TouchEvent) {
    this.onPaintEnd(e.touches[0].clientX, e.touches[0].clientY);
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
    const clientX = x - this.paintCanvas.getBoundingClientRect().left;
    const clientY = y - this.paintCanvas.getBoundingClientRect().top;
    this.currentIndex++;
    this.addPainting(clientX, clientY, false);
    this.repaint();
  }

  private onPaintMove(x: number, y: number) {
    if (this.isPainting) {
      const clientX = x - this.paintCanvas.getBoundingClientRect().left;
      const clientY = y - this.paintCanvas.getBoundingClientRect().top;
      switch (this.tool) {
        case Tool.free:
          this.addPainting(clientX, clientY, true);
          this.repaint();
          break;
        case Tool.line:
          if (this.previewCtx != null) {
            this.previewCtx.clearRect(0, 0, this.previewCanvas.width, this.previewCanvas.height);
            this.previewCtx.lineJoin = 'round';
            this.previewCtx.beginPath();
            const prevPainting = this.paintings[this.paintings.length - 1];
            this.previewCtx.moveTo(prevPainting.x, prevPainting.y);
            this.previewCtx.lineTo(clientX, clientY);
            this.previewCtx.closePath();
            this.previewCtx.strokeStyle = this.color;
            this.previewCtx.lineWidth = this.lineWidth;
            this.previewCtx.stroke();
          }
          break;
      }
    }
  }

  private onPaintEnd(x: number, y: number) {
    if (this.tool == Tool.line && this.isPainting) {
      const clientX = x - this.paintCanvas.getBoundingClientRect().left;
      const clientY = y - this.paintCanvas.getBoundingClientRect().top;
      this.addPainting(clientX, clientY, true);
      this.repaint();
      this.previewCtx?.clearRect(0, 0, this.paintCanvas.width, this.paintCanvas.height);
    }
    this.isPainting = false;
  }
}