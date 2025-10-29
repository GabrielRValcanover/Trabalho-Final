import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarUsuariosAtividadesComponent } from './listar-usuarios-atividades.component';

describe('ListarUsuariosAtividadesComponent', () => {
  let component: ListarUsuariosAtividadesComponent;
  let fixture: ComponentFixture<ListarUsuariosAtividadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarUsuariosAtividadesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarUsuariosAtividadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
