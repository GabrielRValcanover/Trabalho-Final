import { Routes } from '@angular/router';
import { CadastroUsuariosComponent } from './components/usuarios/cadastro-usuarios/cadastro-usuarios.component';
import { ListarUsuariosComponent } from './components/usuarios/listar-usuarios/listar-usuarios.component';
import { CadastrarAtividadesComponent } from './components/atividades/cadastrar-atividades/cadastrar-atividades.component';
import { ListarAtividadesComponent } from './components/atividades/listar-atividades/listar-atividades.component';

export const routes: Routes = [
    // { path: '', component: Homecomponent},
    { path: 'usuarios/cadastro-usuarios', component: CadastroUsuariosComponent },
    { path: 'usuarios/listar-usuarios', component: ListarUsuariosComponent },
    { path: 'atividades/cadastro-atividades', component: CadastrarAtividadesComponent },
    { path: 'atividades/listar-atividades', component: ListarAtividadesComponent },
    { path: 'usuarios/editar-usuarios/:id', component: CadastroUsuariosComponent},
     { path: 'atividades/editar-atividades/:id', component: CadastrarAtividadesComponent },





];
