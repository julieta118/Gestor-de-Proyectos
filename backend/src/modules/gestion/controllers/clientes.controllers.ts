import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { CreateClienteDto } from '../dtos/input/create-cliente.dto';
import { UpdateClienteDto } from '../dtos/input/update-cliente.dto';
import { ListClientesDto } from '../dtos/output/list-clientes.dto';
import { EstadosClientesEnum } from '../enums/estados-clientes.enum';
import { ClientesService } from '../services/cliente.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../auth/guards/auth.guards';

@Controller('clientes')
export class ClientesController {
  constructor(private readonly clienteService: ClientesService) {}

  @ApiBearerAuth() // Indica que este endpoint requiere autenticación con token Bearer en swagger
  @UseGuards(AuthGuard)
  @Post()
  async crearCliente(@Body() dto: CreateClienteDto): Promise<{ id: number }> {
    return await this.clienteService.crearCliente(dto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Put(':id')
  async actualizarCliente(
    @Param('id') id: number,
    @Body() dto: UpdateClienteDto,
  ): Promise<void> {
    return await this.clienteService.actualizarCliente(id, dto);
  }

  @ApiBearerAuth() // Indica que este endpoint requiere autenticación con token Bearer en swagger
  @UseGuards(AuthGuard)
  @ApiOkResponse({ type: ListClientesDto, isArray: true }) // Indica que la respuesta de este endpoint será un arreglo de objetos del tipo ListClientesDto en swagger
  @ApiQuery({
    name: 'estado',
    enum: EstadosClientesEnum,
    required: false,
  }) // Agregamos la anotación ApiQuery para documentar el parámetro de consulta 'estado' en swagger, indicando que es un enum y que no es obligatorio
  @Get()
  async obtenerClientes(
    @Query('estado') estado: EstadosClientesEnum, // @Query('estado') indica que el valor del parámetro 'estado' se obtiene de la consulta de la URL, y se espera que sea un valor del enum EstadosClientesEnum
  ): Promise<ListClientesDto[]> {
    return await this.clienteService.obtenerClientes(estado);
  }
}
