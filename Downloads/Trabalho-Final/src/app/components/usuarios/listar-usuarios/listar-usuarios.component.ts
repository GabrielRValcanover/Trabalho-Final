import { Component, OnInit } from '@angular/core';
import { Usuarios } from '../../../models/usuarios.model';
import { UsuariosService } from '../../../services/usuarios.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { db } from '../../../services/db.service';
import { Atividades } from '../../../models/atividades.model';
import Modal from 'bootstrap/js/dist/modal';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-listar-usuarios',
  imports: [CommonModule],
  templateUrl: './listar-usuarios.component.html',
  styleUrl: './listar-usuarios.component.css'
})
export class ListarUsuariosComponent implements OnInit {
  usuarios: Usuarios[] = [];
  atividadesModal: Atividades[] = [];
    usuarioModalNome: string = '';

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

async listarAtividades(usuarioID: number, usuarioNome: string) {
  try {
    this.usuarioModalNome = usuarioNome;
    const vinculos = await db.usuariosAtividade.where('usuarioID').equals(usuarioID).toArray();
    const atividadesIDs = vinculos.map(vinculadas => vinculadas.atividadesID);
    if (atividadesIDs.length === 0) {
      this.atividadesModal = [];
    } else {
      this.atividadesModal = await db.atividades.where('id').anyOf(atividadesIDs).toArray();
    }
    const modalEl = document.getElementById('atividadesUsuarioModal');
    if (modalEl) {
      const modal = new Modal(modalEl);
      modal.show();
    }
  } catch (error) {
    console.error('Erro ao listar atividades:', error);
    alert('Ocorreu um erro ao buscar as atividades.');
  }
}

  trackById(index: number, usuario: Usuarios): number {
    return usuario.id!;
  }

}