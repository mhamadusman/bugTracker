import { Router } from "express";
import { Authentication } from "../middleWares/authentication";
import { ProjectController } from "../controllers/projectController/projectController";
import { uploadProjectImage } from "../middleWares/upload";
export const router  = Router()

router.post('/create' , Authentication.authenticate, Authentication.autorizeManagerRole ,uploadProjectImage.single('image'), ProjectController.createProjct)
router.get('/' , Authentication.authenticate ,  ProjectController.getProjects)
router.delete('/:projectId', Authentication.authenticate,  Authentication.autorizeManagerRole
               , ProjectController.deleteProjectById)
router.patch('/:projectId' , Authentication.authenticate , Authentication.autorizeManagerRole,uploadProjectImage.single('image'),
             ProjectController.editProject
)