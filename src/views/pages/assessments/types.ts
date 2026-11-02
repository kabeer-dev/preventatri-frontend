export interface Assessment {
  id: string;
  type: 'Weekly' | 'Monthly';
  date: string;
  isEnabled: boolean;
}
