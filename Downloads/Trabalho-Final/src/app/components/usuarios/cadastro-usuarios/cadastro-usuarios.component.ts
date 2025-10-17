import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Usuarios } from '../../../models/usuarios.model';
import { UsuariosService } from '../../../services/usuarios.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cadastro-usuarios',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './cadastro-usuarios.component.html',
  styleUrl: './cadastro-usuarios.component.css'
})



export class CadastroUsuariosComponent {
  constructor(private usuariosService: UsuariosService) { }


  usuarioID!: number;
  usuarios: Usuarios[] = [];
  formUsuario = new FormGroup({
    nome: new FormControl(''),
    email: new FormControl(''),
  });

  addUsuarios() {
    if (this.formUsuario.valid) {
      if (this.usuarioID) {
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

}
