/**
 * This file holds a collection of data scrubbing functions that can be used with Stomata controls.
 */

export type IDataScrubbingFn = (value: any) => IDataScrubberValue;

export interface IDataScrubberValue {
  value: any;
  updateUI: boolean;
}

export class DataScrubbing {

  /**
   * This scrubbing function ensures that any value provided to it is trimmed if the type of the model value is string.
   *
   * @param value The trimmed value that doesn't link the UI.
   */
  public static trimModel(value: any): IDataScrubberValue {
    if (value && typeof value === 'string') {
      return {
        value: String(value).trim(),
        updateUI: false,
      };
    }
    return {
      value,
      updateUI: false,
    };
  }

  /**
   * This scrubbing function ensures that any value provided has all spaces removed from it.
   *
   * @param value The space-free value that doesn't link the UI.
   */
  public static noSpaces(value: any): IDataScrubberValue {
    if (value && typeof value === 'string') {
      return {
        value: String(value).replace(/ /g, ''),
        updateUI: false,
      };
    }
    return value;
  }

  /**
   * This scrubbing function ensures that the value is in an appropriate phone number.
   *
   * @param value The formatted phone number that updates the UI as well.
   */
  public static phoneNumber(value: any): IDataScrubberValue {
    if (value && typeof value === 'string') {
      value = String(value).replace(/ /g, '');
      value = String(value).replace(/\D/g, '');

      let newValue = '';
      const len = value.length;

      if (len === 10) {
        newValue += '(' + value.substring(0, 3) + ') ' + value.substring(3, 6) + ' - ' + value.substring(6, value.length);
      } else if (len > 10) {
        newValue += '+' + value.substring(0, value.length - 10) + ' ';
        value = value.substring(value.length - 10, value.length);
        newValue += '(' + value.substring(0, 3) + ') ' + value.substring(3, 6) + ' - ' + value.substring(6, value.length);
      } else {
        newValue = value;
      }

      value = newValue;
    }
    return {
      value,
      updateUI: true,
    };
  }

  /**
   * This scrubbing function ensures that the value has only numbers and one "." and is prefixed by "$"
   *
   * @param value The incoming value.
   */
  public static dollarFloat(value: any): IDataScrubberValue {
    if (value && typeof value === 'string') {
      // remove all non numbers and non ".", then allow only one "."
      value = value.replace(/[^.\d]/g, '').replace(/^(\d*\.?)|(\d*)\.?/g, '$1$2');

      // insert the $ sign
      value = '$' + value;
    }
    return {
      value,
      updateUI: true,
    };
  }

  /**
   * This scrubbing function ensures that the value is an even number if the value is of type number.
   *
   * @param value The value to scrub.
   */
  public static evenNumber(value: any): IDataScrubberValue {
    // if the number is odd, then convert to even
    if (value && typeof value === 'number' && value % 2 === 1) {
      value = value + 1;
    }
    return {
      value,
      updateUI: true,
    };
  }

}
