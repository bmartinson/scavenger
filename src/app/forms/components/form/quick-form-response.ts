interface IQuickFormResponseValue {
  [key: string]: any;
}

export class QuickFormResponse {

  public valid = false;
  public value: IQuickFormResponseValue = {};

  public constructor() {
  }

}
