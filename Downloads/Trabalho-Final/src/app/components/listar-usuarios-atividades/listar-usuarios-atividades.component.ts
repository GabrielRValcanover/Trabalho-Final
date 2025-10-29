import { Component } from '@angular/core';
import { UsuariosService } from '../../services/usuarios.service';
import { Router, RouterModule } from '@angular/router';
import { Usuarios } from '../../models/usuarios.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-listar-usuarios-atividades',
  imports: [CommonModule, RouterModule],
  templateUrl: './listar-usuarios-atividades.component.html',
  styleUrl: './listar-usuarios-atividades.component.css'
})
export class ListarUsuariosAtividadesComponent {

  usuarios: Usuarios[] = [];

  constructor(private usuarioService: UsuariosService, private router: Router) { }

  async ngOnInit() {
    this.usuarios = await this.usuarioService.getAllUsuarios();
  }
  getAllUsuarios() {
    this.usuarioService.getAllUsuarios().then(usuarios => {
      this.usuarios = usuarios;
    });

  }

  associarAtividades(usuarioId: number) {
    if (usuarioId) {
      this.router.navigate(['/usuarios/', usuarioId, 'atividades']);
    }
  }


  trackById(index: number, usuario: Usuarios): number {
    return usuario.id!;
  }




}
