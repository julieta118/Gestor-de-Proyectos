import { Injectable } from '@nestjs/common';
import { CreateTareaDTo } from '../dtos/input/create-tarea.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tareas } from '../entitites/tareas.entity';
import { EstadosTareasEnum } from '../enums/estados-tareas.enum';
import { UpdateTareaDto } from '../dtos/input/update-tarea.dto';

@Injectable()
export class TareasService {
  constructor(
    @InjectRepository(Tareas)
    private readonly tareasRepository: Repository<Tareas>,
  ) {}
  //los servicios son asincronos. reciben el dto de crear tarea y el id del proyecto al que se le va a asignar la tarea.
  //devuelve el id de la tarea creada.
  async crearTarea(dto: CreateTareaDTo, idProyecto: number): Promise<number> {
    const tarea: Tareas = this.tareasRepository.create(dto);

    tarea.estado = EstadosTareasEnum.PENDIENTE;
    tarea.idProyecto = idProyecto;

    const tareaGuardada = await this.tareasRepository.save(tarea);
    return tareaGuardada.id;
  }

  //recibe el dto de actualizar tarea y el id de la tarea a actualizar. devuelve void.
  //busca la tarea por id, si no la encuentra lanza un error. si la encuentra, actualiza sus propiedades con el dto y la guarda en la base de datos.
  async actualizarTarea(dto: UpdateTareaDto, id: number): Promise<void> {
    const tarea = await this.tareasRepository.findOne({ where: { id } });
    if (!tarea) {
      throw new Error('Tarea no encontrada');
    }

    this.tareasRepository.merge(tarea, dto); //merge es una forma de copiar las propiedades del dto a la tarea encontrada.
    await this.tareasRepository.save(tarea); //guarda la tarea actualizada en la base de datos.
  }
}
