import { Router } from "express";
import { Authentication } from "../middleWares/authentication";
import { BugController } from '../controllers/bugsController/bugController';
import { uploadBugScreenshot } from "../middleWares/upload";
export const router = Router()

router.get('/:projectId' ,  Authentication.authenticate , BugController.getAllBugs) //get all bugs on a project
router.post('/create' ,  Authentication.authenticate , Authentication.autorizeSQArole , uploadBugScreenshot.single('screenshot'), BugController.createBug)
router.patch('/:bugId' , Authentication.authenticate , Authentication.autorizeDeveloperRole , BugController.updateBugStatus)