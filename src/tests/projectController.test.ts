import { User } from "../models/association";
import { Project } from "../models/association";
import { ProjectController } from "../controllers/projectController/projectController";
import {
  ProjectFields,
  ProjectErrorMessages,
} from "../constants/ProjectErrorMessages";
import { successCodes } from "../constants/sucessCodes";
import { errorCodes } from "../constants/errorCodes";
import { successMessages } from "../constants/sucessMessages";

describe("Project Controller", () => {
  let manager: any;
  let dev1: any;
  let dev2: any;
  let sqa: any;
  let project: any;

  beforeEach(async () => {
    manager = await User.create({
      name: "Manager saad aftab",
      email: "manager@test.com",
      password: "hashed_password",
      userType: "manager",
      phoneNumber: "123456789",
    });

    dev1 = await User.create({
      name: "Dev 1",
      email: "dev1@test.com",
      password: "hashed_password",
      userType: "developer",
      phoneNumber: "111111111",
    });

    dev2 = await User.create({
      name: "Dev 2",
      email: "dev2@test.com",
      password: "hashed_password",
      userType: "developer",
      phoneNumber: "111111111",
    });

    sqa = await User.create({
      name: "SQA Expert",
      email: "sqa@test.com",
      password: "hashed_password",
      userType: "sqa",
      phoneNumber: "222222222",
    });
  });

  describe("validate create project cases", () => {
    it("should create project successfully ", async () => {
      const req = {
        body: {
          name: "project one",
          developerIds: `${dev1.id}`,
          sqaIds: `${sqa.id}`,
          description: "this is the des ",
        },
        user: { id: manager.id, userType: "manager" },
        file: { path: "", filename: "" },
      } as any;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;
      const next = jest.fn();
      await ProjectController.createProject(req, res, next);
      expect(res.status).toHaveBeenCalledWith(successCodes.CREATED);
      expect(res.json).toHaveBeenCalledWith({
        message: successMessages.MESSAGES.CREATED,
      });
    });

    it("should throw error for access denied during project creation ", async () => {
      const req = {
        body: {
          name: "project one",
          developerIds: `${dev1.id}`,
          sqaIds: `${sqa.id}`,
          description: "this is the des ",
        },
        user: { id: manager.id, userType: "developer" },
        file: { path: "", filename: "" },
      } as any;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;
      const next = jest.fn();
      await ProjectController.createProject(req, res, next);
      expect(next).toHaveBeenCalled();
      const passedError = next.mock.calls[0][0];
      expect(passedError.statusCode).toBe(errorCodes.FORBIDDEN);
      expect(passedError.message).toBe(ProjectErrorMessages.PERMISSION_DENIED
      );
    });

    it("should throw error for name filed missing and developerIds ", async () => {
      const req = {
        body: {
          sqaIds: `${sqa.id}`,
          description: "this is the des ",
        },
        user: { id: manager.id, userType: "manager" },
        file: { path: "", filename: "" },
      } as any;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;
      const next = jest.fn();
      await ProjectController.createProject(req, res, next);
      expect(next).toHaveBeenCalled();
      const passedError = next.mock.calls[0][0];

      expect(passedError.errors).toEqual(
        expect.arrayContaining([
          {
            field: ProjectFields.NAME,
            message: ProjectErrorMessages.NAME_REQUIRED,
          },
          {
            field: ProjectFields.DEVELOPER_IDS,
            message: ProjectErrorMessages.DEVELOPER_REQUIRED,
          },
        ]),
      );
    });

    it("should throw error for invalid data types like for developerIds(abc , 2, c) ", async () => {
      const req = {
        body: {
          name: "project one",
          sqaIds: `${sqa.id}`,
          developerIds: "abc, 2, c",
          description: "this is the des ",
        },
        user: { id: manager.id, userType: "manager" },
        file: { path: "", filename: "" },
      } as any;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;
      const next = jest.fn();
      await ProjectController.createProject(req, res, next);
      expect(next).toHaveBeenCalled();
      const passedError = next.mock.calls[0][0];
      expect(passedError.statusCode).toBe(errorCodes.BAD_REQUEST);
      expect(passedError.errors).toEqual(
        expect.arrayContaining([
          {
            field: ProjectFields.DEVELOPER_IDS,
            message: ProjectErrorMessages.INVALID_DEVELOPER_IDS,
          },
        ]),
      );
    });

    it("should throw error for invalid data types like for sqaid(abc , 2, c) ", async () => {
      const req = {
        body: {
          name: "project one",
          sqaIds: `abc, 2,c`,
          developerIds: `${dev1.id}`,
          description: "this is the des ",
        },
        user: { id: manager.id, userType: "manager" },
        file: { path: "", filename: "" },
      } as any;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;
      const next = jest.fn();
      await ProjectController.createProject(req, res, next);
      expect(next).toHaveBeenCalled();
      const passedError = next.mock.calls[0][0];
      expect(passedError.statusCode).toBe(errorCodes.BAD_REQUEST);
      expect(passedError.errors).toEqual(
        expect.arrayContaining([
          {
            field: ProjectFields.SQA_IDS,
            message: ProjectErrorMessages.INVALID_SQA_IDS,
          },
        ]),
      );
    });
    it("should throw error for invalid data types like for sqaid(abc , 2, c) ", async () => {
      const req = {
        body: {
          name: "project one",
          sqaIds: `abc, 2,c`,
          developerIds: `${dev1.id}`,
          description: "this is the des ",
        },
        user: { id: manager.id, userType: "manager" },
        file: { path: "", filename: "" },
      } as any;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;
      const next = jest.fn();
      await ProjectController.createProject(req, res, next);
      expect(next).toHaveBeenCalled();
      const passedError = next.mock.calls[0][0];
      expect(passedError.statusCode).toBe(errorCodes.BAD_REQUEST);
      expect(passedError.errors).toEqual(
        expect.arrayContaining([
          {
            field: ProjectFields.SQA_IDS,
            message: ProjectErrorMessages.INVALID_SQA_IDS,
          },
        ]),
      );
    });
  });

  describe("validate edit project cases", () => {
    let project: any;
    beforeEach(async () => {
      project = await Project.create({
        name: "project name",
        managerId: manager.id,
        image: "",
        imagePublicId: "",
        description: "this is description",
      });
      await project.setDevelopers([dev1, dev2]);
      await project.setSqas([sqa]);
    });
    it("should edit project successfully with valid details", async () => {
      const req = {
        body: {
          name: "project one",
          developerIds: `${dev1.id},${dev2.id}`,
          sqaIds: `${sqa.id}`,
          description: "this is updated description ",
        } as any,

        user: { id: manager.id, userType: "manager" },
        params: { projectId: project.projectId },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;
      const next = jest.fn();
      await ProjectController.editProject(req as any, res, next);
      expect(res.status).toHaveBeenCalledWith(successCodes.OK);
      expect(res.json).toHaveBeenCalledWith({
        message: successMessages.MESSAGES.UPDATED,
      });
    });
    it("should throw error on invalid developer ids during edit project ", async () => {
      const req = {
        body: {
          name: "project one",
          developerIds: `333,444`,
          sqaIds: `${sqa.id}`,
          description: "this is updated description ",
        } as any,

        user: { id: manager.id, userType: "manager" },
        params: { projectId: project.projectId },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;
      const next = jest.fn();
      await ProjectController.editProject(req as any, res, next);

      expect(next).toHaveBeenCalled();
      const passedError = next.mock.calls[0][0];
      expect(passedError.statusCode).toBe(errorCodes.BAD_REQUEST);
      expect(passedError.errors).toEqual(
        expect.arrayContaining([
          {
            field: ProjectFields.DEVELOPER_IDS,
            message: ProjectErrorMessages.INVALID_DEVELOPER_IDS,
          },
        ]),
      );
    });

    it("should throw error access denied for invalid manager id  during edit project ", async () => {
      const req = {
        body: {
          name: "project one",
          developerIds: `${dev1.id},${dev2.id}`,
          sqaIds: `${sqa.id}`,
          description: "this is updated description ",
        } as any,
        user: { id: 12, userType: "manager" },
        params: { projectId: project.projectId },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;
      const next = jest.fn();
      await ProjectController.editProject(req as any, res, next);

      expect(next).toHaveBeenCalled();
      const passedError = next.mock.calls[0][0];
      expect(passedError.statusCode).toBe(errorCodes.FORBIDDEN);
      expect(passedError.message).toEqual(ProjectErrorMessages.PERMISSION_DENIED);
    });
  });
  describe("Delete Project", () => {
    let project: any;
    beforeEach(async () => {
      project = await Project.create({
        name: "project name",
        managerId: manager.id,
        image: "",
        imagePublicId: "",
        description: "this is description",
      });
      await project.setDevelopers([dev1, dev2]);
      await project.setSqas([sqa]);
    });

    it("should delete project successfully ", async () => {
      const req = {
        user: { id: manager.id, userType: "manager" },
        params: { projectId: project.projectId },
      };
       const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;
      const next  = jest.fn()
      await ProjectController.deleteProjectById(req as any , res , next)
      expect(res.status).toHaveBeenCalledWith(successCodes.OK);
      expect(res.json).toHaveBeenCalledWith({
        message: successMessages.MESSAGES.DELETED
      })
    });

    it("should throw error on invalid id like (abc)", async () => {
      const req = {
        user: { id: manager.id, userType: "manager" },
        params: { projectId: 'abc' },
      };
       const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;
      const next  = jest.fn()
      await ProjectController.deleteProjectById(req as any , res , next)
      expect(next).toHaveBeenCalled()
      const passedError = next.mock.calls[0][0];
      expect(passedError.statusCode).toBe(errorCodes.BAD_REQUEST);
      expect(passedError.message).toEqual(
        ProjectErrorMessages.INVALID_ID_FORMAT
      );
    });

    it("should throw error access denied for different manger id ", async () => {
      const req = {
        user: { id: 999, userType: "manager" },
        params: { projectId: project.projectId },
      };
       const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;
      const next  = jest.fn()
      await ProjectController.deleteProjectById(req as any , res , next)
      expect(next).toHaveBeenCalled()
      const passedError = next.mock.calls[0][0];
      expect(passedError.statusCode).toBe(errorCodes.FORBIDDEN);
      expect(passedError.message).toEqual(
         ProjectErrorMessages.PERMISSION_DENIED
      );
    });
  });
});
