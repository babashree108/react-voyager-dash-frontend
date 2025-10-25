import { StudentMonitoring, WindowViolation } from '@/types/classroom.types';
import WebSocketService from './websocket.service';

export class FullscreenMonitorService {
  private static instance: FullscreenMonitorService;
  private isMonitoring: boolean = false;
  private violations: WindowViolation[] = [];
  private studentId: string = '';
  private checkInterval: NodeJS.Timeout | null = null;
  private violationHandlers: Set<(violation: WindowViolation) => void> = new Set();

  private constructor() {}

  public static getInstance(): FullscreenMonitorService {
    if (!FullscreenMonitorService.instance) {
      FullscreenMonitorService.instance = new FullscreenMonitorService();
    }
    return FullscreenMonitorService.instance;
  }

  public startMonitoring(studentId: string): void {
    this.studentId = studentId;
    this.isMonitoring = true;
    this.enterFullscreen();
    this.setupEventListeners();
    this.startPeriodicCheck();
  }

  public stopMonitoring(): void {
    this.isMonitoring = false;
    this.removeEventListeners();
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    this.exitFullscreen();
  }

  private enterFullscreen(): void {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch(err => {
        console.error('Error entering fullscreen:', err);
      });
    }
  }

  private exitFullscreen(): void {
    if (document.exitFullscreen && document.fullscreenElement) {
      document.exitFullscreen().catch(err => {
        console.error('Error exiting fullscreen:', err);
      });
    }
  }

  private setupEventListeners(): void {
    // Fullscreen change listener
    document.addEventListener('fullscreenchange', this.handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', this.handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', this.handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', this.handleFullscreenChange);

    // Window blur/focus listeners
    window.addEventListener('blur', this.handleWindowBlur);
    window.addEventListener('focus', this.handleWindowFocus);

    // Visibility change listener
    document.addEventListener('visibilitychange', this.handleVisibilityChange);

    // Prevent context menu and certain key combinations
    document.addEventListener('contextmenu', this.preventContextMenu);
    document.addEventListener('keydown', this.handleKeyDown);
  }

  private removeEventListeners(): void {
    document.removeEventListener('fullscreenchange', this.handleFullscreenChange);
    document.removeEventListener('webkitfullscreenchange', this.handleFullscreenChange);
    document.removeEventListener('mozfullscreenchange', this.handleFullscreenChange);
    document.removeEventListener('MSFullscreenChange', this.handleFullscreenChange);
    window.removeEventListener('blur', this.handleWindowBlur);
    window.removeEventListener('focus', this.handleWindowFocus);
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    document.removeEventListener('contextmenu', this.preventContextMenu);
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  private handleFullscreenChange = (): void => {
    if (!this.isMonitoring) return;

    const isFullscreen = !!(
      document.fullscreenElement ||
      (document as any).webkitFullscreenElement ||
      (document as any).mozFullScreenElement ||
      (document as any).msFullscreenElement
    );

    if (!isFullscreen && this.isMonitoring) {
      const violation = this.createViolation('fullscreen_exit');
      this.recordViolation(violation);
      
      // Show warning to student
      this.showWarning('You have exited fullscreen mode. Please return to fullscreen.');
      
      // Try to re-enter fullscreen after a short delay
      setTimeout(() => {
        if (this.isMonitoring) {
          this.enterFullscreen();
        }
      }, 1000);
    }

    this.sendMonitoringUpdate();
  };

  private handleWindowBlur = (): void => {
    if (!this.isMonitoring) return;

    const violation = this.createViolation('window_blur');
    this.recordViolation(violation);
    this.showWarning('Window focus lost. Please return to the classroom.');
    this.sendMonitoringUpdate();
  };

  private handleWindowFocus = (): void => {
    if (!this.isMonitoring) return;
    this.sendMonitoringUpdate();
  };

  private handleVisibilityChange = (): void => {
    if (!this.isMonitoring) return;

    if (document.hidden) {
      const violation = this.createViolation('tab_switch');
      this.recordViolation(violation);
      this.showWarning('Tab switching detected. Please stay on the classroom tab.');
      this.sendMonitoringUpdate();
    }
  };

  private preventContextMenu = (e: Event): void => {
    if (this.isMonitoring) {
      e.preventDefault();
    }
  };

  private handleKeyDown = (e: KeyboardEvent): void => {
    if (!this.isMonitoring) return;

    // Prevent F11, Alt+Tab, Alt+F4, Ctrl+W, etc.
    const blockedKeys = [
      'F11',
      'Escape',
    ];

    const blockedCombinations = [
      e.altKey && e.key === 'Tab',
      e.altKey && e.key === 'F4',
      e.ctrlKey && e.key === 'w',
      e.ctrlKey && e.key === 't',
      e.metaKey && e.key === 'w',
      e.metaKey && e.key === 't',
    ];

    if (blockedKeys.includes(e.key) || blockedCombinations.some(combo => combo)) {
      e.preventDefault();
      this.showWarning('This action is not allowed during the class.');
    }
  };

  private createViolation(type: WindowViolation['type']): WindowViolation {
    return {
      id: `${Date.now()}-${Math.random()}`,
      studentId: this.studentId,
      type,
      timestamp: new Date().toISOString(),
    };
  }

  private recordViolation(violation: WindowViolation): void {
    this.violations.push(violation);
    this.notifyViolationHandlers(violation);
  }

  private sendMonitoringUpdate(): void {
    const isFullscreen = !!(
      document.fullscreenElement ||
      (document as any).webkitFullscreenElement ||
      (document as any).mozFullScreenElement ||
      (document as any).msFullscreenElement
    );

    const monitoring: StudentMonitoring = {
      studentId: this.studentId,
      isFullscreenActive: isFullscreen,
      isWindowFocused: document.hasFocus(),
      lastActivityTime: new Date().toISOString(),
      violations: this.violations,
    };

    WebSocketService.sendMonitoringAlert(monitoring);
  }

  private startPeriodicCheck(): void {
    // Send monitoring updates every 5 seconds
    this.checkInterval = setInterval(() => {
      if (this.isMonitoring) {
        this.sendMonitoringUpdate();
      }
    }, 5000);
  }

  private showWarning(message: string): void {
    // Create a warning modal/alert
    const existingWarning = document.getElementById('fullscreen-warning');
    if (existingWarning) {
      existingWarning.remove();
    }

    const warning = document.createElement('div');
    warning.id = 'fullscreen-warning';
    warning.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background-color: #ef4444;
      color: white;
      padding: 16px 24px;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      z-index: 10000;
      font-size: 16px;
      font-weight: 600;
      animation: slideDown 0.3s ease-out;
    `;
    warning.textContent = message;
    document.body.appendChild(warning);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      warning.remove();
    }, 5000);
  }

  public onViolation(handler: (violation: WindowViolation) => void): void {
    this.violationHandlers.add(handler);
  }

  public offViolation(handler: (violation: WindowViolation) => void): void {
    this.violationHandlers.delete(handler);
  }

  private notifyViolationHandlers(violation: WindowViolation): void {
    this.violationHandlers.forEach(handler => handler(violation));
  }

  public getViolations(): WindowViolation[] {
    return [...this.violations];
  }

  public clearViolations(): void {
    this.violations = [];
  }

  public isInFullscreen(): boolean {
    return !!(
      document.fullscreenElement ||
      (document as any).webkitFullscreenElement ||
      (document as any).mozFullScreenElement ||
      (document as any).msFullscreenElement
    );
  }
}

export default FullscreenMonitorService.getInstance();
