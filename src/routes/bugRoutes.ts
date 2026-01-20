import { Router } from "express";
import { Authentication } from "../middleWares/authentication";
import { BugController } from '../controllers/bugsController/bugController';
export const router = Router()

router.get('/:projectId' ,  Authentication.authenticate , BugController.getAllBugs) //get all bugs on a project
router.post('/create' , Authentication.authenticate , Authentication.autorizeSQArole , BugController.createBug)
router.patch('/:bugId' , Authentication.authenticate , Authentication.autorizeDeveloperRole , BugController.updateBugStatus)
