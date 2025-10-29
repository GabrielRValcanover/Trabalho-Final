// import { Component, OnInit } from '@angular/core';
// import { Usuarios } from '../../models/usuarios.model';
// import { Atividades } from '../../models/atividades.model';
// import { UsuariosAtividadesService } from '../../services/usuarios-atividades.service';
// import { UsuariosService } from '../../services/usuarios.service';
// import { ActivatedRoute } from '@angular/router';
// import { AtividadesService } from '../../services/atividades.service';
// import { CommonModule } from '@angular/common';
// import { DragDropModule } from '@angular/cdk/drag-drop';

// @Component({
//   selector: 'app-usuarios-atividades',
//   imports: [ CommonModule, DragDropModule],
//   templateUrl: './usuarios-atividades.component.html',
//   styleUrl: './usuarios-atividades.component.css'
// })
// export class UsuariosAtividadesComponent implements OnInit {

//   usuarios: Usuarios[] = [];
//   atividades: Atividades [] = [];
//   atividadesID!: number;
//   usuariosID!: number;
//   ativiadesDisponiveis: Atividades[] = [];

//   constructor(private usuariosAtividadeService: UsuariosAtividadesService, private usuariosService: UsuariosService, private atividadesService: AtividadesService,
//     private route: ActivatedRoute) { }
//   async ngOnInit() {
//     this.usuariosID = Number(this.route.snapshot.paramMap.get('id'));
//     if (this.usuariosID) {
//       const servico = await this.usuariosService.getAllUsuarios(this.usuariosID);
//     }
//     this.atividadesService.getAllAtividades().then((atividades) => {
//       this.atividades = atividades;
//       this.ativiadesDisponiveis = atividades;
//     });
//     this.loadAllUsuariosAtividaddesAssociacoesIndexedDb();
//   }
//   async loadAllUsuariosAtividaddesAssociacoesIndexedDb() {
//     try {
//       const associations: any[] = await
//       this.usuariosAtividadeService.getAssociacoesByUsuarioId(this.usuariosID);
//       this.ativiadesDisponiveis = new Set(associations.map((assoc) => assoc.atividadesID));
//       const usuariosAtividadesPromises = Array.from(this.ativiadesDisponiveis).map(idprod =>
//         this.atividadesService.getAtividadesById(this.atividadesID)
//       );
//       const ativiadesEncontradas = await Promise.all(usuariosAtividadesPromises);
//       for (const atividades of ativiadesEncontradas) {
//         if (atividades) {
//           const indexParaRemover = this.ativiadesDisponiveis.findIndex(p => p.id === atividades.id);
//           if (indexParaRemover > -1) {
//             const atividadeMovida = this.ativiadesDisponiveis.splice(indexParaRemover, 1)[0];
//             this.ativiadesDisponiveis.push(atividadeMovida);
//           }
//         }
//       }
//     } catch (error) {
//       console.error('Erro ao carregar os usuarios associados:', error);
//     }
//   }
// }

import { Component, OnInit } from '@angular/core';
import { Usuarios } from '../../models/usuarios.model';
import { Atividades } from '../../models/atividades.model';
import { UsuariosAtividadesService } from '../../services/usuarios-atividades.service';
import { UsuariosService } from '../../services/usuarios.service';
import { ActivatedRoute } from '@angular/router';
import { AtividadesService } from '../../services/atividades.service';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-usuarios-atividades',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './usuarios-atividades.component.html',
  styleUrls: ['./usuarios-atividades.component.css']
})
export class UsuariosAtividadesComponent implements OnInit {

  usuarios: Usuarios[] = [];
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
    }
    this.atividadesService.getAllAtividades().then((atividades) => {
      this.atividades = atividades;
      this.atividadesDisponiveis = [...atividades];
    });
    await this.loadAllUsuariosAtividadesAssociacoes();
  }
  async loadAllUsuariosAtividadesAssociacoes() {
    try {
      const associacoes = await this.usuariosAtividadeService.getAssociacoesByUsuarioId(this.usuarioID);
      const atividadesIDs = associacoes.map(a => a.atividadesID);
      const atividadesEncontradas = await Promise.all(
        atividadesIDs.map(id => this.atividadesService.getAtividadesById(id))
      );
      this.atividadesAssociadas = atividadesEncontradas.filter(a => a !== undefined) as Atividades[];
      this.atividadesDisponiveis = this.atividadesDisponiveis.filter(a => !atividadesIDs.includes(a.id ?? 0)
      );
    } catch (error) {
      console.error('Erro ao carregar as atividades associadas:', error);
    }
  }
  dropped(event: CdkDragDrop<Atividades[]>, associar: boolean) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,event.container.data,event.previousIndex,event.currentIndex
      );
      const atividade = event.container.data[event.currentIndex];
      if (atividade?.id !== undefined) {
        if (associar) {
          this.usuariosAtividadeService
            .addMultiplosUsuariosAtividadesAssociacoes([
              { usuarioID: this.usuarioID, atividadesID: atividade.id }
            ])
            .then(() => console.log(`Atividade ${atividade.nome} associada ao usuário ${this.usuarioID}`))
            .catch(error => console.error('Erro ao associar atividade:', error));
        } else {
          
          this.usuariosAtividadeService
            .deleteUsuarioAtividade(this.usuarioID, atividade.id)
            .then(() => console.log(` Associação removida: atividade ${atividade.nome}`))
            .catch(err => console.error('Erro ao remover associação:', err));
        }
      }
    }
  }


}


