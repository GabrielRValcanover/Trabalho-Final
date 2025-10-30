import { Component, OnInit } from '@angular/core';
import { Atividades, Status } from '../../../models/atividades.model';
import { AtividadesService } from '../../../services/atividades.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-listar-atividades',
  imports: [CommonModule, FormsModule],
  templateUrl: './listar-atividades.component.html',
  styleUrl: './listar-atividades.component.css'
})
export class ListarAtividadesComponent implements OnInit {

atividades: Atividades[] = []
  statusOptions = Object.values(Status);

  constructor(private atividadesService: AtividadesService, private router: Router) { }

  ngOnInit() {
    this.getAllAtividades();
  }
  getAllAtividades() {
    this.atividadesService.getAllAtividades().then(atividades => {
      this.atividades = atividades;
    });
  }

 editAtividades(id: number) {
     this.router.navigate(['/atividades/editar-atividades', id]);
   }
   deleteAtividade(id: number) {
     Swal.fire({
       title: 'Tem certeza?',
       text: 'Esta ação não pode ser desfeita!',
       icon: 'warning',
       showCancelButton: true,
       confirmButtonText: 'Sim, excluir!',
       cancelButtonText: 'Cancelar'
     }).then((result) => {
       if (result.isConfirmed) {
         this.atividadesService.deleteAtividade(id).then(() => {
           this.getAllAtividades();
         });
         Swal.fire('Excluído!', 'A Atividade foi excluída com sucesso.', 'success');
       }
     });
   }
  //   atualizarStatus(atividade: Atividades) {
  //   const hoje = new Date();
  //   const dataFim = new Date(atividade.dataFim);

  //   if (dataFim < hoje && atividade.status !== Status.concluida) {
  //     atividade.status = Status.pendente;
  //     this.atividadesService.updateAtividade(atividade);
  //   }
  // }

  atualizarStatus(atividade: Atividades) {
  const hoje = new Date();
  const dataFim = new Date(atividade.dataFim);
  if (dataFim < hoje && atividade.status !== Status.concluida) {
    atividade.status = Status.pendente;
  }
  this.atividadesService.updateAtividade(atividade).then(() => {
    this.getAllAtividades();
  }).catch(err => {
    console.error('Erro ao atualizar status:', err);
  });
}

  trackById(index: number, item: any): number {
  return item.id;
}

}
