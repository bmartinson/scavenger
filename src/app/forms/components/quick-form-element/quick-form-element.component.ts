import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ViewRef
} from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { IQuickFormElementComponent } from './quick-form-element-component.interface';

@Component({
  template: ``,
})
export abstract class QuickFormComponent implements AfterViewInit, IQuickFormElementComponent, OnChanges, OnDestroy, OnInit {

  @Output() protected focused: Subject<void>;
  @Output() protected blurred: Subject<void>;
  @ViewChild('coreEl', { static: false }) protected coreEl: any;
  @HostBinding('tabindex') private hostTabIndex = -1;

  /**
   * When the user has hasBlurred or hasFocused the component at least once, these are true. These
   * properties do not indicate a "current hasBlurred/hasFocused state" but rather if a blur/focus event has
   * occurred.
   */
  public hasBlurred = false;
  public hasFocused = false;
  public hasFocus = false;

  public viewInitialized: BehaviorSubject<boolean>;
  public ngDetectChangesForComponent: (el: IQuickFormElementComponent) => void;
  public elementRef: ElementRef;
  protected changeRef: ChangeDetectorRef;
  private _disabled = false;
  private _useAlternateDisabledView = false;
  private _detachView: boolean;
  private _initialized: boolean;
  private _viewDetected: Subject<void>;
  private _cursor = 'default';

  /**
   * Read only property that informs us whether the view is destroyed or not.
   */
  public get initialized(): boolean {
    return this._initialized && this.changeRef && !(this.changeRef as ViewRef).destroyed;
  }

  /**
   * Read only property that returns the view detected subject as an observable for external
   * observation.
   */
  public get viewDetected(): Observable<void> {
    if (this._viewDetected) {
      return this._viewDetected.asObservable();
    } else {
      return new Observable<void>();
    }
  }

  /**
   * Read only property that gives public access to the HTMLElement associated with the toggle core element of the select component.
   */
  public get coreHTMLElement(): HTMLElement {
    if (!this.coreEl) {
      return undefined;
    }

    if (this.coreEl instanceof QuickFormComponent) {
      return (this.coreEl as QuickFormComponent).coreHTMLElement;
    } else {
      return this.coreEl.nativeElement;
    }
  }

  /**
   * Read only property that describes the client height of the core element associated with this element.
   * If the core element is another instance of a quick form element, the value will be that of its core
   * element implementation.
   */
  public get coreElHeight(): number {
    if (!this.coreEl) {
      return 0;
    }

    if (this.coreEl instanceof QuickFormComponent) {
      return (this.coreEl as QuickFormComponent).coreElHeight;
    } else if (this.coreEl instanceof ElementRef && !!(this.coreEl as ElementRef).nativeElement) {
      return (this.coreEl as ElementRef).nativeElement.clientHeight;
    } else {
      return 0;
    }
  }

  /**
   * Read only property that describes the offset width of the core element associated with this element.
   * If the core element is another instance of a quick form element, the value will be that of its core
   * element implementation.
   */
  public get corElWidth(): number {
    if (!this.coreEl) {
      return 0;
    }

    if (this.coreEl instanceof QuickFormComponent) {
      return (this.coreEl as QuickFormComponent).corElWidth;
    } else if (this.coreEl instanceof ElementRef && !!(this.coreEl as ElementRef).nativeElement) {
      return (this.coreEl as ElementRef).nativeElement.offsetWidth;
    } else {
      return 0;
    }
  }

  /**
   * Defines what cursor pointer should be used over this element.
   */
  public set cursor(value: string) {
    this._cursor = value;
  }

  /**
   * Defines what cursor pointer should be used over this element.
   */
  public get cursor(): string {
    return this._cursor;
  }

  /**
   * Manual control as to whether the element should be disabled or not.
   *
   * @param value True if the element should be disabled.
   */
  @Input()
  public set disabled(value: boolean) {
    if (value !== this.disabled) {
      this._disabled = value;

      // blur away from the element if we have focus and we are disabling
      if (!value && this.hasFocus) {
        this.blur();
      }

      this.updateCursor();
    }
  }

  /**
   * Manual control as to whether the element should be disabled or not.
   *
   * @return true if manually disabled.
   */
  public get disabled(): boolean {
    return this._disabled;
  }

  /**
   * Manual control as to whether the element should display an alternate read only
   * styled view when disabled.
   *
   * @param value True if the element should display the alternate disabled view.
   */
  @Input()
  public set useAlternateDisabledView(value: boolean) {
    if (value !== this._useAlternateDisabledView) {
      this._useAlternateDisabledView = value;

      this.ngDetectChanges();
    }
  }

  /**
   * Manual control as to whether the element should display an alternate read only
   * styled view when disabled.
   *
   * @param value True if the element should display the alternate disabled view.
   */
  public get useAlternateDisabledView(): boolean {
    return this._useAlternateDisabledView;
  }

  /**
   * Comprehensive disable check for when the button should be automatically disabled or manually disabled
   * by a parent component.
   */
  public get isDisabled(): boolean {
    return this.disabled;
  }

  /**
   * Whether or not the view should be detached or not. By default this is true.
   */
  @Input()
  public set detachView(value: boolean) {
    if (this._detachView !== !!value) {
      this._detachView = !!value;

      // detach the change detector so that we get full control
      if (this.changeRef && this.viewInitialized) {
        if (this.detachView) {
          this.changeRef.detach();
        } else {
          this.changeRef.reattach();
        }
      }
    }
  }

  /**
   * Whether or not the view should be detached or not. By default this is true.
   */
  public get detachView(): boolean {
    // by default lazy instantiate this property as true
    if (this._detachView === undefined) {
      this._detachView = true;
    }

    return this._detachView;
  }

  protected constructor(changeRef: ChangeDetectorRef, elementRef: ElementRef) {
    this.changeRef = changeRef;
    this.elementRef = elementRef;
    this.focused = new Subject<void>();
    this.blurred = new Subject<void>();
    this.viewInitialized = new BehaviorSubject<boolean>(false);
    this._viewDetected = new Subject<void>();
    this.ngDetectChangesForComponent = QuickFormComponent.ngDetectChangesForComponent;
  }

  /**
   * Static helper class for calling detect changes from an HTML reference
   *
   * @param el The element that we would like to detect changes on.
   */
  private static ngDetectChangesForComponent(el: IQuickFormElementComponent): void {
    el.ngDetectChanges();
  }

  /**
   * Angular hook for when data bound properties change. We mark initialized as true here because we are guaranteed
   * to have been created as an Angular component in its bare form at this point.
   *
   * @param changes data bound properties that are changing
   */
  public ngOnChanges(changes: SimpleChanges): void {
    this._initialized = true;
  }

  /**
   * Angular hook to know when the component is initialized.
   */
  public ngOnInit(): void {
    this._initialized = true;
  }

  /**
   * Angular hook to know when the component is done initializing.
   */
  public ngAfterViewInit(): void {
    // detach the change detector so that we get full control
    if (this.changeRef && this.detachView) {
      this.changeRef.detach();
    }

    // mark the view as initialized
    this.viewInitialized.next(true);
  }

  /**
   * Angular hook to know when the component is destroyed.
   */
  public ngOnDestroy(): void {
    this.viewInitialized.next(false);
  }

  /**
   * Hook for detecting changes in the component that is extending this control type.
   */
  public ngDetectChanges(): void {
    if (this.initialized && this.changeRef && !(this.changeRef as ViewRef).destroyed) {
      this.changeRef.detectChanges();
      this._viewDetected.next();

      // also propagate the detection to the core element
      if (this.coreEl && this.coreEl instanceof QuickFormComponent) {
        (this.coreEl as QuickFormComponent).ngDetectChanges();
      }
    }
  }

  /**
   * Hook for marking the component that is extending this control type to be checked for changes.
   */
  public ngMarkForCheck(): void {
    if (this.initialized && this.changeRef && !(this.changeRef as ViewRef).destroyed) {
      this.changeRef.markForCheck();

      // also propagate the detection to the core element
      if (this.coreEl && this.coreEl instanceof QuickFormComponent) {
        (this.coreEl as QuickFormComponent).ngMarkForCheck();
      }
    }
  }

  /**
   * Event handler for when the component has gained focus at least once.
   */
  public onFocus(): void {
    this.hasFocused = this.hasFocus = true;
    this.focused.next();

    // make sure focus events cause view changes
    this.ngDetectChanges();
  }

  /**
   * Event handler for when the component has been hasBlurred away at least once. This property
   * can then be used to drive when error messages should show, for example.
   */
  public onBlur(): void {
    this.hasFocus = false;
    this.blurred.next();

    // execute re-validation and hasBlurred status on a slight delay so that
    // a blur event caused by clicking on a link invokes the action first
    if (!this.hasBlurred) {
      setTimeout(() => {
        // mark that we've hasBlurred and that we're dirty because we've touched the component
        this.hasBlurred = true;
      }, 250);
    }

    // make sure focus events cause view changes
    this.ngDetectChanges();
  }

  /**
   * Set focus into the control.
   */
  public focus(): void {
    if (!!this.coreEl) {
      if (this.coreEl instanceof QuickFormComponent) {
        setTimeout(() => {
          (this.coreEl as QuickFormComponent).focus();
        });
      } else if (!!(this.coreEl as ElementRef).nativeElement) {
        setTimeout(() => {
          (this.coreEl as ElementRef).nativeElement.focus();
        });
      }
    }
  }

  /**
   * Blurs away from the control.
   */
  public blur(): void {
    if (!!this.coreEl) {
      if (this.coreEl instanceof QuickFormComponent) {
        setTimeout(() => {
          (this.coreEl as QuickFormComponent).blur();
        });
      } else if (!!(this.coreEl as ElementRef).nativeElement) {
        setTimeout(() => {
          (this.coreEl as ElementRef).nativeElement.blur();
        });
      }
    }
  }

  /**
   * Updates the parent cursor style based on the current disabled state of the control.
   */
  protected updateCursor(): void {
    setTimeout(() => {
      this.cursor = (this.isDisabled) ? 'not-allowed' : 'default';
      this.ngDetectChanges();
    }, 10);
  }

}
