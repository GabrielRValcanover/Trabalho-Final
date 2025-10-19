export interface Atividades {
    id?: number;
    nome: string;
    descricao: string;
    dataInicio: Date;
    dataFim: Date;
    categoria: Categoria;


}

export enum Categoria {
    semAtividade= 'SemAtividade',
    estudo = "Estudo",
    trabalho = "Trabalho",
    lazer = "Lazer",
    pesquisa = "Pesquisa",


}