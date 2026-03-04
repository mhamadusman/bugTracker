import sequelize from "./config/database";
import {User , Project , UserProjects , Bug} from './models/association'


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
