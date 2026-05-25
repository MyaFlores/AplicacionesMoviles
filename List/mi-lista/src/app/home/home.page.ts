import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonButton } 
from '@ionic/angular/standalone';

import {Task} from '../models/task.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonButton],
})
export class HomePage {

//Arreglo de tareas
    tasks: Task[]=[{
       id: 1,
      titulo: 'Configuracion de Ionic',
      descripcion: 'Instalar Node.js, Angular CLI y Ionic CLI',
      finalizado: true,
      prioridad: 'Alta'
   },
   {
     id: 2,
     titulo: 'Crear Task List',
     descripcion: 'Crear el proyecto inicial de Task List',
     finalizado: false,
     prioridad: 'Alta'
   },
   {
      id: 3,
      titulo: 'Diseñar Interfaz',
      descripcion: 'Diseñar la interfaz de usuario para la aplicación',
      finalizado: false,
      prioridad: 'Media'
   }
];

//Arreglo para saludar
  constructor() {
    console.log(this.tasks);
  }
  saludar(){
    console.log("¡Hola, mundo!");
  }
}
