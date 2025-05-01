

import { Injectable} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";


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
}