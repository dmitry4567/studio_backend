import { PartialType } from '@nestjs/swagger';
import { CreateTypeOfActivityDto } from './create-type_of_activity.dto';

export class UpdateTypeOfActivityDto extends PartialType(CreateTypeOfActivityDto) {}
