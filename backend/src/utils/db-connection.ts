import mongoose, { Model, Connection } from 'mongoose';
import { DB_CONFIGS, DB_SCHEMA } from '../config/constants';
import { UserSchema } from '../database/schemas/user-schema';
import { LoginInfoSchema } from '../database/schemas/login-info-schema';
import { ClassSchema } from '../database/schemas/class-schema';
import { ChatSchema, MessageSchema } from '../database/schemas/chat-schema';
import { TestSchema } from '../database/schemas/test-schema';
import { SubjectSchema } from '../database/schemas/subject-schema';
import {
    ScoreSchema,
    ScoresTableSchema,
} from '../database/schemas/score-schema';
import {
    FeedSchema,
    PostSchema,
    CommentSchema,
} from '../database/schemas/feed-schema';
import { SemesterSchema } from '../database/schemas/stemester-schema';

interface IDBConnection {
    initiated: boolean;
    connection: Connection | null;
    LoginInfo: Model<any> | null;
    User: Model<any> | null;
    Class: Model<any> | null;
    Chat: Model<any> | null;
    Message: Model<any> | null;
    Subject: Model<any> | null;
    Score: Model<any> | null;
    ScoresTable: Model<any> | null;
    Post: Model<any> | null;
    Feed: Model<any> | null;
    Comment: Model<any> | null;
    Semester: Model<any> | null;
    Test: Model<any> | null;
    init(): Promise<void>;
    disconnect(): Promise<void>;
}

class DatabaseConnection implements IDBConnection {
    public initiated = false;
    public connection: Connection | null = null;
    public LoginInfo: Model<any> | null = null;
    public User: Model<any> | null = null;
    public Class: Model<any> | null = null;
    public Chat: Model<any> | null = null;
    public Message: Model<any> | null = null;
    public Subject: Model<any> | null = null;
    public Score: Model<any> | null = null;
    public ScoresTable: Model<any> | null = null;
    public Post: Model<any> | null = null;
    public Feed: Model<any> | null = null;
    public Comment: Model<any> | null = null;
    public Semester: Model<any> | null = null;
    public Test: Model<any> | null = null;

    async init(): Promise<void> {
        if (this.initiated) {
            console.log('Database already initialized');
            return;
        }

        try {
            const connectionString = `${DB_CONFIGS.HOST}:${DB_CONFIGS.PORT}`;
            console.log(`Connecting to MongoDB at ${connectionString}`);

            this.connection = await mongoose
                .createConnection(connectionString)
                .asPromise();

            this.LoginInfo = this.connection.model(
                DB_SCHEMA.LOGIN_INFO,
                LoginInfoSchema
            );
            this.User = this.connection.model(DB_SCHEMA.USER, UserSchema);
            this.Class = this.connection.model(DB_SCHEMA.CLASS, ClassSchema);
            this.Chat = this.connection.model(DB_SCHEMA.CHAT, ChatSchema);
            this.Message = this.connection.model(
                DB_SCHEMA.MESSAGE,
                MessageSchema
            );
            this.Subject = this.connection.model(
                DB_SCHEMA.SUBJECT,
                SubjectSchema
            );
            this.Score = this.connection.model(DB_SCHEMA.SCORE, ScoreSchema);
            this.ScoresTable = this.connection.model(
                DB_SCHEMA.SCORES_TABLE,
                ScoresTableSchema
            );
            this.Post = this.connection.model(DB_SCHEMA.POST, PostSchema);
            this.Feed = this.connection.model(DB_SCHEMA.FEED, FeedSchema);
            this.Comment = this.connection.model(
                DB_SCHEMA.COMMENT,
                CommentSchema
            );
            this.Semester = this.connection.model(
                DB_SCHEMA.SEMESTER,
                SemesterSchema
            );
            this.Test = this.connection.model(
                DB_SCHEMA.TEST_SCHEMA,
                TestSchema
            );

            this.initiated = true;
            console.log('Database connection established successfully');
        } catch (error) {
            console.error('Failed to connect to database:', error);
            throw error;
        }
    }

    async disconnect(): Promise<void> {
        if (this.connection) {
            await this.connection.close();
            this.initiated = false;
            console.log('Database connection closed');
        }
    }
}

export const DBConnection = new DatabaseConnection();
