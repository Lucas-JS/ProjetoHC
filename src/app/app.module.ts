import { GrupoPage } from './../pages/grupo/grupo';
import { AlunoPage } from './../pages/aluno/aluno';
import { ProfessorPage } from './../pages/professor/professor';
import { LoginPage } from './../pages/login/login';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { File } from '@ionic-native/file';
import { FileTransfer} from '@ionic-native/file-transfer';
import { DocumentViewer } from '@ionic-native/document-viewer';


//Importação e Vinculação do Firebase No Projeto
import { AngularFireModule, FirebaseAppConfig } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireStorageModule } from 'angularfire2/storage';

import { HttpModule } from '@angular/http';
import { FirebaseProvider } from '../providers/firebase/firebase';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';



@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    AlunoPage,
    ProfessorPage,
    //Grupo de Atividades Declaradas
    GrupoPage,
    ListPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    AngularFireModule.initializeApp({
      apiKey: "AIzaSyAUBeH0cC5FVj_Wt7DpLyS-bkvq6-EQ5Ms",
      authDomain: "projetohc-9700d.firebaseapp.com",
      databaseURL: "https://projetohc-9700d.firebaseio.com",
      projectId: "projetohc-9700d",
      storageBucket: "projetohc-9700d.appspot.com",
      messagingSenderId: "819851179141"
    }),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    AlunoPage,
    ProfessorPage,
    //Grupo de Atividades Declaradas
    GrupoPage,
    ListPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    LoginPage,
    File,FileTransfer,DocumentViewer,InAppBrowser,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    FirebaseProvider
  ]
})
export class AppModule {}
