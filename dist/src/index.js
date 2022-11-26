"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("@src/app"));
const custom_environment_variables_config_1 = require("@src/configs/custom-environment-variables.config");
const db_config_1 = require("@src/configs/db.config");
const start = async () => {
    try {
        await (0, db_config_1.connectDB)(custom_environment_variables_config_1.environmentConfig.MONGODB_CONNECTION_STRING);
        console.log('MongoDB database connection established successfully to... ');
        app_1.default?.listen(custom_environment_variables_config_1.environmentConfig.PORT, () => {
            console.log(`Listening: http://localhost:${custom_environment_variables_config_1.environmentConfig.PORT}`);
        });
    }
    catch (error) {
        console.log('MongoDB connection error. Please make sure MongoDB is running: ');
    }
};
start();
//# sourceMappingURL=index.js.map