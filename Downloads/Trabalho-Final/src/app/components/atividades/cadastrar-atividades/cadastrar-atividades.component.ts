import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Atividades, Categoria } from '../../../models/atividades.model';
import { AtividadesService } from '../../../services/atividades.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cadastrar-atividades',
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './cadastrar-atividades.component.html',
  styleUrl: './cadastrar-atividades.component.css'
})
export class CadastrarAtividadesComponent {
  atividadesID!: number;
  atividades: Atividades[] = [];
  categorias = Object.values(Categoria);

  formAtividades = new FormGroup({
    nome: new FormControl(''),
    descricao: new FormControl(''),
    dataInicio: new FormControl(''),
    dataFim: new FormControl(''),
    categoria: new FormControl(''),
  });
  constructor(private atividadesService: AtividadesService) { }
 

  addAtividades() {
      if (this.formAtividades.valid) {
        if (this.atividadesID) {
        } else {
           const novaAtividade: Atividades = {
          nome: this.formAtividades.value.nome!,
          descricao: this.formAtividades.value.descricao!,
          dataInicio: new Date(this.formAtividades.value.dataInicio!),
          dataFim: new Date(this.formAtividades.value.dataFim!), 
          categoria: this.formAtividades.value.categoria as Categoria
          };

          this.atividadesService.addAtividades(novaAtividade).then(() => {
            Swal.fire({
              icon: 'success',
              title: 'Cadastro realizado!',
              text: 'O Usuario foi cadastrado com sucesso.',
              timer: 5000,
              showConfirmButton: true,
              draggable: true
            });
            this.formAtividades.reset();
          });
        }
      }
    }

}
