import { Router } from "express";
import { Authentication } from "../middleWares/authentication";
import { ProjectController } from "../controllers/projectController/projectController";
export const router  = Router()

router.post('/create' , Authentication.authenticate, Authentication.autorizeManagerRole , ProjectController.createProjct)
router.get('/:userId' , Authentication.authenticate,  ProjectController.getProjects)

router.delete('/:projectId', Authentication.authenticate, Authentication.autorizeManagerRole
               , ProjectController.deleteProjectById)
router.patch('/:projectId' , Authentication.authenticate , Authentication.autorizeManagerRole,
             ProjectController.editProject
)