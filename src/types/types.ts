


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
