import { Component, OnInit } from '@angular/core';
import { Usuarios } from '../../models/usuarios.model';
import { Atividades } from '../../models/atividades.model';
import { UsuariosAtividadesService } from '../../services/usuarios-atividades.service';
import { UsuariosService } from '../../services/usuarios.service';
import { ActivatedRoute } from '@angular/router';
import { AtividadesService } from '../../services/atividades.service';

@Component({
  selector: 'app-usuarios-atividades',
  imports: [],
  templateUrl: './usuarios-atividades.component.html',
  styleUrl: './usuarios-atividades.component.css'
})
export class UsuariosAtividadesComponent implements OnInit {

  usuarios: Usuarios[] = [];
  atividadesID!: number;
  usuariosID!: number;
  ativiadesDisponiveis: Atividades[] = [];
  atividades: Atividades[];
  constructor(private usuariosAtividadeService: UsuariosAtividadesService, private usuariosService: UsuariosService, private atividadesService: AtividadesService,
    private route: ActivatedRoute) { }
  async ngOnInit() {
    this.usuariosID = Number(this.route.snapshot.paramMap.get('id'));
    if (this.usuariosID) {
      const servico = await this.usuariosService.getAllUsuarios(this.usuariosID);
    }
    this.atividadesService.getAllAtividades().then((atividades) => {
      this.atividades = atividades;
      this.ativiadesDisponiveis = atividades;
    });
    this.loadAllUsuariosAtividaddesAssociacoesIndexedDb();
  }
  async loadAllUsuariosAtividaddesAssociacoesIndexedDb() {
    try {
      const associations: any[] = await
      this.usuariosAtividadeService.getAssociacoesByUsuarioId(this.usuariosID);
      this.ativiadesDisponiveis = new Set(associations.map((assoc) => assoc.atividadesID));
      const usuariosAtividadesPromises = Array.from(this.ativiadesDisponiveis).map(idprod =>
        this.atividadesService.getAtividadesById(this.atividadesID)
      );
      const ativiadesEncontradas = await Promise.all(usuariosAtividadesPromises);
      for (const atividades of ativiadesEncontradas) {
        if (atividades) {
          const indexParaRemover = this.ativiadesDisponiveis.findIndex(p => p.id === atividades.id);
          if (indexParaRemover > -1) {
            const atividadeMovida = this.ativiadesDisponiveis.splice(indexParaRemover, 1)[0];
            this.ativiadesDisponiveis.push(atividadeMovida);
          }
        }
      }
    } catch (error) {
      console.error('Erro ao carregar produtos associados:', error);
    }
  }
}



