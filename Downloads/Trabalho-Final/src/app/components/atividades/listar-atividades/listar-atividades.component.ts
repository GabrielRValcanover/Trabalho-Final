import { Component, OnInit } from '@angular/core';
import { Atividades } from '../../../models/atividades.model';
import { AtividadesService } from '../../../services/atividades.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-listar-atividades',
  imports: [CommonModule],
  templateUrl: './listar-atividades.component.html',
  styleUrl: './listar-atividades.component.css'
})
export class ListarAtividadesComponent implements OnInit {

atividades: Atividades[] = []

  constructor(private atividadesService: AtividadesService) { }

  ngOnInit() {
    this.getAllAtividades();
  }
  getAllAtividades() {
    this.atividadesService.getAllAtividades().then(atividades => {
      this.atividades = atividades;
    });
  }

}
