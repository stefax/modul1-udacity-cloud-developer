import {Sequelize} from 'sequelize-typescript';
import { config as c } from './config/config';

// Instantiate new Sequelize instance!
export const sequelize = new Sequelize({
  "username": c.username,
  "password": c.password,
  "database": c.database,
  "host":     c.host,

  dialect: c.dialect,
  storage: ':memory:',
});

