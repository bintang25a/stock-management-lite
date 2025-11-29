import { Sequelize, DataTypes } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const db_dialect = process.env.DB_CONNECTION;
const db_host = process.env.DB_HOST;
const db_database = process.env.DB_DATABASE;
const db_user = process.env.DB_USERNAME;
const db_password = process.env.DB_PASSWORD;

const db = new Sequelize(db_database, db_user, db_password, {
  host: db_host,
  dialect: db_dialect,
  logging: false,
});

const connectDB = async () => {
  try {
    await db.authenticate();
    console.log("Database connected!");
  } catch (err) {
    console.error("Database connection error:", err.message);
    process.exit(1);
  }
};

const Product = db.define("products", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL,
    allowNull: false,
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  expiredDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

export { db, connectDB, Product };
