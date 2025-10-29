import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosAtividadesComponent } from './usuarios-atividades.component';

describe('UsuariosAtividadesComponent', () => {
  let component: UsuariosAtividadesComponent;
  let fixture: ComponentFixture<UsuariosAtividadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuariosAtividadesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuariosAtividadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
