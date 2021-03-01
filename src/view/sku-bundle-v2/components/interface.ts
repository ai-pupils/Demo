export interface VerifyStepStateType {
  title: string;
  user: string | undefined;
  date: string | undefined;
  processStatus?: 'wait' | 'process' | 'finish' | 'error' | 'success';
}
