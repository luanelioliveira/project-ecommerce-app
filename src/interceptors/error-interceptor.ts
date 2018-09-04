import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { StorageService } from "../services/auth/storage.service";
import { AlertController } from "ionic-angular";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(public storage: StorageService, public altertController: AlertController){

    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req)
        .catch((error, caught) => {
            console.log("Passou pelo interceptor!");
            let errorObj = error;
            if (errorObj.error) {
                errorObj = errorObj.error;
            }
            if (!errorObj.status){
                errorObj = JSON.parse(errorObj);
            }

            console.log("Erro detectador pelo interceptor!");
            console.log(errorObj);
            
            switch(errorObj.status) {
                case 401 : 
                    this.handle401();
                    break;
                case 403 : 
                    this.handle403();
                    break;
                default :
                    this.handleDefaultError(errorObj);

            }
            return Observable.throw(error);
        }) as any;
    }

    handleDefaultError(errorObj) {
        let alert = this.altertController.create({
            title: "Aconteceu um Problema",
            message: errorObj.message,
            enableBackdropDismiss: false,
            buttons: [
                {
                    text: "Ok"
                }
            ]
        });
        alert.present();
    }

    handle401() {
        let alert = this.altertController.create({
            title: "Falha de Autenticação",
            message: "Email ou senha incorretos",
            enableBackdropDismiss: false,
            buttons: [
                {
                    text: "Ok"
                }
            ]
        });
        alert.present();
    }

    handle403() {
        this.storage.setLocalUser(null);
    }

}

export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true,
};