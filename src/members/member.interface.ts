import { IProject } from 'src/database/database.schema';
import { INotification } from 'src/types';

export interface IJoinNotification extends INotification {
  sender: {
    id: number;
    name: string;
    email: string;
  };
  project: IProject;
}
