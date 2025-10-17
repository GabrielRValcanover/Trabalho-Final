import { Injectable } from '@angular/core';
import Dexie, { Table } from 'dexie';
import { Usuarios } from '../models/usuarios.model';

@Injectable({
  providedIn: 'root'
})
export class DbService extends Dexie {
  usuarios!: Table<Usuarios, number>;


  constructor() { 
    super('EscolaDB');
    this.version(1).stores({
      usuarios: '++id, nome, email',
      });
  }
}
export const db = new DbService();

