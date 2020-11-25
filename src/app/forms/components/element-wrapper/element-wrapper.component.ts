import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostBinding, Input } from '@angular/core';
import { QuickFormComponent } from '../quick-form-element/quick-form-element.component';

/**
 * This component was designed for quick form internal uses ONLY.
 *
 * Every quick form component's template content should be wrapped in this content with appropriate inputs provided for
 * proper control and element styling. By default, an instance of this component will have `isControl` set to true, as most
 * components created in the quick form framework are controls. When you are developing a generic element (like an qf-form or qf-button),
 * you should make sure `isControl` is set to false. Provide all other inputs as necessary.
 */
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'qf-element-wrapper',
  templateUrl: './element-wrapper.component.html',
  styleUrls: ['./element-wrapper.component.scss', '../../styles/quick-forms-core.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QFElementWrapperComponent extends QuickFormComponent {

  @HostBinding('style.width') private hostWidth = '100%';
  @HostBinding('style.height') private hostHeight = 'auto';

  private _ngRequired: boolean;
  private _ngInvalid: boolean;
  private _ngValid: boolean;
  private _ngPristine: boolean;
  private _ngDirty: boolean;
  private _isControl = true;

  @Input()
  public set ngRequired(value: boolean) {
    if (value !== this._ngRequired) {
      this._ngRequired = value;
      this.ngDetectChanges();
    }
  }

  public get ngRequired(): boolean {
    return this._ngRequired;
  }

  @Input()
  public set ngInvalid(value: boolean) {
    if (value !== this._ngInvalid) {
      this._ngInvalid = value;
      this.ngDetectChanges();
    }
  }

  public get ngInvalid(): boolean {
    return this._ngInvalid;
  }

  @Input()
  public set ngValid(value: boolean) {
    if (value !== this._ngValid) {
      this._ngValid = value;
      this.ngDetectChanges();
    }
  }

  public get ngValid(): boolean {
    return this._ngValid;
  }

  @Input()
  public set ngPristine(value: boolean) {
    if (value !== this._ngPristine) {
      this._ngPristine = value;
      this.ngDetectChanges();
    }
  }

  public get ngPristine(): boolean {
    return this._ngPristine;
  }

  @Input()
  public set ngDirty(value: boolean) {
    if (value !== this._ngDirty) {
      this._ngDirty = value;
      this.ngDetectChanges();
    }
  }

  public get ngDirty(): boolean {
    return this._ngDirty;
  }

  @Input()
  public set isControl(value: boolean) {
    if (value !== this._isControl) {
      this._isControl = value;
      this.ngDetectChanges();
    }
  }

  public get isControl(): boolean {
    return this._isControl;
  }

  @Input()
  public set cursor(value: string) {
    if (value !== super.cursor) {
      super.cursor = value;
      this.ngDetectChanges();
    }
  }

  public get cursor(): string {
    return super.cursor;
  }

  public constructor(protected changeRef: ChangeDetectorRef, public elementRef: ElementRef) {
    super(changeRef, elementRef);
  }

}
