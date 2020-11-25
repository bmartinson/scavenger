import { BehaviorSubject } from 'rxjs';

export interface IQuickFormElement {
  viewInitialized: BehaviorSubject<boolean>;
  ngDetectChangesForComponent: (el: IQuickFormElement) => void;
  initialized: boolean;
  hasBlurred: boolean;
  hasFocused: boolean;
  hasFocus: boolean;
  cursor: string;
  coreHTMLElement: HTMLElement;
  coreElHeight: number;
  corElWidth: number;
  disabled: boolean;
  isDisabled: boolean;

  onFocus: () => void;
  onBlur: () => void;
  focus: () => void;
  blur: () => void;

  ngAfterViewInit: () => void;
  ngOnDestroy: () => void;
  ngDetectChanges: () => void;
  ngMarkForCheck: () => void;
}
