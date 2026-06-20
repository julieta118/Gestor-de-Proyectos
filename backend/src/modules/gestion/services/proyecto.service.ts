import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateProyectoDto } from '../dtos/input/create-proyecto.dto';
import { UpdateProyectoDto } from '../dtos/input/update-proyecto.dto';
import { ListClientesDto } from '../dtos/output/list-clientes.dto';
import { ListProyectoDto } from '../dtos/output/list-proyecto.dto';
import { ListTareasDto } from '../dtos/output/list-tarea.dto';
import { ProyectoDto } from '../dtos/output/proyecto.dto';
import { Proyecto } from '../entitites/proyecto.entity';
import { EstadosProyectosEnum } from '../enums/estados-proyectos.enum';
import { ClientesService } from './cliente.service';

@Injectable()
export class ProyectosService {
  constructor(
    @InjectRepository(Proyecto)
    private readonly repository: Repository<Proyecto>,
    @Inject(forwardRef(() => ClientesService)) // Inyectamos el servicio de clientes para poder verificar si un proyecto tiene un cliente activo relacionado antes de crearlo o actualizarlo
    private readonly clientesService: ClientesService,
  ) {}

  async crearProyecto(dto: CreateProyectoDto): Promise<{ id: number }> {
    const proyecto: Proyecto = this.repository.create(dto);
    proyecto.estado = EstadosProyectosEnum.ACTIVO; // por defecto, el estado de un proyecto nuevo es ACTIVO

    if (dto.idCliente) {
      const clienteActivo: boolean =
        await this.clientesService.existeClienteActivoPorId(dto.idCliente); // verificamos si el cliente relacionado con el proyecto existe y está activo

      if (!clienteActivo) {
        throw new BadRequestException(
          'Se debe especificar un cliente activo para el proyecto',
        );
      }
    } else {
      proyecto.idCliente = null;
      proyecto.cliente = null;
    }

    await this.repository.save(proyecto); // guardamos el proyecto en la base de datos
    return { id: proyecto.id };
  }

  async actualizarProyecto(id: number, dto: UpdateProyectoDto): Promise<void> {
    const proyecto: Proyecto | null = await this.repository.findOne({
      where: { id },
      relations: ['cliente'],
    });

    if (!proyecto) {
      throw new BadRequestException('Proyecto no encontrado');
    }

    if (dto.idCliente) {
      const clienteActivo: boolean =
        await this.clientesService.existeClienteActivoPorId(dto.idCliente); // verificamos si el cliente relacionado con el proyecto existe y está activo

      if (!clienteActivo) {
        throw new BadRequestException(
          'Se debe especificar un cliente activo para el proyecto',
        );
      }
    }

    this.repository.merge(proyecto, dto);

    await this.repository.save(proyecto);
  }

  async obtenerProyectos(): Promise<ListProyectoDto[]> {
    const proyectos: Proyecto[] = await this.repository.find({
      relations: ['cliente'],
      order: { id: 'ASC' },
    });

    const dtoList: ListProyectoDto[] = [];

    for (const p of proyectos) {
      const dto = new ListProyectoDto();
      dto.id = p.id;
      dto.nombre = p.nombre;
      dto.estado = p.estado;
      if (p.cliente) {
        dto.cliente = new ListClientesDto();
        dto.cliente.id = p.cliente.id;
        dto.cliente.nombre = p.cliente.nombre;
        dto.cliente.estado = p.cliente.estado;
      }
      dtoList.push(dto);
    }

    return dtoList;
  }

  async obtenerProyecto(id: number): Promise<ProyectoDto> {
    const proyecto: Proyecto | null = await this.repository.findOne({
      where: { id },
      relations: ['cliente', 'tareas'],
      order: { tareas: { id: 'ASC' } },
    });

    if (!proyecto) {
      throw new BadRequestException('Proyecto no encontrado');
    }

    const dto = new ProyectoDto(); // creamos un DTO de proyecto para devolverlo con las propiedades del proyecto encontrado en la base de datos
    dto.nombre = proyecto.nombre;
    dto.estado = proyecto.estado;
    if (proyecto.cliente) {
      dto.cliente = proyecto.cliente.nombre; // si el proyecto tiene un cliente relacionado, asignamos el nombre del cliente al DTO de proyecto
    }
    const tareas: ListTareasDto[] = []; // creamos un arreglo de DTOs de tareas para devolverlo con las propiedades de las tareas encontradas en la base de datos
    for (const t of proyecto.tareas) {
      const tareaDto = new ListTareasDto();
      tareaDto.id = t.id;
      tareaDto.descripcion = t.descripcion;
      tareaDto.estado = t.estado;
      tareas.push(tareaDto);
    }

    dto.tareas = tareas; // asignamos el arreglo de DTOs de tareas al DTO de proyecto

    return dto;
  }

  async existeProyectoPorIdCliente(idCliente: number): Promise<boolean> {
    const existe: boolean = await this.repository.exists({
      where: {
        cliente: { id: idCliente },
        estado: In([
          EstadosProyectosEnum.ACTIVO,
          EstadosProyectosEnum.FINALIZADO,
        ]),
      },
    });
    return existe;
  }
}
