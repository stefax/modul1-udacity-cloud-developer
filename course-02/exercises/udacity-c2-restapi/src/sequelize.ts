import {Sequelize} from 'sequelize-typescript';
import { config } from './config/config';

// Instantiate new Sequelize instance!
export const sequelize = new Sequelize({
  "username": config.database.username,
  "password": config.database.password,
  "database": config.database.database,
  "host":     config.database.host,

  dialect: config.database.dialect,
  storage: ':memory:',
});

