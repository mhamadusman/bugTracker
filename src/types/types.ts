import { BugType } from "../models/bug.model"
import { status } from "../models/bug.model"
import { Bug } from "../models/bug.model"
import { Project } from "../models/project.model"


export enum UserTypes {
  DEVELOPER = 'developer',
  SQA = 'sqa',
  MANAGER = 'manager',
}




export interface createUser {
    
    name: string,
    email: string,
    password: string,
    userType: UserTypes
    phoneNumber: string,

}

export interface updateUser{
    name: string,
    email: string,
    password?: string,
    phoneNumber: string,
    image?: string
}



export interface signUpResponse{
    
    error?: Error,
    message?: string,
    sucess?: boolean,
    user_id?: number,
    email?: string,
    toke?: string
    
}

export interface loginResponse{
      message?: string,
      token?: string, 
      userType?: string,
      refreshToken: string
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
    sucess?: boolean,
    description?: string 
    image?: string | null
}

export interface IProjects{
    projects: Project[],
    totalProjects: number,
    pages: number
}
export interface IBugs{
    bugs: Bug[],
    totalBugs: number,
    pages: number
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
    developerIds: string,
    description: string
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

//create bug 
export interface createBug{
    title: string,
    description: string,
    deadline: string,
    type: BugType,
    status?: status,
    projectId: number,
    developerId: number,
    screenshot?: string
}






export interface updateBug{
    title?: string,
    description?: string,
    deadline?: string,
    type?: BugType,
    status?: status,
    projectId?: number,
    developerId?: number
    screenshot?: string
}

export interface editBug{
    bug: updateBug,
    bugStatus: status
}

export interface getBugs{
    bugs: Bug[],
    succees: boolean,
    message: string,
    error?: Error,
    count: number
}
