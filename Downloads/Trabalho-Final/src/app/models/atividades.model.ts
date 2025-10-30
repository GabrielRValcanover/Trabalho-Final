export interface Atividades {
    id?: number;
    nome: string;
    descricao: string;
    dataInicio: Date;
    dataFim: Date;
    categoria: Categoria;
    status: Status;


}

export enum Categoria {
    semAtividade= 'SemAtividade',
    estudo = "Estudo",
    trabalho = "Trabalho",
    lazer = "Lazer",
    pesquisa = "Pesquisa",
}

export enum Status {
  pendente = 'Pendente',
  emAndamento = 'Em andamento',
  concluida = 'Concluída',
  cancelada = 'Cancelada',
}