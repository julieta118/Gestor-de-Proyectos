import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EstadosProyectosEnum } from '../enums/estados-proyectos.enum';
import { Cliente } from './cliente.entity';
import { Tareas } from './tareas.entity';

@Entity({ name: 'proyectos' })
export class Proyecto {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nombre!: string;

  @Column({ name: 'estado', type: 'enum', enum: EstadosProyectosEnum })
  estado!: EstadosProyectosEnum;

  @Column({ name: 'id_cliente' })
  idCliente!: number | null;

  @ManyToOne(() => Cliente, { nullable: true }) //un cliente puede tener mucho proyectos
  @JoinColumn({ name: 'id_cliente' })
  cliente?: Cliente | null;

  @OneToMany(() => Tareas, (tarea) => tarea.proyecto) // un proyecto, muchas tareas. recuperar a traves del proyecto.tareas, todas las tareas de ese proyecto
  tareas!: Tareas[];
}
