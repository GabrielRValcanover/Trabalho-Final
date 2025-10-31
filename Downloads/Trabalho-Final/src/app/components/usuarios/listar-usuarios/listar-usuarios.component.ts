import { Component, OnInit } from '@angular/core';
import { Usuarios } from '../../../models/usuarios.model';
import { UsuariosService } from '../../../services/usuarios.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { db } from '../../../services/db.service';

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
  async listarAtividades(usuarioID: number) {
    try {
      // Busca os vínculos do usuário
      const vinculos = await db.usuariosAtividade
        .where('usuarioID')
        .equals(usuarioID)
        .toArray();

      // Pega os IDs das atividades
      const atividadesIDs = vinculos.map(v => v.atividadesID);

      if (atividadesIDs.length === 0) {
        alert('Este usuário não possui atividades vinculadas.');
        return;
      }

      // Busca as atividades correspondentes
      const atividades = await db.atividades
        .where('id')
        .anyOf(atividadesIDs)
        .toArray();

      if (atividades.length > 0) {
        const nomes = atividades.map(a => a.nome).join(', ');
        alert(`Atividades do usuário: ${nomes}`);
      } else {
        alert('Este usuário não possui atividades vinculadas.');
      }

    } catch (error) {
      console.error('Erro ao listar atividades:', error);
      alert('Ocorreu um erro ao buscar as atividades.');
    }
  }

}