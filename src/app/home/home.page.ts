import { Component } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { Router } from '@angular/router'
import { LoadingController } from '@ionic/angular';
import { Vibration } from '@ionic-native/vibration/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Keyboard } from '@ionic-native/keyboard/ngx';

import * as $ from 'jquery';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  mail: string = "";
  password: string = "";
  private loading;
  showUser  = false;

  usuarios: Observable<any[]>;
  lista:any[]

  constructor(private keyboard: Keyboard, private vibration: Vibration, private statusBar: StatusBar, db: AngularFirestore,public router: Router, private loadingCtrl: LoadingController) {

    this.usuarios = db.collection('usuarios').valueChanges();
    this.usuarios.subscribe(usuarios => this.lista = usuarios, error => console.log(error));
  }

  ngOnInit() {
    this.statusBar.overlaysWebView(true);
    this.statusBar.isVisible = true;
    this.Spinner();
    this.clean();
  }

  Login() {
    this.mail = $("#correo").val();
    this.password = $("#pass").val();
    if(this.ValidarEmail(this.mail)){
      if(this.ValidarPass(this.password)){
        let flag = false;
        for (let usuario of this.lista){
          if(usuario.correo == this.mail && usuario.clave == this.password){
            
            flag=true;
            this.Spinner();
            setTimeout(()=>{
              localStorage.setItem("usuario",usuario.perfil);
              this.router.navigate(['main']);
            }, 2000);
            break;
          }
        }
        
        if (!flag) {
          $(".container-error").fadeIn();
          $(".error-mensaje").addClass("error-password");
          $(".backdrop").removeAttr("hidden", "false");
          this.vibration.vibrate(1000);
  
          setTimeout(function(){
            $(".container-error").fadeOut();
            $(".error-mensaje").removeClass("error-password");
            $(".backdrop").attr("hidden", "true");
        },2000);
        }
      }
      else{
        $(".container-error").fadeIn();
        $(".error-mensaje").addClass("error-password");
        $(".backdrop").removeAttr("hidden", "false");
        this.vibration.vibrate(1000);

        setTimeout(function(){
          $(".container-error").fadeOut();
          $(".error-mensaje").removeClass("error-password");
          $(".backdrop").attr("hidden", "true");
      },2000);
      }
    }
    else{
      $(".container-error").fadeIn();
        $(".error-mensaje").addClass("error-mail");
        $(".backdrop").removeAttr("hidden", "false");
        this.vibration.vibrate(1000);

        setTimeout(function(){
          $(".container-error").fadeOut();
          $(".error-mensaje").removeClass("error-mail");
          $(".backdrop").attr("hidden", "true");
      },2000);
      
    }
    this.keyboard.hide();
    this.clean();
  }

  clean()
  {
    this.mail=  "";
    this.password = "";
  }

  completar(){
    let correo = $('#select option:selected').val();
    for (let usuario of this.lista) {
      if(usuario.correo == correo){
        $("#correo").val(usuario.correo);
        $("#pass").val(usuario.clave);
        break;
      }
    }
  }

// #region validaciones

ValidarEmail(mail:string) : boolean
{
  let regex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}.){1,125}[A-Z]{2,63}$/i;

  let retorno : boolean = false;

  if(regex.test(mail))
  {
      retorno = true;
  }

  return retorno;
}

ValidarPass(password: string) : boolean
{
  let retorno : boolean = false;

  if(password.length >= 4)
  {
    retorno = true;
  }

  return retorno;
}

//#endregion

 //showUser = false;

  users()
  {
    this.showUser = !this.showUser;
    //$(".lista-usuarios").fadeIn();
  }

  noUsers()
  {
    $(".lista-usuarios").fadeOut();
  }

  Spinner() {
    $(".backdrop").addClass("loading");
    $(".container").addClass("loading");
    $(".spinner").css("display","block");

    setTimeout(function(){
      $(".container").removeClass("loading");
      $(".spinner").css("display", "none");
      $(".backdrop").attr("hidden", "true");
    },2000);
  }


  shadow()
  {
    $(".form").addClass("shadow");
  }

  noShadow()
  {
    $(".form").removeClass("shadow");
  }



}
