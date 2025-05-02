import { Module } from "@nestjs/common";
import { SpacesController } from "./spaces.controller";
import { SpacesService } from "./spaces.service";
import { PrismaService } from "src/prisma/prisma.service";  
import { PrismaModule } from "src/prisma/prisma.module";
import { SpacesRepository } from "./spaces.repository";

@Module({
    imports: [PrismaModule],
    controllers: [SpacesController],
    providers: [SpacesService, PrismaService, SpacesRepository],
    exports: [],
})

export class SpacesModule {}