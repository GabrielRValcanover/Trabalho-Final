import { Injectable } from '@angular/core';
import { DbService } from './db.service';
import { UsuariosAtividades } from '../models/usuarios-atividades.model';

@Injectable({
  providedIn: 'root'
})
export class UsuariosAtividadesService {

  constructor(private dbService: DbService) { }
  getAllUsiariosAtividades(): Promise<UsuariosAtividades[]> {
    return this.dbService.usuariosAtividades.toArray();
  }
  async getAssociacoesByUsuarioId(UsuarioID: number): Promise<UsuariosAtividades[]> {
    return await this.dbService.usuariosAtividades.where('usuarioID').equals(UsuarioID).toArray();
  }
  async getAssociacoesById(usuarioID: number, atividadesID: number): Promise<UsuariosAtividades[]> {
    return await this.dbService.usuariosAtividades.where({
      usuarioID: usuarioID, atividadesID:
        atividadesID
    }).toArray();
  }
  async deleteUsuarioAtividade(usuarioID: number, atividadesID: number): Promise<void> {
    return await this.dbService.usuariosAtividades.delete([usuarioID, atividadesID]);
  }
  async addMultiplosUsuariosAtividadesAssociacoes(associations: UsuariosAtividades[]): Promise<[number,
    number][]> {
    return await this.dbService.usuariosAtividades.bulkPut(associations) as unknown as
      Promise<[number, number][]>;
  }



}
