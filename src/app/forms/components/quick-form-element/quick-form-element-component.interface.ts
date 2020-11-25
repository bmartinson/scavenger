import { IQuickFormElement } from '../../interfaces/quick-form-element.interface';

export interface IQuickFormElementComponent extends IQuickFormElement {
  detachView: boolean;
}
