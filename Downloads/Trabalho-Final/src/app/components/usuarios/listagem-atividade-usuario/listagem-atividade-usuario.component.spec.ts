import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListagemAtividadeUsuarioComponent } from './listagem-atividade-usuario.component';

describe('ListagemAtividadeUsuarioComponent', () => {
  let component: ListagemAtividadeUsuarioComponent;
  let fixture: ComponentFixture<ListagemAtividadeUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListagemAtividadeUsuarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListagemAtividadeUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
