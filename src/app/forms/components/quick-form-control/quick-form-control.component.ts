import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostBinding, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { IQuickFormError } from '../../interfaces/quick-form-error.interface';
import { IDataScrubberValue, IDataScrubbingFn } from '../../utility/data-scrubbing';
import { QFButtonStyle } from '../button/button.component';
import { QFFormComponent } from '../form/form.component';
import { QuickFormComponent } from '../quick-form-element/quick-form-element.component';
import Timeout = NodeJS.Timeout;

@Component({
  template: ``,
})
export abstract class QuickFormControlComponent<T> extends QuickFormComponent implements AfterViewInit, OnChanges, OnInit {

  public static TRACK_DE_BOUNCE = 750;

  @Output() public modelChange: Subject<any>;
  @Input() public name: string;
  @Input() public tabIndex = 0;
  @Input() public autoFocus = false;
  @Input() public avoidInitialFocus = false;
  @Input() public labelText = '';
  @Input() public hideLabelText = false;
  @Input() public placeholderText = '';
  @Input() public errorText = '';
  @Input() public validatorFns: ValidatorFn[] = [];
  @Input() public warningFns: ValidatorFn[] = [];
  @Input() public dataScrubbingFns: IDataScrubbingFn[];
  @Input() public hideWhatsThis = true;
  @Output() protected modelSettled: Subject<any>;
  @Output() protected whatsThisClick: Subject<void>;
  @HostBinding('style.width') private hostWidth = '100%';
  @HostBinding('style.height') private hostHeight = 'auto';
  public propagateChange: (_: any) => void = null;
  public errors: IQuickFormError[] = [];
  public parent: QFFormComponent | QuickFormControlComponent<unknown>;
  public QFButtonStyle = QFButtonStyle;
  protected _required = true;
  protected allowNullValues = true;
  private _value: any;
  private _valid = false;
  private _dirty = false;
  private _formSubmissionAttempted = false;
  private hasWrittenValue = false;
  private settledTimeout: Timeout;

  /**
   * Tracks whether the parent form associated with this control has had a submission attempt
   * while the form was incomplete. Here we have to make sure this property bubbles downwards to
   * additional stomata controls should a stomata control be made with a core element that is also
   * a stomata control.
   *
   * @param value True if the associated parent from has had a submission attempt.
   */
  public set formSubmissionAttempted(value: boolean) {
    this._formSubmissionAttempted = value;

    // only attempt to pass the form submission flag if we are of a component type that has it defined
    if (this.coreEl && this.coreEl.formSubmissionAttempted !== undefined) {
      (this.coreEl as QuickFormControlComponent<T>).formSubmissionAttempted = value;
    }

    this.ngDetectChanges();
  }

  /**
   * Tracks whether the parent form associated with this control has had a submission attempt
   * while the form was incomplete. Here we have to make sure this property bubbles downwards to
   * additional stomata controls should a stomata control be made with a core element that is also
   * a stomata control.
   *
   * @returns True if the associated parent form has had a submission attempt.
   */
  public get formSubmissionAttempted(): boolean {
    return this._formSubmissionAttempted;
  }

  /**
   * Make this form required as part of the UI/form group that it is tied to.
   *
   * @param value True if this control should be required from the user.
   */
  @Input()
  public set required(value: boolean) {
    if (this._required !== value) {
      this._required = value;

      // update the validity asynchronously
      setTimeout(() => {
        this.updateValidity();
        this.ngDetectChanges();
      });
    }

    // make sure valid is not in a default false state if we aren't going to be required
    if (!value) {
      this.valid = true;
      this.ngDetectChanges();
    }
  }

  /**
   * Make this form required as part of the UI/form group that it is tied to.
   *
   * @return True if this control is required to be filled.
   */
  public get required(): boolean {
    return this._required;
  }

  /**
   * Sets the value of the form control. Based on the internal settings of this control, this can disallow certain value changes.
   *
   * @param value The new value for the control.
   */
  public set value(value: T) {
    // guard against setting to null if configured to disallow null values
    if (!this.allowNullValues && value === null) {
      return;
    }

    if (value !== this._value) {
      // update the value and then the view
      this._value = value;
      this.ngDetectChanges();
    }
  }

  /**
   * Returns the value of the control.
   *
   * @return The value of the control.
   */
  public get value(): T {
    return this._value;
  }

  /**
   * Sets whether this control is valid or not.
   *
   * @param value True if the control is valid.
   */
  public set valid(value: boolean) {
    if (value !== this._valid) {
      this._valid = value;
      this.ngDetectChanges();
    }
  }

  /**
   * Whether this control is valid or not.
   *
   * @return True if the control is in a valid state or not.
   */
  public get valid(): boolean {
    return this._valid;
  }

  /**
   * Sets whether this control is dirty or not.
   *
   * @param value True if the control is dirty.
   */
  public set dirty(value: boolean) {
    if (value !== this._dirty) {
      this._dirty = value;
      this.ngDetectChanges();
    }
  }

  /**
   * Whether this control is dirty or not.
   *
   * @return True if the control is in a dirty state or not.
   */
  public get dirty(): boolean {
    return this._dirty;
  }

  public get ngRequired(): boolean {
    return this.required;
  }

  public get ngInvalid(): boolean {
    return !this.valid;
  }

  public get ngValid(): boolean {
    return this.valid;
  }

  public get ngPristine(): boolean {
    return !(this.dirty && this.formSubmissionAttempted);
  }

  public get ngDirty(): boolean {
    return this.dirty || this.formSubmissionAttempted;
  }

  /**
   * Read only property that determines the appropriate error text for the control's error display. If a validation
   * error contained an automatic message, then we will display that message instead of any user provided error
   * text. If there are multiple validation error messages, then we will just use the
   * generic error text provided by the user.
   *
   * @return The error message to display.
   */
  public get uiErrorText(): string {
    if (this.errors.length === 1) {
      return this.errors[0].message;
    } else if (this.errors.length > 0) {
      // if we're not valid, show the generic message provided by the implementation, otherwise show the
      // highest-priority WARNING [0] in the list
      return !this.valid ? this.errorText : this.errors[0].message;
    } else {
      return this.errorText;
    }
  }

  /**
   * Read only property that determines if an error has been detected that wants to be shown regardless of
   * // the user's blur away status or dirty status.
   */
  public get uiErrorTextRequiresUserInteraction(): boolean {
    if (this.errors.length === 1) {
      return !!this.errors[0].requireUserInteraction;
    } else {
      return true;
    }
  }

  /**
   * Read only property that determines if a warning has been detected that wants to be shown regardless of the form's validity.
   */
  public get uiErrorTextIsWarning(): boolean {
    if (this.errors.length === 1) {
      return !!this.errors[0].isWarning;
    } else {
      return false;
    }
  }

  /**
   * Create the base QuickFormControlComponent with a provided subject that should be strictly typed instead of any.
   *
   * @param modelChange A subject that should emit a value that matches the bound model type.
   * @param modelSettled A subject that will emit the value that matches the bound model type after the control has settled for some time.
   * @param changeRef A ChangeDetectorRef reference to allow for component lifecycle checking.
   * @param elementRef An ElementRef reference to allow component classes to access their native element structure in the DOM.
   */
  protected constructor(
    modelChange: Subject<any>,
    modelSettled: Subject<any>,
    changeRef: ChangeDetectorRef,
    elementRef: ElementRef,
  ) {
    super(changeRef, elementRef);

    this.modelChange = modelChange;
    this.modelSettled = modelSettled;
    this.whatsThisClick = new Subject<void>();

    // if we don't have a name provided, create a unique identifier
    if (!this.name) {
      const now = new Date();
      const uniqueId = now.getHours() + now.getMinutes() + now.getSeconds() + now.getMilliseconds() + (Math.floor(Math.random() * 1000));
      this.name = 'quick-form-control-' + String(uniqueId);
    }
  }

  /**
   * Compares two StomataControls to determine which comes first in sort order. The QuickFormControlComponent with the lowest
   * tabIndex should always come first. If a QuickFormControlComponent does not have a tabIndex defined or if it is 0, then it will
   * come after those with a defined tabIndex.
   *
   * @param a The first QuickFormControlComponent to compare.
   * @param b The second QuickFormControlComponent to compare against.
   */
  public static sortByTabIndex(a: QuickFormControlComponent<unknown>, b: QuickFormControlComponent<unknown>): number {
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
   * Angular hook for when input properties change to know when to detect changes for visual property modification.
   *
   * @param changes The SimpleChanges containing all changes that occurred.
   */
  public ngOnChanges(changes: SimpleChanges): void {
    super.ngOnChanges(changes);

    if (changes.labelText || changes.placeholderText || changes.errorText || changes.hideLabelText || changes.hideWhatsThis) {
      this.ngDetectChanges();
    }
  }

  /**
   * Angular hook to know when the component is initialized.
   */
  public ngOnInit(): void {
    super.ngOnInit();

    // ensure that any initialization has been analyzed for proper validity
    this.updateValidity();
  }

  /**
   * Angular hook to know when the component is done initializing.
   */
  public ngAfterViewInit(): void {
    super.ngAfterViewInit();

    // attempt to focus if we are requested to and we're not disabled
    if (this.autoFocus && !this.isDisabled) {
      this.focus();
    }

    // if we want to avoid initial focus, blur away
    if (!!this.avoidInitialFocus) {
      this.blur();
    }

    // if the core element is a stomata control, provide a parent
    if (this.coreEl && this.coreEl instanceof QuickFormControlComponent) {
      (this.coreEl as QuickFormControlComponent<T>).parent = this;
    }

    // update our hover cursor
    this.updateCursor();
  }

  /**
   * Event handler for when the "What's This Link" is clicked.
   */
  public onWhatsThisClicked(): void {
    this.whatsThisClick.next();
  }

  /**
   * Event handler for when the component has been hasBlurred away at least once. This property
   * can then be used to drive when error messages should show, for example.
   */
  public onBlur(): void {
    super.onBlur();

    // execute re-validation and hasBlurred status on a slight delay so that a blur event caused
    // by clicking on a link invokes the action first
    if (!this.hasBlurred) {
      setTimeout(() => {
        // mark that we're dirty because we've touched the component
        this.dirty = true;

        // request re-validation
        this.updateValidity();
      }, 250);
    }
  }

  /**
   * This function writes the model change to our internal value and allows us to trigger any modelChange events.
   *
   * @param value The value to write to the model.
   */
  public writeValue(value: any): void {
    // mark that a value has been written
    if (!this.hasWrittenValue) {
      this.hasWrittenValue = true;
    }

    // guard against setting to null if configured to disallow null values
    if (!this.allowNullValues && value === null) {
      return;
    }

    if (value !== this.value) {
      this.value = value;

      // update the validity on actual changes
      this.updateValidity();

      // manually detect changes for nested children
      this.ngDetectChanges();
    }
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Register the change function to propagate changes.
   *
   * @param fn The on change function to use for propagation purposes.
   */
  public registerOnChange(fn: () => void): void {
    this.propagateChange = fn;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Register for on touch.
   */
  public registerOnTouched(): void {
  }

  /**
   * On change event handler to capture changes and successfully write them through the control layers.
   *
   * @param value The new model value that needs to be propagated.
   */
  public onChange(value: any): void {
    let skipModalChange = false;

    // do not trigger change events when the content is staying the same
    if (value === this.value) {
      return;
    }

    // guard against setting to null if configured to disallow null values
    if (!this.allowNullValues && value === null) {
      return;
    }

    // normalize the value based on scrubbing functions
    let dataScrubbed = false;
    let scrubUI = false;
    let scrubbedValue: IDataScrubberValue;
    if (this.dataScrubbingFns && this.dataScrubbingFns.length > 0) {
      for (const fn of this.dataScrubbingFns) {
        scrubbedValue = fn(value);
        if (value !== scrubbedValue.value) {
          value = scrubbedValue.value;
          scrubUI = scrubUI || scrubbedValue.updateUI;
          dataScrubbed = true;
        }
      }
    }

    // do not trigger change events when the content is staying the same after scrubbing
    if (value === this.value) {
      skipModalChange = true;

      // delete the internal value so the write succeeds
      if (dataScrubbed && scrubUI) {
        delete this._value;
        this.ngDetectChanges();
      }
    }

    // track the dirty state of the control
    if (this.dirty === false) {
      this.dirty = true;
    }

    this.writeValue(value);
    if (!skipModalChange) {
      if (this.propagateChange) {
        this.propagateChange(this.value);
      }
      this.modelChange.next(this.value);

      // start our settled timer for model settled event emission
      if (this.settledTimeout) {
        clearTimeout(this.settledTimeout);
        delete this.settledTimeout;
      }
      this.settledTimeout = setTimeout(() => {
        if (!!this.initialized) {
          this.modelSettled.next(this.value);
        }
      }, QuickFormControlComponent.TRACK_DE_BOUNCE);
    }
    this.ngDetectChanges();
  }

  /**
   * Control validation that analyzes the current selection and determines whether we have an appropriate selection or not.
   *
   * @param c The reference to the FormControl object representing this control that is being validated.
   * @return The validation error object following validation. Null if the control passes all validation.
   */
  public validate(c: AbstractControl): ValidationErrors | null {
    // if the form control hasn't initialized completely yet, then avoid full validation
    if (!this.hasWrittenValue) {
      return null;
    }

    let error: ValidationErrors;
    this.errors = [];

    // ensure that the required validator is properly included or excluded
    if (this.required && !this.disabled) {
      // ensure that the required validator function is one of the functions
      if (this.validatorFns.indexOf(Validators.required) < 0) {
        this.validatorFns.push(Validators.required);
      }
    } else {
      // ensure that the required validator function is not one of the functions
      if (this.validatorFns.indexOf(Validators.required) >= 0) {
        this.validatorFns.splice(this.validatorFns.indexOf(Validators.required), 1);
      }
    }

    // validate the control based on the provided validator functions and construct the ValidationErrors based on their responses
    if (this.validatorFns && this.validatorFns.length > 0) {
      const validationErrors = [];
      let hasRequirementError = false;

      for (const validatorFn of this.validatorFns) {
        const validationError = validatorFn(c);
        if (validationError) {
          hasRequirementError = hasRequirementError || (!!validationError.required);
          validationErrors.push(validationError);
        }
      }

      // if we had validation errors, construct an appropriate ValidationErrors object
      if (validationErrors.length > 0) {
        error = {};
        for (const validationError of validationErrors) {
          for (const key of Object.keys(validationError)) {
            error[key] = validationError[key];

            // if the validation error has a message property associated with it, add it to our messages
            // list only if we've passed requirement checks
            if (!hasRequirementError && !!error[key].message && typeof error[key].message === 'string') {
              this.errors.push(error[key] as IQuickFormError);
            }
          }
        }
      }
    }

    // track the validity internally
    const isCoreElStomataControl = this.coreEl && this.coreEl instanceof QuickFormControlComponent;
    const isCoreElValidStomataControl = isCoreElStomataControl && (this.coreEl as QuickFormControlComponent<T>).valid;
    this.valid = (error === null || error === undefined) && (!isCoreElStomataControl || isCoreElValidStomataControl);

    // if we're still valid and we have warning functions to check, we check for those warning conditions
    if (!!this.valid && !!this.warningFns) {
      const validationWarnings = [];

      for (const warningFn of this.warningFns) {
        const validationWarning = warningFn(c);
        if (validationWarning) {
          validationWarnings.push(validationWarning);
        }
      }

      if (validationWarnings.length > 0) {
        const warnings: ValidationErrors = {};

        for (const validationWarning of validationWarnings) {
          for (const key of Object.keys(validationWarning)) {
            warnings[key] = validationWarning[key];

            // if the validation warning has a message property associated with it, add it to our messages
            if (!!warnings[key].message && typeof warnings[key].message === 'string') {
              (warnings[key] as IQuickFormError).isWarning = true;
              this.errors.push(warnings[key] as IQuickFormError);
            }
          }
        }
      }
    }

    return error;
  }

  /**
   * Marks the control as dirty and invokes the validity of this control.
   */
  public updateValidity(): void {
    this.validate(this as any);

    // if we are part of a parent form, update the form's overall validity
    if (this.parent) {
      if (this.parent instanceof QuickFormControlComponent) {
        // update the parent's validity if the parent is a stomata control
        (this.parent as QuickFormControlComponent<T>).updateValidity();
      } else {
        if (!this.valid) {
          // if the control is invalid, add it to the list of invalid controls if it isn't already present
          if ((this.parent as QFFormComponent).invalidControls.indexOf(this) < 0) {
            (this.parent as QFFormComponent).invalidControls.push(this);

            // update the validity of the form based on the current invalid controls list
            (this.parent as QFFormComponent).updateButtonsValidity();
          }
        } else {
          // if the control is valid, remove it from the list of invalid controls if it's present
          if ((this.parent as QFFormComponent).invalidControls.indexOf(this) >= 0) {
            (this.parent as QFFormComponent).invalidControls.splice((this.parent as QFFormComponent).invalidControls.indexOf(this), 1);

            // update the validity of the form based on the current invalid controls list
            (this.parent as QFFormComponent).updateButtonsValidity();
          }
        }
      }

    }

    this.ngDetectChanges();
  }

  /**
   * Resets the control into a default state.
   */
  public reset(): void {
    this.dirty = this.hasBlurred = this.formSubmissionAttempted = false;
    this.updateValidity();
    this.ngDetectChanges();
  }

}
