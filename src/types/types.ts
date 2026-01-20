import { BugType } from "../models/bug.model"
import { status } from "../models/bug.model"
import { Bug } from "../models/bug.model"


export enum UserTypes {
  DEVELOPER = 'developer',
  SQA = 'sqa',
  MANAGER = 'manager',
}
//interface for assigned users 



export interface createUser {
    
    name: string,
    email: string,
    password: string,
    userType: UserTypes
    phoneNumber: number,

}



export interface signUpResponse{
    
    error?: Error,
    message?: string,
    sucess?: boolean,
    user_id?: number,
    email?: string 
    
}


//projects
export interface projects{
    name: string,
    projectId: number,
    managerId: number
}

//project interfaces
export interface project {
    name : string,
    managerId: number,
    message?: string,
    projectId?: number,
    sucess?: boolean
}

//for managing projects

export enum AssignedUserTypes{
  DEVELOPER = 'developer',
  SQA = 'sqa',
}

export interface createProject {

    name: string,
    managerId?: number,
    sqaIds: string,
    developerIds: string
}

export interface projectCreationResponse{


    projectId: number,
    data: createProject
    sucess: boolean,
    message: string,
    error?: Error,
}

export interface deleteProjectResponse {
    sucess: boolean,
    message: string,
    error?: Error
}

//type for junction table 
export interface userProjectsData {
    projectId: number,
    userId: number,
    userType: AssignedUserTypes
}



//..............................

// declare bugId: CreationOptional<number>;

//   declare title: string;
//   declare description: string;

//   declare deadline: Date;

//   declare type: BugType;

//    declare status: status;
//   declare projectId: ForeignKey<Project["projectId"]>;
//   declare developerId: ForeignKey<User["id"]>;
//   declare sqaId: ForeignKey<User["id"]>;

//   declare project?: Project;
//   declare developer?: User;
//   declare sqa?: User;


//create bug 

export interface createBug{
    title: string,
    description: string,
    deadline: Date,
    type: BugType,
    status: status,
    projectId: number,
    developerId: number,
    screenshot?: string

}

export interface getBugs{
    data: Bug[],
    succees: boolean,
    message: string,
    error?: Error,
    count: number
}