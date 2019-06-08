import { FirebaseProvider } from './../../providers/firebase/firebase';
import { Component } from '@angular/core';
import {
  IonicPage, NavController, NavParams,
  ToastController
} from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { LoginPage } from '../login/login';

@IonicPage()
@Component({
  selector: 'page-professor',
  templateUrl: 'professor.html',
  providers: [
    FirebaseProvider
  ]
})
export class ProfessorPage {
  public cor:string= "white";
  professor: Observable<any>;
  aluno: Observable<any>;
  selectCurso: any;
  curso: any;
  certificado: any;
  html: any;
  certVal: any;
  horas:number;

  constructor(
    //public menuctrl: MenuController,
    public firebaseService: FirebaseProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    private toast: ToastController
  ) {
    //Captura os dados do login para manipular no FormProfessor
    this.professor = navParams.get('ColProfessor');
  }

   //Verifica opção do curso
   optCurso(optCurso: string): void {
    this.curso = optCurso;
  }

  // busca alunos de acordo com o curso
  buscaAlunoCurso(): void {
    this.aluno = this.firebaseService.getAlunoCurso(this.curso);
    this.certVal = "";
    this.certificado = "";
  }

  // busca a lista de certificados do aluno
  getListaCertificado(ra: string): void {
    this.certificado = this.firebaseService.getCertificadoAluno(ra);
    this.certificado.subscribe(arg => console.log(arg));
    this.certVal = "";
  }

   // busca somente o certificado expecífico
   buscaCertificadoExp(key: string): void {
    console.log(key);
    this.certVal = this.firebaseService.getCertificadoKey(key);

  }

  // valida certificado atribuindo horas, FALTA ATRIBUIR A DATA DE AVALIACAO
  validaCert(horas:number, key:string, ra:string) {

    this.firebaseService.validaCert(horas, key)
      .then(() => {
        this.toast.create({ message: 'Certificado avaliado com sucesso.', duration: 3000 }).present();
      })
      .catch((e) => {
        this.toast.create({ message: 'Erro ao validar certificado.', duration: 3000 }).present();
        console.error(e);
      });
      /*this.firebaseService.somaCertificaAluno(ra,horas);
      console.log(ra);
      console.log(key);*/
  }

  // altera status do certificado p recusado, FALTA ATRIBUIR A DATA DE AVALIACAO
  recusaCert(key: string) {
    console.log(key);

    this.firebaseService.recusaCert(key)
      .then(() => {
        this.toast.create({ message: 'Certificado avaliado com sucesso.', duration: 3000 }).present();
      })
      .catch((e) => {
        this.toast.create({ message: 'Erro ao validar certificado.', duration: 3000 }).present();
        console.error(e);
      });
  }

  logoutProf(): void {
    this.navCtrl.push(LoginPage);
  }
}
