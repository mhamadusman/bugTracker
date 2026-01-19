import { Router } from "express";
import { Authentication } from "../middleWares/authentication";
import { ProjectController } from "../controllers/projectController/projectController";
export const router  = Router()

router.post('/create' , Authentication.authenticate, Authentication.autorizeManagerRole , ProjectController.createProjct)
router.get('/:managerId' , Authentication.authenticate,  ProjectController.getManagerProjects)
router.delete('/:projectId', Authentication.authenticate, Authentication.autorizeManagerRole , ProjectController.deleteProjectById)