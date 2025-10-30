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
      // this.usuario = await this.usuariosService.getUsuariosById(this.usuarioID);

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
  // dropped(event: CdkDragDrop<Atividades[]>, associar: boolean) {
  //   if (event.previousContainer === event.container) {
  //     moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  //   } else {
  //     transferArrayItem(
  //       event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex
  //     );
  //     const atividade = event.container.data[event.currentIndex];
  //     if (atividade?.id !== undefined) {
  //       if (associar) {
  //         this.usuariosAtividadeService
  //           .addMultiplosUsuariosAtividadesAssociacoes([
  //             { usuarioID: this.usuarioID, atividadesID: atividade.id }
  //           ])
  //           .then(() => {
  //             console.log(`Atividade ${atividade.nome} associada ao usuário ${this.usuarioID}`);
  //             return this.usuariosAtividadeService.getAssociacoesByUsuarioId(this.usuarioID);
  //           })
  //           .then(associacoes => {
  //             const idsAtividades = associacoes.map(a => a.atividadesID);
  //             this.atividadesAssociadas = this.atividades.filter(a => idsAtividades.includes(a.id!));
  //             this.atividadesDisponiveis = this.atividades.filter(a => !idsAtividades.includes(a.id!));
  //           })
  //           .catch(error => console.error('Erro ao associar atividade:', error));
  //       } else {
  //         this.usuariosAtividadeService
  //           .deleteUsuarioAtividade(this.usuarioID, atividade.id)
  //           .then(() => {
  //             console.log(`Associação removida: atividade ${atividade.nome}`);
  //             return this.usuariosAtividadeService.getAssociacoesByUsuarioId(this.usuarioID);
  //           })
  //           .then(associacoes => {
  //             const idsAtividades = associacoes.map(a => a.atividadesID);
  //             this.atividadesAssociadas = this.atividades.filter(a => idsAtividades.includes(a.id!));
  //             this.atividadesDisponiveis = this.atividades.filter(a => !idsAtividades.includes(a.id!));
  //           })
  //           .catch(err => console.error('Erro ao remover associação:', err));
  //       }
  //     }
  //   }
  // }
  //   dropped(event: CdkDragDrop<Atividades[]>, associar: boolean) {
  //   if (event.previousContainer === event.container) {
  //     moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  //   } else {
  //     transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex
  //     );
  //     const atividade = event.container.data[event.currentIndex];
  //     if (atividade?.id !== undefined) {
  //       if (associar) {
  //         this.usuariosAtividadeService
  //           .addMultiplosUsuariosAtividadesAssociacoes([
  //             { usuarioID: this.usuarioID, atividadesID: atividade.id }
  //           ])
  //           .then(() => {
  //             console.log(`Atividade ${atividade.nome} associada ao usuário ${this.usuarioID}`);
  //             return this.usuariosAtividadeService.getAssociacoesByUsuarioId(this.usuarioID);
  //           })
  //           .then(associacoes => {
  //             const idsAtividades = associacoes.map(a => a.atividadesID);
  //             this.atividadesAssociadas = this.atividades.filter(a => a.id && idsAtividades.includes(a.id));
  //             this.atividadesDisponiveis = this.atividades.filter(a => a.id && !idsAtividades.includes(a.id));
  //           })
  //           .catch(error => console.error('Erro ao associar atividade:', error));
  //       } else {
  //         this.usuariosAtividadeService
  //           .deleteUsuarioAtividade(this.usuarioID, atividade.id)
  //           .then(() => {
  //             console.log(`Associação removida: atividade ${atividade.nome}`);
  //             return this.usuariosAtividadeService.getAssociacoesByUsuarioId(this.usuarioID);
  //           })
  //           .then(associacoes => {
  //             const idsAtividades = associacoes.map(a => a.atividadesID);
  //             this.atividadesAssociadas = this.atividades.filter(a => a.id && idsAtividades.includes(a.id));
  //             this.atividadesDisponiveis = this.atividades.filter(a => a.id && !idsAtividades.includes(a.id));
  //           })
  //           .catch(err => console.error('Erro ao remover associação:', err));
  //       }
  //     }
  //   }
  // }
  // dropped(event: CdkDragDrop<Atividades[]>, associar: boolean) {
  //   if (event.previousContainer === event.container) {
  //     moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  //     return;
  //   }
  //   const atividade = event.previousContainer.data[event.previousIndex];

  //   transferArrayItem( event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex
  //   );
  //   if (!atividade?.id) {
  //     console.warn('Atividade sem ID detectada, ignorando...');
  //     return;
  //   }
  //   if (associar) {
  //     this.usuariosAtividadeService
  //       .addMultiplosUsuariosAtividadesAssociacoes([
  //         { usuarioID: this.usuarioID, atividadesID: atividade.id }
  //       ])
  //       .then(() => {
  //         console.log(`✅ Atividade "${atividade.nome}" associada ao usuário ${this.usuarioID}`);
  //         return this.usuariosAtividadeService.getAssociacoesByUsuarioId(this.usuarioID);
  //       })
  //       .then(associacoes => {
  //         const idsAtividades = associacoes.map(a => a.atividadesID);
  //         this.atividadesAssociadas = this.atividades.filter(a => a.id && idsAtividades.includes(a.id));
  //         this.atividadesDisponiveis = this.atividades.filter(a => a.id && !idsAtividades.includes(a.id));
  //       })
  //       .catch(error => console.error('❌ Erro ao associar atividade:', error));
  //   }
  //   else {
  //     this.usuariosAtividadeService
  //       .deleteUsuarioAtividade(this.usuarioID, atividade.id)
  //       .then(() => {
  //         console.log(`🗑️ Associação removida: atividade "${atividade.nome}"`);
  //         return this.usuariosAtividadeService.getAssociacoesByUsuarioId(this.usuarioID);
  //       })
  //       .then(associacoes => {
  //         const idsAtividades = associacoes.map(a => a.atividadesID);
  //         this.atividadesAssociadas = this.atividades.filter(a => a.id && idsAtividades.includes(a.id));
  //         this.atividadesDisponiveis = this.atividades.filter(a => a.id && !idsAtividades.includes(a.id));
  //       })
  //       .catch(err => console.error('❌ Erro ao remover associação:', err));
  //   }
  // }


dropped(event: CdkDragDrop<Atividades[]>, associar: boolean) {
  if (event.previousContainer === event.container) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    return;
  }
  const atividade = event.previousContainer.data[event.previousIndex];
  transferArrayItem(event.previousContainer.data,event.container.data,event.previousIndex,event.currentIndex
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
          text: `A atividade "${atividade.nome}" foi associada com sucesso ao usuário.`,
          timer: 4000,
          showConfirmButton: true
        });
        console.log(`✅ Atividade "${atividade.nome}" associada ao usuário ${this.usuarioID}`);
        return this.usuariosAtividadeService.getAssociacoesByUsuarioId(this.usuarioID);
      })
      .then(associacoes => {
        const idsAtividades = associacoes.map(a => a.atividadesID);
        this.atividadesAssociadas = this.atividades.filter(a => a.id && idsAtividades.includes(a.id));
        this.atividadesDisponiveis = this.atividades.filter(a => a.id && !idsAtividades.includes(a.id));
      })
      .catch(error => {
        console.error('❌ Erro ao associar atividade:', error);
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

        console.log(`🗑️ Associação removida: atividade "${atividade.nome}"`);
        return this.usuariosAtividadeService.getAssociacoesByUsuarioId(this.usuarioID);
      })
      .then(associacoes => {
        const idsAtividades = associacoes.map(a => a.atividadesID);
        this.atividadesAssociadas = this.atividades.filter(a => a.id && idsAtividades.includes(a.id));
        this.atividadesDisponiveis = this.atividades.filter(a => a.id && !idsAtividades.includes(a.id));
      })
      .catch(err => {
        console.error('❌ Erro ao remover associação:', err);
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


