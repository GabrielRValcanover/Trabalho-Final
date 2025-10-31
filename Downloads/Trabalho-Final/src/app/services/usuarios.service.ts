import { Injectable } from '@angular/core';
import {  DbService } from './db.service';
import { Usuarios } from '../models/usuarios.model';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  getAtividadesByUsuario(idUsuario: number) {
    throw new Error('Method not implemented.');
  }

  constructor(private dbService: DbService) { }
  addUsuarios(usuarios: Usuarios) {
    return this.dbService.usuarios.add(usuarios);
  }
  getAllUsuarios(): Promise<Usuarios[]> {
    return this.dbService.usuarios.toArray();
  }

  getUsuariosById(id: number) {
    return this.dbService.usuarios.get(id);
  }
  updateUsuarios(usuarios: Usuarios) {
    return this.dbService.usuarios.put(usuarios);
  }
  deleteUsuarios(id: number) {
    return this.dbService.usuarios.delete(id);
  }

}
