import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateClienteDto } from '../dtos/input/create-cliente.dto';
import { UpdateClienteDto } from '../dtos/input/update-cliente.dto';
import { ListClientesDto } from '../dtos/output/list-clientes.dto';
import { Cliente } from '../entitites/cliente.entity';
import { EstadosClientesEnum } from '../enums/estados-clientes.enum';
import { ProyectosService } from './proyecto.service';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente) private readonly repository: Repository<Cliente>,
    @Inject(forwardRef(() => ProyectosService)) // Inyectamos el servicio de proyectos para poder verificar si un cliente tiene proyectos relacionados antes de darlo de baja
    private readonly proyectosService: ProyectosService,
  ) {}

  async crearCliente(dto: CreateClienteDto): Promise<{ id: number }> {
    const cliente: Cliente = this.repository.create(dto);
    cliente.estado = EstadosClientesEnum.ACTIVO;
    await this.repository.save(cliente);
    return { id: cliente.id };
  }

  async actualizarCliente(id: number, dto: UpdateClienteDto): Promise<void> {
    const cliente: Cliente | null = await this.repository.findOneBy({ id });

    if (!cliente) {
      throw new BadRequestException('Cliente no encontrado');
    }

    const relacionadoConProyectos: boolean =
      await this.proyectosService.existeProyectoPorIdCliente(id); // verificamos si el cliente tiene proyectos relacionados

    if (relacionadoConProyectos && dto.estado === EstadosClientesEnum.BAJA) {
      throw new BadRequestException(
        'No se puede dar de baja un cliente con proyectos relacionados',
      ); // si el cliente tiene proyectos relacionados y se intenta dar de baja, lanzamos un error
    }

    this.repository.merge(cliente, dto);
    await this.repository.save(cliente);
  }

  async obtenerClientes(
    estado: EstadosClientesEnum,
  ): Promise<ListClientesDto[]> {
    const whereCondition: FindOptionsWhere<ListClientesDto> = {}; // creamos un objeto vacío para la condición de búsqueda, que luego llenaremos con el estado si se especifica en la consulta

    if (estado) {
      whereCondition.estado = estado; // si se especifica un estado en la consulta, lo agregamos a la condición de búsqueda
    }
    // buscamos los clientes en la base de datos utilizando la condición de búsqueda, que puede incluir o no el estado dependiendo de si se especificó en la consulta
    const clientes: Cliente[] = await this.repository.find({
      where: whereCondition,
    });

    const dtoList: ListClientesDto[] = []; // creamos un array para almacenar los DTOs de clientes

    for (const c of clientes) {
      // iteramos sobre los clientes encontrados en la base de datos y por cada uno creamos un DTO de cliente con sus propiedades y lo agregamos al array de DTOs
      const dto = new ListClientesDto();
      dto.id = c.id;
      dto.nombre = c.nombre;
      dto.estado = c.estado;
      dtoList.push(dto);
    }

    return dtoList;
  }

  async existeClienteActivoPorId(id: number): Promise<boolean> {
    const existe: boolean = await this.repository.exists({
      where: { id, estado: EstadosClientesEnum.ACTIVO },
    });
    return existe;
  }
}
