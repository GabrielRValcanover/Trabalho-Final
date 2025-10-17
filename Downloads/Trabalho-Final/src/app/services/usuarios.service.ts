import { Injectable } from '@angular/core';
import { DbService } from './db.service';
import { Usuarios } from '../models/usuarios.model';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(private dbService: DbService) { }
  addUsuarios(usuarios: Usuarios) {
    return this.dbService.usuarios.add(usuarios);
    }
    getAllUsuarios(): Promise<Usuarios[]> {
    return this.dbService.usuarios.toArray();
    }

}
