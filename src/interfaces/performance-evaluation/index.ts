import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface PerformanceEvaluationInterface {
  id?: string;
  evaluation_date: any;
  score: number;
  user_id?: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  _count?: {};
}

export interface PerformanceEvaluationGetQueryInterface extends GetQueryInterface {
  id?: string;
  user_id?: string;
}
