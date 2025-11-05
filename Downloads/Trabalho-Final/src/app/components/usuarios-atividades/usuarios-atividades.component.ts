
import { Component, OnInit } from '@angular/core';
import { Usuarios } from '../../models/usuarios.model';
import { Atividades } from '../../models/atividades.model';
import { UsuariosAtividadesService } from '../../services/usuarios-atividades.service';
import { UsuariosService } from '../../services/usuarios.service';
import { ActivatedRoute } from '@angular/router';
import { AtividadesService } from '../../services/atividades.service';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios-atividades',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './usuarios-atividades.component.html',
  styleUrls: ['./usuarios-atividades.component.css']
})
export class UsuariosAtividadesComponent implements OnInit {

  usuarios: Usuarios[] = [];
  usuario?: Usuarios;
  usuarioID!: number;
  atividades: Atividades[] = [];
  atividadesDisponiveis: Atividades[] = [];
  atividadesAssociadas: Atividades[] = [];

  constructor(private usuariosAtividadeService: UsuariosAtividadesService, private usuariosService: UsuariosService, private atividadesService: AtividadesService,
    private route: ActivatedRoute
  ) { }

  async ngOnInit() {
    this.usuarioID = Number(this.route.snapshot.paramMap.get('id'));
    if (this.usuarioID) {
      await this.usuariosService.getUsuariosById(this.usuarioID);
      this.usuario = await this.usuariosService.getUsuariosById(this.usuarioID);

    }
    this.atividadesService.getAllAtividades().then(async (atividades) => {
      this.atividades = atividades;
      this.atividadesDisponiveis = [...atividades];
      await this.loadAllUsuariosAtividadesAssociacoes();
    });

  }
  async loadAllUsuariosAtividadesAssociacoes() {
    try {
      const associacoes = await this.usuariosAtividadeService.getAssociacoesByUsuarioId(this.usuarioID);
      const atividadesIDs = associacoes.map(a => a.atividadesID);
      const atividadesEncontradas = await Promise.all(
        atividadesIDs.map(id => this.atividadesService.getAtividadesById(id))
      );
      this.atividadesAssociadas = this.atividades.filter(a => a.id && atividadesIDs.includes(a.id));
      this.atividadesDisponiveis = this.atividades.filter(a => a.id && !atividadesIDs.includes(a.id));

    } catch (error) {
      console.error('Erro ao carregar as atividades associadas:', error);
    }
  }


  dropped(event: CdkDragDrop<Atividades[]>, associar: boolean) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      return;
    }
    const atividade = event.previousContainer.data[event.previousIndex];
    transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex
    );
    if (!atividade?.id) {
      console.warn('Atividade sem ID detectada, ignorando...');
      return;
    }
    if (associar) {
      this.usuariosAtividadeService
        .addMultiplosUsuariosAtividadesAssociacoes([
          { usuarioID: this.usuarioID, atividadesID: atividade.id }
        ])
        .then(() => {
          Swal.fire({
            icon: 'success',
            title: 'Atividade associada!',
            text: `A atividade "${atividade.nome}" foi associada com sucesso ao usuário `,
            timer: 4000,
            showConfirmButton: true
          });
          console.log(` Atividade "${atividade.nome}" associada ao usuário ${this.usuarioID}`);
          return this.usuariosAtividadeService.getAssociacoesByUsuarioId(this.usuarioID);
        })
        .then(associacoes => {
          const idsAtividades = associacoes.map(a => a.atividadesID);
          this.atividadesAssociadas = this.atividades.filter(atividades => atividades.id && idsAtividades.includes(atividades.id));
          this.atividadesDisponiveis = this.atividades.filter(atividades => atividades.id && !idsAtividades.includes(atividades.id));
        })
        .catch(error => {
          console.error(' Erro ao associar atividade:', error);
          Swal.fire({
            icon: 'error',
            title: 'Erro!',
            text: 'Não foi possível associar a atividade. Tente novamente.',
            showConfirmButton: true
          });
        });
    } else {
      this.usuariosAtividadeService
        .deleteUsuarioAtividade(this.usuarioID, atividade.id)
        .then(() => {
          Swal.fire({
            icon: 'info',
            title: 'Associação removida!',
            text: `A atividade "${atividade.nome}" foi removida do usuário.`,
            timer: 4000,
            showConfirmButton: true
          });

          console.log(`Associação removida: atividade "${atividade.nome}"`);
          return this.usuariosAtividadeService.getAssociacoesByUsuarioId(this.usuarioID);
        })
        .then(associacoes => {
          const idsAtividades = associacoes.map(a => a.atividadesID);
          this.atividadesAssociadas = this.atividades.filter(atividades => atividades.id && idsAtividades.includes(atividades.id));
          this.atividadesDisponiveis = this.atividades.filter(atividades => atividades.id && !idsAtividades.includes(atividades.id));
        })
        .catch(err => {
          console.error(' Erro ao remover associação:', err);
          Swal.fire({
            icon: 'error',
            title: 'Erro!',
            text: 'Não foi possível remover a associação. Tente novamente.',
            showConfirmButton: true
          });
        });
    }
  }


}


