import { Project } from "./project.model";
import { UserProjects } from "./userProjects.model";
import { Bug } from "./bug.model";
import { User } from "./users.model";

export function setupAssociations() {
  User.hasMany(Project, { foreignKey: "managerId", as: "managedProjects" });
  Project.belongsTo(User, { foreignKey: "managerId", as: "manager" });

  User.belongsToMany(Project, {
    through: UserProjects,
    foreignKey: "userId",
    otherKey: "projectId",
    as: "assignedProjects",
  });

  Project.belongsToMany(User, {
    through: UserProjects,
    foreignKey: "projectId",
    otherKey: "userId",
    as: "assignedUsers",
  });

  Project.belongsToMany(User, {
    through: UserProjects,
    foreignKey: "projectId",
    otherKey: "userId",
    as: "developers",
    scope: { userType: "developer" },
  });

  Project.belongsToMany(User, {
    through: UserProjects,
    foreignKey: "projectId",
    otherKey: "userId",
    as: "sqas",
    scope: { userType: "sqa" },
  });

  Project.hasMany(Bug, { foreignKey: "projectId", as: "bugs" });
  Bug.belongsTo(Project, { foreignKey: "projectId", as: "project" });

  User.hasMany(Bug, { foreignKey: "developerId", as: "developerBugs" });
  Bug.belongsTo(User, { foreignKey: "developerId", as: "developer" });

  User.hasMany(Bug, { foreignKey: "sqaId", as: "sqaBugs" });
  Bug.belongsTo(User, { foreignKey: "sqaId", as: "sqa" });
}

setupAssociations();
export { User, Project, Bug, UserProjects };