import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EstadosClientesEnum } from '../enums/estados-clientes.enum';
import { Proyecto } from './proyecto.entity';

@Entity({ name: 'clientes' }) // nombre de la tabla de la bbdd
export class Cliente {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nombre!: string;

  @Column({ name: 'estado', type: 'enum', enum: EstadosClientesEnum })
  estado!: EstadosClientesEnum;

  @OneToMany(() => Proyecto, (proyecto) => proyecto.cliente) // un cliente puede tener muchos proyectos, funciones flechas, la segunda con parametro poryecto
  proyecto!: Proyecto[];
}
