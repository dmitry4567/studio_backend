import { Module } from '@nestjs/common';
import { TypeOfActivityService } from './type_of_activity.service';
import { TypeOfActivityController } from './type_of_activity.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOfActivityEntity } from './entities/type_of_activity.entity';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([TypeOfActivityEntity]), JwtModule, UserModule],
  controllers: [TypeOfActivityController],
  providers: [TypeOfActivityService],
  exports: [TypeOfActivityService]
})
export class TypeOfActivityModule {}
