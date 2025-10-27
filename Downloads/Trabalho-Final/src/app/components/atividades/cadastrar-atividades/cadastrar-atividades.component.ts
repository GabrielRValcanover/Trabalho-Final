import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Atividades, Categoria } from '../../../models/atividades.model';
import { AtividadesService } from '../../../services/atividades.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-cadastrar-atividades',
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './cadastrar-atividades.component.html',
  styleUrl: './cadastrar-atividades.component.css'
})
export class CadastrarAtividadesComponent implements OnInit {
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
  constructor(private atividadesService: AtividadesService, private router: Router, private route: ActivatedRoute) { }
 

  addAtividades() {
      if (this.formAtividades.valid) {
        if (this.atividadesID) {
          this.editAtividades();
        } else {
           const novaAtividade: Atividades = {
          nome: this.formAtividades.value.nome!,
          descricao: this.formAtividades.value.descricao!,
          dataInicio: new Date (this.formAtividades.value.dataInicio!),
          dataFim: new Date (this.formAtividades.value.dataFim!), 
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
  async ngOnInit() {
    this.atividadesID = Number(this.route.snapshot.paramMap.get('id'));
    if (this.atividadesID) {
      const atividades = await
        this.atividadesService.getAtividadesById(this.atividadesID);
      if (atividades) {
        this.formAtividades = new FormGroup({
          nome: new FormControl(atividades.nome),
          descricao: new FormControl(atividades.descricao),
           dataInicio: new FormControl(atividades.dataInicio),
            dataFim: new FormControl(atividades.dataFim),
             categoria: new FormControl(atividades.categoria),
        });
      };
    }
  }

     editAtividades() {
        const atividadeEditada: Atividades = {
          id: this.atividadesID,
          nome: this.formAtividades.value.nome!,
          descricao: this.formAtividades.value.descricao!,
          dataInicio: new Date (this.formAtividades.value.dataInicio!),
          dataFim:  new Date (this.formAtividades.value.dataFim!),
          categoria: this.formAtividades.value.categoria! as Categoria
        };
        this.atividadesService.updateAtividade(atividadeEditada).then(() => {
          Swal.fire('Atualizado!', 'A Atividade foi atualizada com sucesso.',
            'success');
          this.router.navigate(['atividades/listar-atividades']);
        });
      }
    
    

}
