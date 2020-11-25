export interface IQuickFormError {
  value: boolean;
  message: string;
  requireUserInteraction?: boolean;		// optional, if false then the message will display always
  isWarning?: boolean; // optional, if true, then we will display the message regardless of control validity
}
