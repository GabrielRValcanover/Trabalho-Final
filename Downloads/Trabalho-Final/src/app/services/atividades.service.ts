import { Injectable } from '@angular/core';
import { Atividades } from '../models/atividades.model';
import { DbService } from './db.service';

@Injectable({
  providedIn: 'root'
})
export class AtividadesService {

 constructor(private dbService: DbService) { }
   addAtividades(atividades: Atividades) {
     return this.dbService.atividades.add(atividades);
     }
     getAllAtividades(): Promise<Atividades[]> {
     return this.dbService.atividades.toArray();
     }
}
