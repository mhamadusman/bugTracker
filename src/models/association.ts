import { User,  } from "./users.model";
import { Project } from "./project.model";
import { UserProjects } from "./userProjects.model";
import { Bug } from "./bug.model";

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



//projct has many bugs 
Project.hasMany(Bug, {
  foreignKey: "projectId",
  as: "bugs"

});


//bug has one project
Bug.belongsTo(Project, {
  foreignKey: "projectId",
  as: "project"
});



//developr has many bugs 

User.hasMany(Bug, {
  foreignKey: "developerId",
  as: "developerBugs"
});

Bug.belongsTo(User, {
  foreignKey: "developerId",
  as: "developer"
});

// same as developer
User.hasMany(Bug, {
  foreignKey: "sqaId",
  as: "sqaBugs"
});

Bug.belongsTo(User, {
  foreignKey: "sqaId",
  as: "sqa"
});