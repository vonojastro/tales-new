import { Sequelize } from "sequelize";

const sequelize = new Sequelize("postgres", "postgres", "postgres", {
  host: "localhost",
  port: 5432, // Replace 5432 with your own PostgreSQL port number
  dialect: "postgres",
});

export default sequelize;