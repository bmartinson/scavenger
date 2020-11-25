import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import { Observable, Subject, Subscription, timer } from 'rxjs';
import { QFControlAlignment } from '../../enum/quick-forms.enum';
import { QFFormComponent } from '../form/form.component';
import { QuickFormComponent } from '../quick-form-element/quick-form-element.component';

export enum QFButtonStyle {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  B_LINK = 'b-link',
  LINK = 'link',
  FREESTYLE = 'freestyle',
}

export enum QFButtonTarget {
  BLANK = '_blank',
  SELF = '_self',
  PARENT = '_parent',
  TOP = '_top',
}

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'qf-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QFButtonComponent extends QuickFormComponent implements OnChanges {

  /**
   * Editing one of these? You better make sure that the corresponding SCSS values are in sync.
   */
  public static QF_FORM_RESPONSE_ANIM_TIME = 1050;
  private static LOADING_STATUS_ANIM = 800;
  private static SHAKE_TIME = 999;
  private static DOUBLE_CLICK_TIMEOUT = 250;

  @Output() public clicked = new Subject<MouseEvent>();
  @Input() public style: QFButtonStyle = QFButtonStyle.PRIMARY;
  @Input() public compact = false;
  @Input() public tabIndex = 0;
  @Input() public routerLink = [];
  @Input() public loadingText = '';
  @Input() public requireFormValidity = false;
  @Input() public autoShake = false;
  @Input() public autoShakeInterval = 5000;	// interval unit in ms
  @Input() public href = '';
  @Input() public target: QFButtonTarget.SELF;
  @Input() public align: QFControlAlignment = QFControlAlignment.CENTER;
  @Input() public noClickAnimation = false;

  public SButtonStyle = QFButtonStyle;
  public QFControlAlignment = QFControlAlignment;
  public parent: QFFormComponent;
  public submit = false;
  public doShake = false;
  public doLoadingCheck = false;
  public doLoadingX = false;
  public doLoadComplete = false;
  private _loading = false;
  private _isFormInvalid = false;
  private preventClick = false;
  private _enableContinuousShake = true;
  private shakeSubscription: Subscription;
  private shakeTimer: Observable<number>;

  /**
   * Read only property that controls whether we're a normal button or a submit button.
   */
  public get type(): string {
    return (this.submit) ? 'submit' : 'button';
  }

  private get color(): string {
    if (this.style === QFButtonStyle.PRIMARY) {
      return 'green';
    } else {
      return 'white';
    }
  }

  public get loadingColor(): string {
    const color = this.color;

    switch (color) {
      case 'green':
        return 'white';

      case 'white':
        return 'green';
    }
  }

  /**
   * Comprehensive disable check for when the button should be automatically disabled or manually disabled
   * by a parent component.
   */
  public get isDisabled(): boolean {
    return this.disabled || this.isFormInvalid || this.loading;
  }

  /**
   * Comprehensive loading check for whether the button should be displaying a loading status UI.
   */
  public get isLoading(): boolean {
    return this.loading || this.doLoadingCheck || this.doLoadingX || this.doLoadComplete;
  }

  @HostBinding('style.display')
  private get inlineDisplay(): string {
    return (this.style === QFButtonStyle.LINK) ? 'inline-block' : null;
  }

  /**
   * Whether the button is in a loading state or not.
   *
   * @param value True if the button is in a loading state.
   */
  @Input()
  public set loading(value: boolean) {
    value = !!value;

    if (value !== this.loading) {
      this._loading = value;

      // if switching from true to false, show the success check mark
      if (!value) {
        this.preventClick = true;

        if (this.parent && this.parent.hasSubmissionError) {
          this.doLoadingX = true;
        } else {
          this.doLoadingCheck = true;
        }

        this.ngDetectChanges();

        // start fading out the status mark
        setTimeout(() => {
          this.doLoadComplete = true;
          this.ngDetectChanges();
        }, QFButtonComponent.LOADING_STATUS_ANIM);

        // switch back to a normal view
        setTimeout(() => {
          this.preventClick = this.doLoadingCheck = this.doLoadingX = this.doLoadComplete = false;
          this.ngDetectChanges();
        }, QFButtonComponent.QF_FORM_RESPONSE_ANIM_TIME);
      }

      this.updateCursor();
    }
  }

  /**
   * Whether the button is in a loading state or not.
   *
   * @return true if the button is in a loading state.
   */
  public get loading(): boolean {
    return this._loading;
  }

  /**
   * Whether the form that this button is tied to is valid or not. If the button is not tied to
   * any form, then this should be false.
   *
   * @param value True if the associated form is invalid.
   */
  @Input()
  public set isFormInvalid(value: boolean) {
    if (value !== this.isFormInvalid) {
      this._isFormInvalid = value;

      this.updateCursor();

      // detect changes if we modified our validity
      this.ngDetectChanges();
    }
  }

  /**
   * Whether the form that this button is tied to is valid or not. If the button is not tied to
   * any form, then this will be false.
   */
  public get isFormInvalid(): boolean {
    return this._isFormInvalid;
  }

  /**
   * Whether the button can shake or not.
   *
   * @param value True when shaking should be enabled internally.
   */
  private set enableContinuousShake(value: boolean) {
    this._enableContinuousShake = value;

    // start or end the timer that drives shake class application.
    if (value) {
      // start the shake timer
      this.shakeTimer = timer(0, this.autoShakeInterval);
      this.shakeSubscription = this.shakeTimer.subscribe(() => {
        if (this.enableContinuousShake) {
          this.shakeButton();
        }
      });
    } else {
      // destroy an existing shake timer
      if (this.shakeSubscription) {
        // unsubscribe and destroy the subscription
        this.shakeSubscription.unsubscribe();
        this.shakeSubscription = null;

        // destroy the timer
        this.shakeTimer = null;
      }
    }
  }

  /**
   * Whether the button can shake or not.
   *
   * @return True if this button can shake.
   */
  private get enableContinuousShake(): boolean {
    return this._enableContinuousShake;
  }

  public constructor(protected changeRef: ChangeDetectorRef, public elementRef: ElementRef) {
    super(changeRef, elementRef);
  }

  /**
   * Compares two quick forms Buttons to determine which comes first in sort order. The quick forms Buttons with the lowest
   * tabIndex should always come first. If a quick forms Buttons does not have a tabIndex defined or if it is 0, then it will
   * come after those with a defined tabIndex.
   *
   * @param a The first quick forms Buttons to compare.
   * @param b The second quick forms Buttons to compare against.
   */
  public static sortByTabIndex(a: QFButtonComponent, b: QFButtonComponent): number {
    const aHasTabIndex = (a.tabIndex && a.tabIndex > 0);
    const bHasTabIndex = (b.tabIndex && b.tabIndex > 0);

    if (aHasTabIndex && !bHasTabIndex) {
      return -1;
    } else if (!aHasTabIndex && bHasTabIndex) {
      return 1;
    } else {
      return a.tabIndex - b.tabIndex;
    }
  }

  /**
   * Click handler for the button wrapper click events. Necessary along with wrapper click handling to block
   * disabled click listeners from firing that are bound to the host.
   *
   * @param event The MouseEvent from the user click.
   */
  @HostListener('click', ['$event'])
  private onHostClick(event: MouseEvent): void {
    this.onHostWrapperClick(event);
  }

  /**
   * Angular hook for when changes occur to the button. If the autoShake property has changed, then we update the ability
   * to shake the button.
   *
   * @param changes The set of SimpleChanges that have occurred to the button.
   */
  public ngOnChanges(changes: SimpleChanges): void {
    super.ngOnChanges(changes);

    this.enableContinuousShake = changes && changes.autoShake && changes.autoShake.currentValue && this.autoShakeInterval > 999;

    this.ngDetectChanges();
  }

  public onClick(event: MouseEvent): void {
    if (this.isDisabled || this.preventClick) {
      event.stopImmediatePropagation();
      event.preventDefault();
    }

    // only prevent the click event from bubbling if we are not disabled and consuming the click here
    if (!this.isDisabled && event) {
      event.stopImmediatePropagation();
    }

    if (!this.isDisabled && !this.preventClick) {
      // emit the click
      this.clicked.next(event);

      // if a href is set, perform a link open with the given link and target
      if (this.href.length > 0) {
        window.open(this.href, (!!this.target) ? this.target : QFButtonTarget.SELF);
      }

      // enforce a detection for loading if the user is using on push
      super.ngDetectChanges();

      // prevent further clicks for a short moment to prevent double click actions
      this.preventClick = true;
      setTimeout(() => {
        this.preventClick = false;
      }, QFButtonComponent.DOUBLE_CLICK_TIMEOUT);
    }
  }

  /**
   * Click handler for the button wrapper click events. Necessary along with host click handling to block
   * disabled click listeners from firing that are bound to the host.
   *
   * @param event The MouseEvent from the user click.
   */
  public onWrapperClick(event: MouseEvent): void {
    this.onHostWrapperClick(event);
  }

  /**
   * Updates the disabled state of this button based on the form's validity.
   */
  public updateValidity(): void {
    this.isFormInvalid = !!(this.parent && !this.parent.valid && (this.submit || this.requireFormValidity));
    this.ngDetectChanges();
  }

  /**
   * Stops the propagation of the mouse event to the host listener and attempts the form submission if possible.
   *
   * @param event The MouseEvent from the user click.
   */
  private onHostWrapperClick(event: MouseEvent): void {
    event.stopImmediatePropagation();

    if (this.parent) {
      this.parent.attemptSubmission();
    }

    // shake the button if disabled
    if (this.isDisabled) {
      this.shakeButton();
    }
  }

  /**
   * Invokes the button shake animation.
   */
  private shakeButton(): void {
    this.doShake = true;
    this.ngDetectChanges();

    setTimeout(() => {
      this.doShake = false;
      this.ngDetectChanges();
    }, QFButtonComponent.SHAKE_TIME);
  }

}
