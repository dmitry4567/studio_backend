import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Role } from './role/entities/role.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UserEnitity } from './user/entities/user.entity';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('School X - OpenAPI 3.0')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = parseInt(process.env.PORT);
  const server = process.env.SERVER;

  init(app);

  await app.listen(port, server);

  console.log(`Application is running on: ${await app.getUrl()}`);
}

async function init(app: INestApplication<any>) {
  const rolesRepository = app.get<Repository<Role>>(getRepositoryToken(Role));
  const existingRoles = await rolesRepository.find();

  if (existingRoles.length === 0) {
    const adminRole = new Role();
    adminRole.value = 'admin';
    const roleadmin = await rolesRepository.save(adminRole);

    const userRole = new Role();
    userRole.value = 'user';
    await rolesRepository.save(userRole);

    const userRepository = app.get<Repository<UserEnitity>>(
      getRepositoryToken(UserEnitity),
    );
    const adminEntity = new UserEnitity();
    adminEntity.nickname = process.env.NICKNAME_ADMIN;
    adminEntity.fullname = process.env.NICKNAME_ADMIN;
    adminEntity.email = process.env.EMAIL_ADMIN;
    const hashedPassword = await bcrypt.hash(
      process.env.PASSWORD_ADMIN,
      Number(process.env.HASH_SALT_ROUNDS),
    );
    adminEntity.password = hashedPassword;
    adminEntity.role = roleadmin;

    await userRepository.save(adminEntity);

    console.log('Admin has been created.');
  }
}

bootstrap();
