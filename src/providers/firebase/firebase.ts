import { Injectable } from '@angular/core';
import { AngularFireDatabase, snapshotChanges } from "angularfire2/database";
import { FirebaseApp } from 'angularfire2';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { c } from '@angular/core/src/render3';


@Injectable()
export class FirebaseProvider {
  public PATH = 'aluno/';
  public PATH2 = 'grupo/';
  public PATH3 = 'atividade/';
  public PATH4 = 'certificado/';
  public PATH5 = 'professor/';

  constructor(public db: AngularFireDatabase, public firebaseApp: FirebaseApp, public afStorage: AngularFireStorage) { }

  get(key: string) {
    return this.db.object(this.PATH + key)
      .snapshotChanges()
      .map(c => {
        return { key: c.key, ...c.payload.val() };
      })
  }

  getAll() {
    return this.db.list(this.PATH, ref => ref.orderByChild('nome'))
      .snapshotChanges()
      .map(changes => {
        return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
      })
  }
 getAlunoCurso(curso) {
    return this.db.list(this.PATH, ref => ref.orderByChild('curso').equalTo(curso))
      .snapshotChanges()
      .map(changes => {
        return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
      })
  }



  getLogin(userEmail, tipo) {
    if (tipo == "aluno") {
      return this.db.list(this.PATH, ref => ref.orderByChild('email').equalTo(userEmail))
        .snapshotChanges()
        .map(changes => {
          return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
        })
    } else {
      return this.db.list(this.PATH5, ref => ref.orderByChild('email').equalTo(userEmail))
        .snapshotChanges()
        .map(changes => {
          return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
        })
    }

  }



  //Busca Grupo Especifico No Banco
  getGrupo(grupo) {
    return this.db.list(this.PATH2, ref => ref.orderByChild('nome').equalTo(grupo))
      .snapshotChanges()
      .map(changes => {
        return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
      })
  }

  //Busca Grupo Especifico No Banco
  getAtividade(atividade) {
    return this.db.list(this.PATH3, ref => ref.orderByChild('tipoGrupo').equalTo(atividade))
      .snapshotChanges()
      .map(changes => {
        return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
      })
  }

  getFiles() {
    //Busca no Banco
    let ref = this.db.list(this.PATH4);
    //Retorna Url de referência
    return ref.snapshotChanges()
      .map(changes => {
        return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
      });
  }

  uploadFile(information): AngularFireUploadTask {
    let newName = `${new Date().getTime()}.pdf`;
    return this.afStorage.ref(`certificado/${newName}`).putString(information);
  }

  storeToDatabase(metainfo) {
    let toSave = {
      created: metainfo.timeCreated,
      url: metainfo.dowloadURLs[0],
      fullPath: metainfo.fullPath,
      contentType: metainfo.contentType
    }
    return this.db.list('certificado/').push(toSave);
  }
}
