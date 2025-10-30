import { Injectable } from '@angular/core';
import { DbService } from './db.service';
import { UsuariosAtividades } from '../models/usuarios-atividades.model';

@Injectable({
  providedIn: 'root'
})
export class UsuariosAtividadesService {

  constructor(private dbService: DbService) { }
  getAllUsiariosAtividades(): Promise<UsuariosAtividades[]> {
    return this.dbService.usuariosAtividade.toArray();
  }
  async getAssociacoesByUsuarioId(UsuarioID: number): Promise<UsuariosAtividades[]> {
    return await this.dbService.usuariosAtividade.where('usuarioID').equals(UsuarioID).toArray();
  }
  async getAssociacoesById(usuarioID: number, atividadesID: number): Promise<UsuariosAtividades[]> {
    return await this.dbService.usuariosAtividade.where({
      usuarioID: usuarioID, atividadesID:
        atividadesID
    }).toArray();
  }
  async deleteUsuarioAtividade(usuarioID: number, atividadesID: number): Promise<void> {
    return await this.dbService.usuariosAtividade.delete([usuarioID, atividadesID]);
  }
  // async addMultiplosUsuariosAtividadesAssociacoes(associations: UsuariosAtividades[]): Promise<[number,
  //   number][]> {
  //   return await this.dbService.usuariosAtividade.bulkPut(associations) as unknown as
  //     Promise<[number, number][]>;
  // }
async addMultiplosUsuariosAtividadesAssociacoes(
  associations: UsuariosAtividades[]
): Promise<number[]> {
  const result = await this.dbService.usuariosAtividade.bulkPut(associations);
  console.log('✅ Gravado no IndexedDB:', result, associations);
  return result;
}



}
