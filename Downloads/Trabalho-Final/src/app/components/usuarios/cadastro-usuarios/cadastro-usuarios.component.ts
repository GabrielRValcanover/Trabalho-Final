import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Usuarios } from '../../../models/usuarios.model';
import { UsuariosService } from '../../../services/usuarios.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, } from '@angular/router';
import { Atividades } from '../../../models/atividades.model';

@Component({
  selector: 'app-cadastro-usuarios',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './cadastro-usuarios.component.html',
  styleUrl: './cadastro-usuarios.component.css'
})



export class CadastroUsuariosComponent implements OnInit {
  constructor(private usuariosService: UsuariosService, private router: Router, private route: ActivatedRoute) { }


  usuarioID!: number;
  usuarios: Usuarios[] = [];
  
  formUsuario = new FormGroup({
    nome: new FormControl(''),
    email: new FormControl(''),
  });

  addUsuarios() {
    if (this.formUsuario.valid) {
      if (this.usuarioID) {
        this.editUsuarios();
      } else {
        const novoUsuario: Usuarios = {
          nome: this.formUsuario.value.nome!,
          email: this.formUsuario.value.email!,
        };
        this.usuariosService.addUsuarios(novoUsuario).then(() => {
          Swal.fire({
            icon: 'success',
            title: 'Cadastro realizado!',
            text: 'O Usuario foi cadastrado com sucesso.',
            timer: 5000,
            showConfirmButton: true,
            draggable: true
          });
          this.formUsuario.reset();
        });
      }
    }
  }

  async ngOnInit() {
    this.usuarioID = Number(this.route.snapshot.paramMap.get('id'));
    if (this.usuarioID) {
      const usuarios = await
        this.usuariosService.getUsuariosById(this.usuarioID);
      if (usuarios) {
        this.formUsuario = new FormGroup({
          nome: new FormControl(usuarios.nome),
          email: new FormControl(usuarios.email),
        });
      };
    }
  }

  editUsuarios() {
    const usuarioEditado: Usuarios = {
      id: this.usuarioID,
      nome: this.formUsuario.value.nome!,
      email: this.formUsuario.value.email!
    };
    this.usuariosService.updateUsuarios(usuarioEditado).then(() => {
      Swal.fire('Atualizado!', 'O Usuario foi atualizado com sucesso.',
        'success');
      this.router.navigate(['usuarios/listar-usuarios']);
    });
  }



}







