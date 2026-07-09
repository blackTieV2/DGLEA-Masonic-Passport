import { Module, Global } from "@nestjs/common";
import { PermissionEvaluator } from "./permission-evaluator.service";

@Global()
@Module({
  providers: [PermissionEvaluator],
  exports: [PermissionEvaluator],
})
export class RolesModule {}
