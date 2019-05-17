export class Aluno{

  constructor(
    public ra:string,
    public nome:string,
    public curso:string,
    public email:string,
    public semestre:string,
    public horasCadastradas: Int32Array,
    public horasTotais: Int32Array
    ){}
}
