import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EstadosTareasEnum } from '../enums/estados-tareas.enum';
import { Proyecto } from './proyecto.entity';

@Entity({ name: 'tareas' })
export class Tareas {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  descripcion!: string;

  @Column({ name: 'estado', type: 'enum', enum: EstadosTareasEnum })
  estado!: EstadosTareasEnum;

  @Column({ name: 'id_proyecto' })
  idProyecto!: number;

  @ManyToOne(() => Proyecto)
  @JoinColumn({ name: 'id_proyecto' }) //un proyecto, muchas tareas
  proyecto!: Proyecto;
}
