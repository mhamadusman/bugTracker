import { BugType } from "../models/bug.model";
import { status } from "../models/bug.model";
import { Bug } from "../models/bug.model";
import { User } from "../models/users.model";

export interface ValidationError {
  field: string;
  message: string;
}
export enum UserTypes {
  DEVELOPER = "developer",
  SQA = "sqa",
  MANAGER = "manager"
}

export interface createUser {
  name: string;
  email: string;
  password: string;
  userType: UserTypes;
  phoneNumber: string;
}

export interface updateUser {
  name: string;
  email: string;
  password?: string;
  phoneNumber: string;
  image?: string;
}

export interface signUpResponse {
  error?: Error;
  message?: string;
}

export interface loginResponse {
  message?: string;
  token?: string;
  userType?: string;
  refreshToken: string;
}

//projects
export interface projects {
  name: string;
  projectId: number;
  managerId: number;
}

//project interfaces
export interface project {
  name: string;
  managerId: number;
  message?: string;
  projectId?: number;
  sucess?: boolean;
  description?: string;
  image?: string | null;
}

export interface IProjects {
  totalProjects: number;
  pages: number;
  projectsWithDetails: IProjectDTO[];
}

export interface IProjectDTO {
  projectId: number;
  name: string;
  description: string;
  image: string | null;
  devTeam: User[];
  qaTeam: User[];
  createdAt: Date;
  updatedAt: Date;
  taskComplete: number;
  totalBugs: number;
}

export interface IBugDTO {
  bugId: number;
  title: string;
  description: string;
  status: string;
  screenshot: string | null;
  projectId: number;
  developerId: number;
  deadline: Date;
  sqaId: number;
  createdAt: Date;
  updatedAt: Date;
  isClose: boolean;
}
interface IAssignedUser {
  id: number;
  name: string;
  image: string;
}

export interface IBugWithDeveloper {
  bug: IBugDTO;
  developer: IAssignedUser;
  sqa: IAssignedUser;
}

export interface IBugs {
  totalBugs: number;
  pages: number;
  statusCount: number;
  bugsWithDeveloper: IBugWithDeveloper[];
}

//for managing projects
export enum AssignedUserTypes {
  DEVELOPER = "developer",
  SQA = "sqa",
}

export interface createProject {
  name: string;
  projectId?: number;
  managerId?: number;
  sqaIds: string;
  developerIds: string;
  description: string;
  image?: string;
  qaIds: string;
  devIds: string;
  managerName: string;
}

export interface projectCreationResponse {
  projectId: number;
  data: createProject;
  sucess: boolean;
  message: string;
  error?: Error;
}

export interface deleteProjectResponse {
  message: string;
  error?: Error;
}

//type for junction table
export interface userProjectsData {
  projectId: number;
  userId: number;
  userType: AssignedUserTypes;
}

//create bug
export interface createBug {
  title: string;
  description: string;
  deadline: string;
  type: BugType;
  status?: status;
  projectId: number;
  developerId: number;
  screenshot?: string;
  isClose?: boolean;
}

export interface updateBug {
  title?: string;
  description?: string;
  deadline?: string;
  type?: BugType;
  status?: status;
  projectId?: number;
  developerId?: number;
  screenshot?: string;
}

export interface editBug {
  bug: updateBug;
  bugStatus: status;
}

export interface getBugs {
  bugs: Bug[];
  succees: boolean;
  message: string;
  error?: Error;
  count: number;
}

export interface IBugState {
  totalBugs: number;
  completedBugs: number;
  pendingBugs: number;
}
