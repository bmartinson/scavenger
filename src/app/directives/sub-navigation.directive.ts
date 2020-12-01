import { AfterViewInit, Directive, ElementRef, HostListener, Input, OnChanges, OnDestroy, Renderer2, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[scavengerSubNavigation]',
})
export class SubNavigationDirective implements AfterViewInit, OnChanges, OnDestroy {

  @Input('scavengerSubNavigation') private view: HTMLElement;
  @Input('scavengerSubNavigationDisabled') private disabled: boolean;
  private onMouseOver: () => void;
  private onMouseLeave: () => void;
  private onMouseClick: (event: MouseEvent) => void;
  private isOverView: boolean;
  private isOverElement: boolean;

  public constructor(private element: ElementRef, private renderer: Renderer2) {
    this.isOverView = this.isOverElement = false;
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.view) {
      if (!!this.onMouseOver && !!changes.view.previousValue) {
        changes.view.previousValue.removeEventListener('mouseover', this.onMouseOver);
      }

      if (!!this.onMouseLeave && !!changes.view.previousValue) {
        changes.view.previousValue.removeEventListener('mouseover', this.onMouseLeave);
      }

      if (!!this.onMouseClick && !!changes.view.previousValue) {
        changes.view.previousValue.removeEventListener('click', this.onMouseClick);
      }

      this.onMouseOver = this.onMouseOverView.bind(this);
      this.onMouseLeave = this.onMouseLeaveView.bind(this);
      this.onMouseClick = this.onMouseClickView.bind(this);

      this.view.addEventListener('mouseover', this.onMouseOver);
      this.view.addEventListener('mouseleave', this.onMouseLeave);
      this.view.addEventListener('click', this.onMouseClick);
    }
  }

  public ngOnDestroy(): void {
    if (!!this.onMouseOver) {
      this.view.removeEventListener('mouseover', this.onMouseOver);
    }

    if (!!this.onMouseLeave) {
      this.view.removeEventListener('mouseover', this.onMouseLeave);
    }
  }

  public ngAfterViewInit(): void {
    this.renderer.setStyle(this.view, 'opacity', 0);

    this.updateSize();
  }

  @HostListener('mouseover')
  private onHover(): void {
    if (this.disabled) {
      return;
    }

    this.isOverElement = true;
    this.updateDisplay();
  }

  @HostListener('mouseleave')
  private onBlur(): void {
    this.isOverElement = false;
    this.updateDisplay();
  }

  @HostListener('window:resize')
  private onWindowResize(): void {
    this.updateSize();
  }

  private updateSize(): void {
    const positioning: any = this.element?.nativeElement.getBoundingClientRect();
    const subNavWidth: number = this.view.getBoundingClientRect().width;
    this.renderer.setStyle(this.view, 'left', `${positioning.x - (subNavWidth / 2) + (positioning.width / 2)}px`);
    this.renderer.setStyle(this.view, 'top', `${positioning.height}px`);
  }

  private updateDisplay(): void {
    if (this.isOverElement || this.isOverView) {
      this.renderer.setStyle(this.view, 'opacity', 1);
      this.renderer.setStyle(this.view, 'pointer-events', 'all');
    } else {
      this.renderer.setStyle(this.view, 'opacity', 0);
      this.renderer.setStyle(this.view, 'pointer-events', 'none');
    }
  }

  private onMouseOverView(): void {
    this.isOverView = true;
    this.updateDisplay();
  }

  private onMouseLeaveView(): void {
    this.isOverView = false;
    this.updateDisplay();
  }

  private onMouseClickView(event: MouseEvent): void {
    if (event.target && (event.target as HTMLElement).nodeName === 'A') {
      this.isOverView = false;
      this.updateDisplay();
    }
  }

}
