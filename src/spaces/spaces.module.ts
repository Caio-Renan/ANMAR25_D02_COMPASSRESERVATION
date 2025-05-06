import { Module } from "@nestjs/common";
import { SpacesController } from "./spaces.controller";
import { SpacesService } from "./spaces.service"; 
import { PrismaModule } from "src/prisma/prisma.module";
import { SpaceValidationService } from "./spacesValidate.service";

@Module({
    imports: [PrismaModule],
    controllers: [SpacesController],
    providers: [SpacesService, SpaceValidationService],
    exports: [SpacesService],
})

export class SpacesModule {}