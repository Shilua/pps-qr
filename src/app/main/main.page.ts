import {
  Component,
  OnInit
} from '@angular/core';
import {
  MenuController
} from '@ionic/angular';
import {
  Router
} from "@angular/router";
import {
  Observable
} from 'rxjs';
import {
  QRScanner,
  QRScannerStatus
} from '@ionic-native/qr-scanner/ngx/index';
import {
  AngularFirestore
} from 'angularfire2/firestore';
import {
  Platform
} from '@ionic/angular';

import * as $ from 'jquery';


@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  qrScan: any;
  qrDestroy: any;
  codigos: Observable < any[] > ;
  lista: any[];

  contador10: number = 0;
  contador50: number = 0;
  contador100: number = 0;

  saldo: number = 0;


  constructor(private menu: MenuController, public qr: QRScanner, public platform: Platform, db: AngularFirestore, public router: Router) {

    this.codigos = db.collection('codigosQr').valueChanges();
    this.codigos.subscribe(codigos => this.lista = codigos, error => console.log(error));

    this.platform.backButton.subscribeWithPriority(10, () => {
      document.getElementsByTagName("body")[0].style.opacity = "1";
      this.qrScan.unsubscribe();
    })
  }

  ngOnInit() {

  }

  startScanning() {
    this.qr.prepare().then((status: QRScannerStatus) => {
        if (status.authorized) {
          this.qr.show();
          document.getElementsByTagName("body")[0].style.opacity = "0";
          this.qrScan = this.qr.scan().subscribe((textFound) => {
            document.getElementsByTagName("body")[0].style.opacity = "1";
            this.qrScan.unsubscribe();
            for (let codigo of this.lista) {
              if (textFound == codigo.codigo) {
                switch (codigo.valor) {
                  case 10:
                    if (this.contador10 < 1) {
                      this.contador10++;
                      this.saldo = this.saldo + 10;
                    } else {
                      if (localStorage.getItem("usuario") == "admin") {
                        if (this.contador10 < 2) {
                          this.contador10++;
                          this.saldo += 10;
                        } else {
                          $(".container-error").fadeIn();
                          $(".error-mensaje").addClass("error-admin");
                          $(".backdrop").removeAttr("hidden", "false");
                          

                          setTimeout(function(){
                            $(".container-error").fadeOut();
                            $(".error-mensaje").removeClass("error-admin");
                            $(".backdrop").attr("hidden", "true");
                        },2000);
                        }
                      } else {
                        $(".container-error").fadeIn();
                          $(".error-mensaje").addClass("error-user");
                          $(".backdrop").removeAttr("hidden", "false");
                          

                          setTimeout(function(){
                            $(".container-error").fadeOut();
                            $(".error-mensaje").removeClass("error-user");
                            $(".backdrop").attr("hidden", "true");
                        },2000);
                      }
                    }
                    break;

                  case 50:
                    if (this.contador50 < 1) {
                      this.contador50++;
                      this.saldo += 50;
                    } else {
                      if (localStorage.getItem("usuario") == "admin") {
                        if (this.contador50 < 2) {
                          this.contador50++;
                          this.saldo += 50;
                        } else {
                          $(".container-error").fadeIn();
                          $(".error-mensaje").addClass("error-admin");
                          $(".backdrop").removeAttr("hidden", "false");
                          

                          setTimeout(function(){
                            $(".container-error").fadeOut();
                            $(".error-mensaje").removeClass("error-admin");
                            $(".backdrop").attr("hidden", "true");
                        },2000);
                        }
                      } else {
                        $(".container-error").fadeIn();
                          $(".error-mensaje").addClass("error-user");
                          $(".backdrop").removeAttr("hidden", "false");
                          

                          setTimeout(function(){
                            $(".container-error").fadeOut();
                            $(".error-mensaje").removeClass("error-user");
                            $(".backdrop").attr("hidden", "true");
                        },2000);
                      }
                    }
                    break;

                  case 100:
                    if (this.contador100 < 1) {
                      this.contador100++;
                      this.saldo += 100;
                    } else {
                      if (localStorage.getItem("usuario") == "admin") {
                        if (this.contador100 < 2) {
                          this.contador100++;
                          this.saldo += 100;
                        } else {
                          $(".container-error").fadeIn();
                          $(".error-mensaje").addClass("error-admin");
                          $(".backdrop").removeAttr("hidden", "false");
                          

                          setTimeout(function(){
                            $(".container-error").fadeOut();
                            $(".error-mensaje").removeClass("error-admin");
                            $(".backdrop").attr("hidden", "true");
                        },2000);
                        }
                      } else {
                        $(".container-error").fadeIn();
                          $(".error-mensaje").addClass("error-user");
                          $(".backdrop").removeAttr("hidden", "false");
                          

                          setTimeout(function(){
                            $(".container-error").fadeOut();
                            $(".error-mensaje").removeClass("error-user");
                            $(".backdrop").attr("hidden", "true");
                        },2000);
                      }
                    }
                    break;

                  default:
                    $(".container-error").fadeIn();
                          $(".error-mensaje").addClass("error-codigo");
                          $(".backdrop").removeAttr("hidden", "false");
                          

                          setTimeout(function(){
                            $(".container-error").fadeOut();
                            $(".error-mensaje").removeClass("error-codigo");
                            $(".backdrop").attr("hidden", "true");
                        },2000);
                    break;
                }
              }
            }this.mostrarSaldo();
            
          }, (err) => {
            alert(err);
          })
        }
      })  
  }

  limpiar()
  {
    this.saldo=0;
    this.contador10=0;
    this.contador50=0;
    this.contador100=0;
    this.mostrarSaldo();

  }

  Back() {
    this.qrDestroy = this.qr.destroy();
    this.limpiar();
    this.router.navigate(['/home']);
  }

  mostrarSaldo()
  {
    $(".visor-saldo").text(this.saldo);
  }

}