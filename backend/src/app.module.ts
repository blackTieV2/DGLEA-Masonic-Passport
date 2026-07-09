import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { AppConfigModule } from "./config/app-config.module";
import { HealthModule } from "./modules/health/health.module";
import { AuthModule } from "./modules/auth/auth.module";
import { OrganisationsModule } from "./modules/organisations/organisations.module";
import { RolesModule } from "./modules/roles/roles.module";
import { BrothersModule } from "./modules/brothers/brothers.module";
import { BrotherProfilesModule } from "./modules/brother-profiles/brother-profiles.module";
import { PassportModule } from "./modules/passport/passport.module";
import { ProgressModule } from "./modules/progress/progress.module";
import { ReviewsModule } from "./modules/reviews/reviews.module";
import { MentorshipModule } from "./modules/mentorship/mentorship.module";
import { ActivityModule } from "./modules/activity/activity.module";
import { ProgressionModule } from "./modules/progression/progression.module";
import { NotificationsModule } from "./modules/notifications/notifications.module";
import { ReportingModule } from "./modules/reporting/reporting.module";
import { AuditModule } from "./modules/audit/audit.module";
import { LodgeProfilesModule } from "./modules/lodge-profiles/lodge-profiles.module";
import { DegreeProgressModule } from "./modules/degree-progress/degree-progress.module";
import { ExportsModule } from "./modules/exports/exports.module";
import { FirebaseAuthGuard } from "./common/guards/firebase-auth.guard";
import { PrismaModule } from "./common/prisma/prisma.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AppConfigModule,
    PrismaModule,
    HealthModule,
    AuthModule,
    OrganisationsModule,
    RolesModule,
    BrothersModule,
    BrotherProfilesModule,
    PassportModule,
    ProgressModule,
    ReviewsModule,
    MentorshipModule,
    ActivityModule,
    ProgressionModule,
    NotificationsModule,
    ReportingModule,
    AuditModule,
    LodgeProfilesModule,
    DegreeProgressModule,
    ExportsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: FirebaseAuthGuard,
    },
  ],
})
export class AppModule {}
