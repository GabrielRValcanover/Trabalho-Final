import { Routes } from '@angular/router';
import { CadastroUsuariosComponent } from './components/usuarios/cadastro-usuarios/cadastro-usuarios.component';
import { ListarUsuariosComponent } from './components/usuarios/listar-usuarios/listar-usuarios.component';

export const routes: Routes = [
    // { path: '', component: Homecomponent},
    { path: 'usuarios/cadastro-usuarios', component: CadastroUsuariosComponent },
    { path: 'usuarios/listar-usuarios', component: ListarUsuariosComponent },




];
