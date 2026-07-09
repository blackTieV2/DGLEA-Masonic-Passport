import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import * as Joi from "joi";

export interface AppConfig {
  NODE_ENV: string;
  PORT: number;
  DATABASE_URL: string;
  GOOGLE_APPLICATION_CREDENTIALS?: string;
  FIREBASE_PROJECT_ID?: string;
  DEV_AUTH_USER_ID?: string;
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid("development", "test", "production").default("development"),
        PORT: Joi.number().default(3000),
        DATABASE_URL: Joi.string().uri().required(),
        GOOGLE_APPLICATION_CREDENTIALS: Joi.string().optional(),
        FIREBASE_PROJECT_ID: Joi.string().optional(),
        DEV_AUTH_USER_ID: Joi.string().uuid().optional(),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class AppConfigModule {}
