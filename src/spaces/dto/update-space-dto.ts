import { CreateSpaceDto } from "./create-space-dto";
import { PartialType } from "@nestjs/mapped-types";

export class updateSpaceDto extends PartialType (CreateSpaceDto) {}