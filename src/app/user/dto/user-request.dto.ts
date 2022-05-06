import { OmitType, PartialType } from '@nestjs/mapped-types';
import { UserDto } from './user-response.dto';

export class UpdateUser extends PartialType(OmitType(UserDto, ['id'])) {}
