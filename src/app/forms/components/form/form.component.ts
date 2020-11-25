import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  HostBinding,
  Input,
  Output,
  QueryList
} from '@angular/core';
import { Subject } from 'rxjs';
import { QFButtonComponent, QFButtonStyle } from '../button/button.component';
import { QuickFormControlComponent } from '../quick-form-control/quick-form-control.component';
import { QuickFormComponent } from '../quick-form-element/quick-form-element.component';
import { QFTextInputComponent } from '../text-input/text-input.component';
import { QuickFormResponse } from './quick-form-response';

/**
 * This component groups all known child quick formsControls together for validation and submission for form data capture. It mimics the
 * behavior of Angular Reactive Forms without explicitly using them but instead automating the creation and management of form controls.
 *
 * Unfortunately, as of Angular 6, you are not capable of capturing @ContentChildren based on a base class. This means, we unfortunately
 * cannot gather all quick formsControls by calling @ContentChildren(quick formsControlComponent) since the quick formsControlComponent
 * component classes all extend the quick formsControlComponent abstract class.
 *
 * Therefore, if more quick formsControls are developed, they must be added to this component class in two locations:
 *
 * 1. The "Content Children" section of property definitions. You must add a new QueryList definition there.
 * 2. Update updateControls() to populate from the new QueryList you defined.
 */
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'qf-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QFFormComponent extends QuickFormComponent implements AfterViewChecked, AfterViewInit {

  @Input() public autoFocus = true;
  @Input() public hasSubmissionError = false;
  @Input() public displayDirection: 'row' | 'column' = 'column';
  @Output() public ngSubmit = new Subject<QuickFormResponse>();

  @HostBinding('style.width') private hostWidth = '100%';

  @ContentChildren(QFButtonComponent, { descendants: true }) private buttonControls !: QueryList<QFButtonComponent>;
  @ContentChildren(QFTextInputComponent, { descendants: true }) private textControls !: QueryList<QFTextInputComponent>;

  public controls: QuickFormControlComponent<unknown>[] = [];
  public buttons: QFButtonComponent[] = [];
  public invalidControls: QuickFormControlComponent<unknown>[] = [];
  private oldFormInnerHTML = '';
  private _valid;
  private focusAttempted = false;

  /**
   * Determines if the form is valid or not.
   *
   * @return True if there are no invalid controls in the form.
   */
  public get valid(): boolean {
    const valid = this.invalidControls.length === 0;

    if (this._valid !== valid) {
      this._valid = valid;
      this.updateButtonsValidity();
    }

    return valid;
  }

  public constructor(protected changeRef: ChangeDetectorRef, public elementRef: ElementRef) {
    super(changeRef, elementRef);
  }

  /**
   * Angular hook for when the DOM is checked so we can determine when we need to update our controls.
   */
  public ngAfterViewChecked(): void {
    if (this.coreEl && this.oldFormInnerHTML !== this.coreEl.nativeElement.innerHTML) {
      this.oldFormInnerHTML = this.coreEl.nativeElement.innerHTML;

      this.updateControls();
    }
  }

  /**
   * Angular hook after initialization to make sure we have discovered all of the controls in our view.
   */
  public ngAfterViewInit(): void {
    super.ngAfterViewInit();

    // update the list of controls contained by the form
    this.updateControls();

    // perform smart auto selection
    this.invokeSmartFocus();
  }

  /**
   * Recalculates the validity of all controls in this form.
   */
  public updateControlsValidity(): void {
    for (const control of this.controls) {
      control.updateValidity();
    }
    this.updateButtonsValidity();
  }

  /**
   * Recalculates the validity of all buttons in this form.
   */
  public updateButtonsValidity(): void {
    for (const button of this.buttons) {
      button.updateValidity();
    }
  }

  /**
   * Mark all controls in the form as having had a submission attempted.
   */
  public attemptSubmission(): void {
    for (const control of this.controls) {
      control.formSubmissionAttempted = true;
    }
  }

  /**
   * Form submission event handler that packages the correct reactive form style data object and emits it.
   */
  public onNgSubmit(): void {
    const response = new QuickFormResponse();

    // update the validity of the response
    response.valid = this.valid;

    // populate the response with control data
    for (const control of this.controls) {
      response.value[control.name] = control.value;
    }

    this.ngSubmit.next(response);
  }

  /**
   * Re-populates the controls list from all of the discovered content quick formsControls found in
   * the quick forms Form.
   */
  private updateControls(): void {
    const oldControls = this.controls;
    let controlsChanged = false;

    // unlink existing controls before clearing
    for (const control of this.controls) {
      control.parent = null;
    }

    // clear the controls array
    this.controls = [];

    // add all text controls to the control list
    controlsChanged = this.populateControlsFromQueryList(this.textControls, oldControls) || controlsChanged;

    // sort the controls list based on tabIndex
    this.controls.sort(QuickFormControlComponent.sortByTabIndex);

    // update whether the changed controls flag based on if we have lost any controls
    controlsChanged = controlsChanged || this.controls.length !== oldControls.length;

    // remove controls that are not part of the form from the invalid list
    for (const control of this.invalidControls) {
      if (this.controls.indexOf(control) === -1) {
        this.invalidControls.splice(this.invalidControls.indexOf(control), 1);
      }
    }

    // update the validity of the form based on the new controls
    if (controlsChanged) {
      this.updateControlsValidity();
    }

    // make sure all buttons are up to date
    this.updateButtons();
  }

  /**
   * Finds the first control in the form that is not already filled out and valid and selects it.
   */
  private invokeSmartFocus(): void {
    if (!this.focusAttempted && this.autoFocus) {
      // mark that the auto focus has been attempted
      this.focusAttempted = true;

      setTimeout(() => {
        // sort the controls list based on tabIndex
        this.controls.sort(QuickFormControlComponent.sortByTabIndex);

        for (const control of this.controls) {
          if (!control.valid) {
            control.focus();
            break;
          }
        }
      }, 150);
    }
  }

  /**
   * Re-populates the button list from all of the discovered QFButtonComponent found in the
   * quick forms form.
   */
  private updateButtons(): void {
    // unlink existing buttons before clearing
    for (const button of this.buttons) {
      button.isFormInvalid = false;
      button.parent = null;
    }

    // clear the buttons array
    this.buttons = [];

    // populate the buttons array
    if (this.buttonControls) {
      this.buttonControls.forEach((button: QFButtonComponent) => {
        button.parent = this;
        this.buttons.push(button);
      });
    }

    // sort the button list based on tabIndex
    this.buttons.sort(QFButtonComponent.sortByTabIndex);

    // allocate an array to track the first found button component for each type of button
    const firstButtons: QFButtonComponent[] = [];

    // update the validity of all buttons and find the first of each button type - make sure no button is a submit button
    for (const button of this.buttons) {
      // mark the button as a normal button
      button.submit = false;

      // if we haven't seen this button type yet, track as the first of its kind since we're sorted on tabIndex already
      if (!firstButtons[button.style]) {
        firstButtons[button.style] = button;
      }
    }

    // flag the first button found (with priority given as follows in the conditional) as the submit button
    if (firstButtons[QFButtonStyle.PRIMARY]) {
      firstButtons[QFButtonStyle.PRIMARY].submit = true;
    } else if (firstButtons[QFButtonStyle.SECONDARY]) {
      firstButtons[QFButtonStyle.SECONDARY].submit = true;
    } else if (firstButtons[QFButtonStyle.B_LINK]) {
      firstButtons[QFButtonStyle.B_LINK].submit = true;
    }

    // update the button validity
    this.updateButtonsValidity();
  }

  /**
   * Iterates over a QueryList of quick formsControls and adds them to the controls property array
   * while simultaneously checking if we have should be a reactive form or not.
   *
   * @param list The query list of controls to add to the global controls array.
   * @param comparableControls A list of controls to check against to see if any of the QueryList controls are new to this form.
   * @return True if one of the controls in the QueryList does not exist in the comparable controls.
   */
  private populateControlsFromQueryList(
    list: QueryList<QuickFormControlComponent<unknown>>,
    comparableControls: QuickFormControlComponent<unknown>[] = [],
  ): boolean {
    let hasNewControl = false;

    // if the controls array does not exist, make sure we initialize it
    if (!this.controls) {
      this.controls = [];
    }

    // populate the controls array
    if (list) {
      list.forEach((control) => {
        hasNewControl = hasNewControl || comparableControls.indexOf(control) < 0;

        control.parent = this;
        this.controls.push(control);
      });
    }

    return hasNewControl;
  }

}
