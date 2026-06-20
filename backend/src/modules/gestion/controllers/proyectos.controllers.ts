import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { CreateProyectoDto } from '../dtos/input/create-proyecto.dto';
import { UpdateProyectoDto } from '../dtos/input/update-proyecto.dto';
import { ListProyectoDto } from '../dtos/output/list-proyecto.dto';
import { ProyectoDto } from '../dtos/output/proyecto.dto';
import { ProyectosService } from '../services/proyecto.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../auth/guards/auth.guards';

@Controller('proyectos')
export class ProyectosController {
  constructor(private readonly proyectoService: ProyectosService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard) // Aplica el guard de autenticación a este endpoint, lo que significa que solo los usuarios autenticados podrán acceder a esta ruta para crear un proyecto
  @Post()
  async crearProyecto(@Body() dto: CreateProyectoDto): Promise<{ id: number }> {
    return await this.proyectoService.crearProyecto(dto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Put(':id')
  async actualizarProyecto(
    @Param('id') id: number,
    @Body() dto: UpdateProyectoDto,
  ): Promise<void> {
    await this.proyectoService.actualizarProyecto(id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOkResponse({ type: ListProyectoDto, isArray: true })
  @Get()
  async obtenerProyectos(): Promise<ListProyectoDto[]> {
    return await this.proyectoService.obtenerProyectos();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOkResponse({ type: ProyectoDto })
  @Get(':id')
  async obtenerProyecto(@Param('id') id: number): Promise<ProyectoDto> {
    return await this.proyectoService.obtenerProyecto(id);
  }
}
