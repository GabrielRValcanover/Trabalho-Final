import { TestBed } from '@angular/core/testing';

import { UsuariosAtividadesService } from './usuarios-atividades.service';

describe('UsuariosAtividadesService', () => {
  let service: UsuariosAtividadesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsuariosAtividadesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
