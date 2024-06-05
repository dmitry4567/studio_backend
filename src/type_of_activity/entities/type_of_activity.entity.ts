import { ApiHideProperty } from "@nestjs/swagger";
import { StudioSessionEntity } from "src/studio_sessions/entities/studio_session.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('type_of_activity')
export class TypeOfActivityEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    name: string;
  
    @ApiHideProperty()
    @OneToMany(() => StudioSessionEntity, (studio_session) => studio_session.type_of_activity)
    studio_session: StudioSessionEntity[];
}
