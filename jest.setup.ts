import sequelize from "./src/config/database";
import { User, Project, Bug, UserProjects } from './src/models/association'


beforeAll(async () => {
  await sequelize.authenticate();
});

afterEach(async () => {
  const models = Object.values(sequelize.models);
  for (const model of models) {
    await model.destroy({
      where: {},
      truncate: true,
      cascade: true,
    });
  }
});

afterAll(async () => {
  await sequelize.close();
});
