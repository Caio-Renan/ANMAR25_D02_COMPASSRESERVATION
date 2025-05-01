

import { Injectable, NotAcceptableException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateReservationResourceDto } from "./dto/create-reservation-dto";


@Injectable()
export class ReservationValidationService {
     constructor(private readonly prisma: PrismaService) { }


     async isSpaceActive(spaceId: number): Promise<boolean> {
          const space = await this.prisma.space.findUnique({
               where: { id: spaceId },
               select: { status: true },
          });

          return space?.status === 'ACTIVE'
     }

     async isResourceActiveAndEnough(resources: CreateReservationResourceDto[]): Promise<boolean> {
          for (const { resourceId, quantity } of resources) {
               const resource = await this.prisma.resource.findUnique({
                    where: { id: resourceId }
               })
               if (!resource || resource.status === 'INACTIVE') {
                    throw new NotFoundException(`Resource with ID ${resourceId} not found or is inactive`);
               }

               if (quantity > resource.quantity) {
                    throw new NotAcceptableException(`Not enough of resource ${resourceId}. Requested: ${quantity}, Available: ${resource.quantity}`);
               }
          }
          return true;
     }
}