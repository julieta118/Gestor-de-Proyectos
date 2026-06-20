import { CreateProyectoDTO } from './create.proyecto.dto';
import { EstadosProyectosEnum } from '../estados.proyectos.enum';

export interface UpdateProyectoDto extends Pick<CreateProyectoDTO, 'nombre' | 'idCliente'> {
  estado: EstadosProyectosEnum;
}
