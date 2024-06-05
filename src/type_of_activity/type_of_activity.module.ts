import { Module } from '@nestjs/common';
import { TypeOfActivityService } from './type_of_activity.service';
import { TypeOfActivityController } from './type_of_activity.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOfActivityEntity } from './entities/type_of_activity.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([TypeOfActivityEntity]), JwtModule],
  controllers: [TypeOfActivityController],
  providers: [TypeOfActivityService],
  exports: [TypeOfActivityService]
})
export class TypeOfActivityModule {}
