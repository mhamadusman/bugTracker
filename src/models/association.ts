import { User,  } from "./users.model";
import { Project } from "./project.model";
import { UserProjects } from "./userProjects.model";


//associaton b/w projects and managers one to many 

User.hasMany(Project, {foreignKey: "managerId" , as: "managedProjects"})
Project.belongsTo(User, {foreignKey: "managerId" , as: "manager"})




///createe association many to many between user and projects
User.belongsToMany(Project, {
  through: UserProjects,
  foreignKey: "userId",
  otherKey: "projectId",
  as: "assignedProjects"
});

Project.belongsToMany(User, {
  through: UserProjects,
  foreignKey: "projectId",
  otherKey: "userId",
  as: "assignedUsers"
});