import { Component, OnInit } from '@angular/core';
import { Usuarios } from '../../../models/usuarios.model';
import { UsuariosService } from '../../../services/usuarios.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listar-usuarios',
  imports: [],
  templateUrl: './listar-usuarios.component.html',
  styleUrl: './listar-usuarios.component.css'
})
export class ListarUsuariosComponent implements OnInit {
  usuarios: Usuarios[] = []

  constructor(private usuarioService: UsuariosService, private router: Router) { }

  ngOnInit() {
    this.getAllUsuarios();
  }
  getAllUsuarios() {
    this.usuarioService.getAllUsuarios().then(usuarios => {
      this.usuarios = usuarios;
    });
  }
  editUsuarios(id: number) {
    this.router.navigate(['/usuarios/editar-usuarios', id]);
  }
  deleteUsuarios(id: number) {
    Swal.fire({
      title: 'Tem certeza?',
      text: 'Esta ação não pode ser desfeita!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.deleteUsuarios(id).then(() => {
          this.getAllUsuarios();
        });
        Swal.fire('Excluído!', 'O Usuario foi excluído com sucesso.', 'success');
      }
    });
  }


}
