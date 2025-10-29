import { NotebookDrawing, CanvasState, NotebookPage } from '@/types/classroom.types';
import WebSocketService from './websocket.service';

export class CanvasService {
  private static instance: CanvasService;
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private drawings: NotebookDrawing[] = [];
  private currentDrawing: NotebookDrawing | null = null;
  private isDrawing: boolean = false;
  private currentColor: string = '#000000';
  private currentWidth: number = 2;
  private currentTool: 'pen' | 'eraser' | 'highlighter' = 'pen';
  private studentId: string = '';
  private sessionId: string = '';
  private pageNumber: number = 1;
  private updateThrottle: NodeJS.Timeout | null = null;

  private constructor() {}

  public static getInstance(): CanvasService {
    if (!CanvasService.instance) {
      CanvasService.instance = new CanvasService();
    }
    return CanvasService.instance;
  }

  public initialize(
    canvas: HTMLCanvasElement,
    studentId: string,
    sessionId: string,
    pageNumber: number = 1
  ): void {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.studentId = studentId;
    this.sessionId = sessionId;
    this.pageNumber = pageNumber;

    if (this.ctx) {
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';
    }

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    if (!this.canvas) return;

    this.canvas.addEventListener('mousedown', this.handleMouseDown);
    this.canvas.addEventListener('mousemove', this.handleMouseMove);
    this.canvas.addEventListener('mouseup', this.handleMouseUp);
    this.canvas.addEventListener('mouseleave', this.handleMouseUp);

    // Touch events for mobile/tablet support
    this.canvas.addEventListener('touchstart', this.handleTouchStart);
    this.canvas.addEventListener('touchmove', this.handleTouchMove);
    this.canvas.addEventListener('touchend', this.handleTouchEnd);
  }

  private getCoordinates(e: MouseEvent | TouchEvent): { x: number; y: number } {
    if (!this.canvas) return { x: 0, y: 0 };

    const rect = this.canvas.getBoundingClientRect();
    let clientX: number, clientY: number;

    if (e instanceof MouseEvent) {
      clientX = e.clientX;
      clientY = e.clientY;
    } else {
      const touch = e.touches[0] || e.changedTouches[0];
      clientX = touch.clientX;
      clientY = touch.clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  }

  private handleMouseDown = (e: MouseEvent): void => {
    this.startDrawing(e);
  };

  private handleMouseMove = (e: MouseEvent): void => {
    this.draw(e);
  };

  private handleMouseUp = (): void => {
    this.stopDrawing();
  };

  private handleTouchStart = (e: TouchEvent): void => {
    e.preventDefault();
    this.startDrawing(e);
  };

  private handleTouchMove = (e: TouchEvent): void => {
    e.preventDefault();
    this.draw(e);
  };

  private handleTouchEnd = (): void => {
    this.stopDrawing();
  };

  private startDrawing(e: MouseEvent | TouchEvent): void {
    this.isDrawing = true;
    const coords = this.getCoordinates(e);

    this.currentDrawing = {
      type: this.currentTool === 'eraser' ? 'eraser' : 'line',
      points: [coords],
      color: this.currentTool === 'eraser' ? '#FFFFFF' : this.currentColor,
      width: this.currentTool === 'highlighter' ? this.currentWidth * 3 : this.currentWidth,
    };
  }

  private draw(e: MouseEvent | TouchEvent): void {
    if (!this.isDrawing || !this.ctx || !this.currentDrawing) return;

    const coords = this.getCoordinates(e);
    this.currentDrawing.points!.push(coords);

    // Draw on canvas
    this.ctx.strokeStyle = this.currentDrawing.color;
    this.ctx.lineWidth = this.currentDrawing.width;
    
    if (this.currentTool === 'highlighter') {
      this.ctx.globalAlpha = 0.3;
    } else {
      this.ctx.globalAlpha = 1.0;
    }

    const points = this.currentDrawing.points!;
    if (points.length > 1) {
      const lastPoint = points[points.length - 2];
      const currentPoint = points[points.length - 1];

      this.ctx.beginPath();
      this.ctx.moveTo(lastPoint.x, lastPoint.y);
      this.ctx.lineTo(currentPoint.x, currentPoint.y);
      this.ctx.stroke();
    }

    this.ctx.globalAlpha = 1.0;
  }

  private stopDrawing(): void {
    if (!this.isDrawing) return;

    this.isDrawing = false;
    
    if (this.currentDrawing && this.currentDrawing.points!.length > 0) {
      this.drawings.push(this.currentDrawing);
      this.throttledUpdate();
    }
    
    this.currentDrawing = null;
  }

  private throttledUpdate(): void {
    if (this.updateThrottle) {
      clearTimeout(this.updateThrottle);
    }

    this.updateThrottle = setTimeout(() => {
      this.sendCanvasUpdate();
    }, 500); // Send updates every 500ms when drawing
  }

  private sendCanvasUpdate(): void {
    if (!this.canvas) return;

    const canvasData = this.canvas.toDataURL('image/png');
    const page: NotebookPage = {
      id: `${this.studentId}-${this.sessionId}-${this.pageNumber}-${Date.now()}`,
      studentId: this.studentId,
      sessionId: this.sessionId,
      pageNumber: this.pageNumber,
      canvasData,
      timestamp: new Date().toISOString(),
    };

    WebSocketService.sendNotebookUpdate(page);
  }

  public setColor(color: string): void {
    this.currentColor = color;
  }

  public setWidth(width: number): void {
    this.currentWidth = width;
  }

  public setTool(tool: 'pen' | 'eraser' | 'highlighter'): void {
    this.currentTool = tool;
  }

  public clear(): void {
    if (!this.canvas || !this.ctx) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawings = [];
    this.sendCanvasUpdate();
  }

  public undo(): void {
    if (this.drawings.length === 0) return;

    this.drawings.pop();
    this.redrawCanvas();
    this.sendCanvasUpdate();
  }

  private redrawCanvas(): void {
    if (!this.canvas || !this.ctx) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawings.forEach(drawing => {
      this.ctx!.strokeStyle = drawing.color;
      this.ctx!.lineWidth = drawing.width;

      if (drawing.type === 'line' && drawing.points) {
        this.ctx!.beginPath();
        drawing.points.forEach((point, index) => {
          if (index === 0) {
            this.ctx!.moveTo(point.x, point.y);
          } else {
            this.ctx!.lineTo(point.x, point.y);
          }
        });
        this.ctx!.stroke();
      }
    });
  }

  public getCanvasState(): CanvasState {
    return {
      drawings: [...this.drawings],
      pageNumber: this.pageNumber,
      lastModified: new Date().toISOString(),
    };
  }

  public loadCanvasState(state: CanvasState): void {
    this.drawings = state.drawings;
    this.pageNumber = state.pageNumber;
    this.redrawCanvas();
  }

  public loadFromImage(imageData: string): void {
    if (!this.canvas || !this.ctx) return;

    const img = new Image();
    img.onload = () => {
      this.ctx!.clearRect(0, 0, this.canvas!.width, this.canvas!.height);
      this.ctx!.drawImage(img, 0, 0);
    };
    img.src = imageData;
  }

  public exportAsImage(): string {
    if (!this.canvas) return '';
    return this.canvas.toDataURL('image/png');
  }

  public exportAsPDF(): void {
    // This would require a library like jsPDF
    console.log('PDF export functionality can be added with jsPDF library');
  }

  public changePage(pageNumber: number): void {
    // Save current page state before changing
    this.sendCanvasUpdate();
    
    // Clear canvas for new page
    this.pageNumber = pageNumber;
    this.drawings = [];
    if (this.ctx && this.canvas) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  public destroy(): void {
    if (this.canvas) {
      this.canvas.removeEventListener('mousedown', this.handleMouseDown);
      this.canvas.removeEventListener('mousemove', this.handleMouseMove);
      this.canvas.removeEventListener('mouseup', this.handleMouseUp);
      this.canvas.removeEventListener('mouseleave', this.handleMouseUp);
      this.canvas.removeEventListener('touchstart', this.handleTouchStart);
      this.canvas.removeEventListener('touchmove', this.handleTouchMove);
      this.canvas.removeEventListener('touchend', this.handleTouchEnd);
    }

    if (this.updateThrottle) {
      clearTimeout(this.updateThrottle);
    }

    this.canvas = null;
    this.ctx = null;
    this.drawings = [];
    this.currentDrawing = null;
  }
}

export default CanvasService.getInstance();
