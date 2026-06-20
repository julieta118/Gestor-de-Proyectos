import { EstadosClientesEnum } from "../estados.clientes.enum";
import { CreateClienteDTO } from "./create.cliente.dto";

export interface UpdateClienteDto extends Pick<CreateClienteDTO, "nombre"> { // Heredamos el nombre de CreateClienteDTO y agregamos el estado que es obligatorio para la actualización 

    estado: EstadosClientesEnum;

}