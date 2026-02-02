import { Router } from "express";
import { Authentication } from "../middleWares/authentication";
import { BugController } from '../controllers/bugsController/bugController';
import { uploadBugScreenshot } from "../middleWares/upload";
export const router = Router()

router.get('/' ,  Authentication.authenticate , BugController.getBugsOnAProject) //get all bugs on a project
router.post('/' ,  Authentication.authenticate , Authentication.autorizeSQArole , uploadBugScreenshot.single('screenshot'), BugController.createBug)
router.patch('/:bugId' , Authentication.authenticate  ,uploadBugScreenshot.single('screenshot'), BugController.updateBug)
router.delete('/:bugId' , Authentication.authenticate , Authentication.autorizeSQArole , BugController.deleteBug)
router.get('/' , Authentication.authenticate , BugController.getBugs)