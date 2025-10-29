import { Injectable } from '@angular/core';
import Dexie, { Table } from 'dexie';
import { Usuarios } from '../models/usuarios.model';
import { Atividades } from '../models/atividades.model';
import { UsuariosAtividades } from '../models/usuarios-atividades.model';

@Injectable({
  providedIn: 'root'
})
export class DbService extends Dexie {
  usuarios!: Table<Usuarios, number>;
   atividades!: Table<Atividades, number>;
   usuariosAtividades!: Table<UsuariosAtividades,[number, number]>;


  constructor() { 
    super('EscolaDB');
    this.version(1).stores({
      usuarios: '++id, nome, email',
      atividades: '++id, nome, descricao, dataInicio, dataFim, categoria',
      usuarioAtividade: '[usuarioID+atividadesID], usuarioID, atividadesID'

      });
  }
}
export const db = new DbService();

