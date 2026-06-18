import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private alertController: AlertController) {}

  // ✅ MOSTRAR ALERTA SIMPLE (para éxito, error, información)
  async showAlert(header: string, message: string, buttonText: string = 'Aceptar') {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: [buttonText]
    });
    await alert.present();
  }

  // ✅ ALERTA DE CONFIRMACIÓN (para eliminar tareas)
  async confirmAlert(
    header: string,
    message: string,
    functionOk: () => void,
    cancelText: string = 'Cancelar',
    confirmText: string = 'Eliminar'
  ) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: [
        {
          text: cancelText,
          role: 'cancel',
          handler: () => {
            console.log('Eliminación cancelada');
          }
        },
        {
          text: confirmText,
          role: 'confirm',
          handler: () => {
            functionOk();  // Ejecuta la función pasada como parámetro
          }
        }
      ]
    });
    await alert.present();
  }
}