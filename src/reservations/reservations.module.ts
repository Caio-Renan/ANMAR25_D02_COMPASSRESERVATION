import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { ReservationController } from "./reservations.controller";
import { ReservationService } from "./reservations.service";

@Module({
     imports: [PrismaModule],
     controllers: [ReservationController],
     providers: [ReservationService],
     exports: [ReservationService]
})
export class ReservationModule {

}