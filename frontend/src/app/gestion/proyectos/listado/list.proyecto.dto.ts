import { ListClienteDTO } from "../../clientes/listado/list.clientes.dto";


export interface ListProyectoDTO{
    id: number;
    nombre: string;
    estado: string;
    cliente: ListClienteDTO;
}