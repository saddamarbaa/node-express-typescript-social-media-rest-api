"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = (MONGODB_URI) => {
    mongoose_1.default.connection.on('connected', () => {
        console.log('MongoDB database connection established successfully');
    });
    mongoose_1.default.connection.on('reconnected', () => {
        console.log('Mongo Connection Reestablished');
    });
    mongoose_1.default.connection.on('error', (error) => {
        console.log('MongoDB connection error. Please make sure MongoDB is running: ');
        console.log(`Mongo Connection ERROR: ${error}`);
    });
    mongoose_1.default.connection.on('close', () => {
        console.log('Mongo Connection Closed...');
    });
    mongoose_1.default.connection.on('disconnected', () => {
        console.log('MongoDB database connection is disconnected...');
        console.log('Trying to reconnect to Mongo ...');
        setTimeout(() => {
            mongoose_1.default.connect(MONGODB_URI, {
                keepAlive: true,
                socketTimeoutMS: 3000,
                connectTimeoutMS: 3000,
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
        }, 3000);
    });
    process.on('SIGINT', () => {
        mongoose_1.default.connection.close(() => {
            console.log('MongoDB database connection is disconnected due to app termination...');
            process.exit(0);
        });
    });
    mongoose_1.default.connect(MONGODB_URI, {
        keepAlive: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    return mongoose_1.default.connect(MONGODB_URI);
};
exports.connectDB = connectDB;
exports.default = exports.connectDB;
//# sourceMappingURL=db.config.js.map