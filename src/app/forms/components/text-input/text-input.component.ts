import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, forwardRef, HostBinding, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validator } from '@angular/forms';
import { Subject } from 'rxjs';
import { QFControlAlignment } from '../../enum/quick-forms.enum';
import { DataScrubbing } from '../../utility/data-scrubbing';
import { QuickFormControlComponent } from '../quick-form-control/quick-form-control.component';

export enum QFTextInputType {
  TEXT = 'text',
  PASSWORD = 'password',
}

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'qf-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss', '../../styles/quick-forms-core.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => QFTextInputComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => QFTextInputComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QFTextInputComponent extends QuickFormControlComponent<string> implements ControlValueAccessor, Validator {

  @Input() @HostBinding('class.open-style') public open = false;
  @Input() @HostBinding('class.open-style-xl') public xl = false;
  @Input() public type: QFTextInputType = QFTextInputType.TEXT;
  @Input() public maxLength: number;
  @Input() public autoComplete = true;
  @Input() public align: QFControlAlignment = QFControlAlignment.LEFT;

  public QFTextInputType = QFTextInputType;
  public QFControlAlignment = QFControlAlignment;

  /**
   * Construct this control off of the base StomaControl class with a provided strongly typed subject for
   * modelChange events.
   */
  public constructor(protected changeRef: ChangeDetectorRef, public elementRef: ElementRef) {
    super(new Subject<string>(), new Subject<string>(), changeRef, elementRef);

    this.value = '';
    this.allowNullValues = false;

    if (!this.dataScrubbingFns) {
      this.dataScrubbingFns = [DataScrubbing.trimModel];
    }
  }

}
