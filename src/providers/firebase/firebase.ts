import { Injectable } from '@angular/core';
import { AngularFireDatabase, snapshotChanges } from "angularfire2/database";
import { FirebaseApp } from 'angularfire2';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { ToastController } from 'ionic-angular';


@Injectable()
export class FirebaseProvider {
  public PATH = 'aluno/';
  public PATH2 = 'grupo/';
  public PATH3 = 'atividade/';
  public PATH4 = 'certificado/';
  public PATH5 = 'professor/';

  raAluno:string;

  constructor(public db:AngularFireDatabase, public firebaseApp: FirebaseApp,
    public afStorage:AngularFireStorage, public msgToast:ToastController) {}

  get(key: string){
    return this.db.object(this.PATH + key)
    .snapshotChanges()
    .map(c => {
      return { key: c.key, ...c.payload.val() };
    })
  }

  // busca certificado pelo ra do aluno
  getCertificadoAluno(ra) {
    return this.db.list(this.PATH4, ref => ref.orderByChild('ra').equalTo(ra))
        .snapshotChanges()
        .map(changes => {
          return changes.map(c => ({key: c.payload.key, ...c.payload.val() }));
    })
  }

  getLogin(userEmail,tipo){
    if(tipo=="aluno"){
      return this.db.list(this.PATH, ref => ref.orderByChild('email').equalTo(userEmail))
      .snapshotChanges()
      .map(changes =>{
          return changes.map(c =>({key: c.payload.key, ...c.payload.val()}));
      })
    }else{
      if(tipo=="professor"){
      return this.db.list(this.PATH5, ref => ref.orderByChild('email').equalTo(userEmail))
      .snapshotChanges()
      .map(changes =>{
          return changes.map(c =>({key: c.payload.key, ...c.payload.val()}));
      })
     }else{
      //Mensagem de erro
      const toast = this.msgToast.create({
        message: 'Usuário ou Senha Incorreto!!!'
      })
     }
    }
  }

  //Busca Aluno Pelo Curso
  getAlunoCurso(curso) {
    return this.db.list(this.PATH, ref => ref.orderByChild('curso').equalTo(curso))
      .snapshotChanges()
      .map(changes => {
        return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
      })
  }

  //Busca Grupo Especifico No Banco
  getGrupo(grupo){
    return this.db.list(this.PATH2, ref => ref.orderByChild('nome').equalTo(grupo))
    .snapshotChanges()
    .map(changes =>{
        return changes.map(c =>({key: c.payload.key, ...c.payload.val()}));
    })
  }

  //Busca Grupo Especifico No Banco
  getAtividade(atividade){
    return this.db.list(this.PATH3, ref => ref.orderByChild('tipoGrupo').equalTo(atividade))
    .snapshotChanges()
    .map(changes =>{
        return changes.map(c =>({key: c.payload.key, ...c.payload.val()}));
    })
  }

  getFiles(){
    //Busca no Banco
    let ref = this.db.list(this.PATH4);
    //Retorna Url de referência
    return ref.snapshotChanges()
    .map(changes => {
      return changes.map(c=>({key: c.payload.key, ...c.payload.val() }));
    });
  }

  //Salva ra
  setRA(ra:string){
    this.raAluno = ra;
  }
  //Busca ra
  getRA(){
    return this.raAluno;
  }


  uploadFile(information):AngularFireUploadTask{
    let newName=`${new Date().getTime()}.pdf`;
    return this.afStorage.ref(`certificado/${newName}`).putString(information);
  }

  storeToDatabase(metainfo){
    let toSave = {
      created: metainfo.timeCreated,
      url: metainfo.dowloadURLs[0],
      fullPath:metainfo.fullPath,
      contentType:metainfo.contentType
    }
    return this.db.list('certificado/').push(toSave);
  }

    // TESTE DE INSERCAO E ATUALIZACAO DE CERTIFICADO
    saveCert(certificado: any) {
      return new Promise((resolve, reject) => {
        if (certificado.key) {
          // atualizando pela lista
          this.db.list(this.PATH4)
            .update(certificado.key, { categoria: certificado.categoria, atividade:certificado.atividade,   status:certificado.status,horasValidadas:certificado.horasValidadas,ra: certificado.ra, url: certificado.url })
            .then(() => resolve())
            .catch((e) => reject(e));
        } else {
          this.db.list(this.PATH4)
            .push({ categoria: certificado.categoria, atividade:certificado.atividade,   status:certificado.status,horasValidadas:certificado.horasValidadas,ra: certificado.ra, url: certificado.url})
            .then(() => resolve());
        }
      })
    }

  // Retorna certificado a ser avaliado
  getCertificadoKey(key: string) {
    return this.db.list(this.PATH4, ref => ref.orderByKey().equalTo(key))
      .snapshotChanges()
      .map(changes => {
        return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
      })
  }

  //Valida certificado
  validaCert(horas:number, key:string) {
    return new Promise((resolve, reject) => {
      // atualizando pelo objeto
      this.db.object(this.PATH4 + key)
        .update({ horasValidadas: horas, status: 'validado' })
        .then(() => resolve())
        .catch((e) => reject(e));
    })
  }
  // soma horas do certificado
  /*somaCertificaAluno(ra:string,horas:number){


}*/

  recusaCert(key:string){
    return new Promise((resolve, reject) => {
      // atualizando pelo objeto
      this.db.object(this.PATH4 + key)
        .update({status: 'recusado' })
        .then(() => resolve())
        .catch((e) => reject(e));
    })
  }
}
