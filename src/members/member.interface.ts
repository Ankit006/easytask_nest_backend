import { IProject } from 'src/database/database.schema';

export interface IJoinNotification {
  sender: {
    id: number;
    name: string;
    email: string;
  };
  project: IProject;
}
