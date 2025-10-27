import { Component, OnInit } from '@angular/core';
import { Atividades } from '../../../models/atividades.model';
import { AtividadesService } from '../../../services/atividades.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listar-atividades',
  imports: [CommonModule],
  templateUrl: './listar-atividades.component.html',
  styleUrl: './listar-atividades.component.css'
})
export class ListarAtividadesComponent implements OnInit {

atividades: Atividades[] = []

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
}
