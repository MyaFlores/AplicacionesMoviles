import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton, IonList } from '@ionic/angular/standalone';
import {FormsModule} from '@angular/forms';
import { Task } from '../models/task.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton, IonList, FormsModule],
})

export class HomePage {
  newTaskStr: string = "";
  tasks: Task[] = [{
  id: 1,
  titulo: "Configuración de Ionic",
  descripcion: "Instalar Node.js, Angular CLI, Ionic CLI y configurar el entorno de desarrollo para comenzar a crear aplicaciones móviles con Ionic",
  finalizado: true,
  prioridad: "Alta"
  },
  {
  id: 2,
  titulo: "Crear Task List",
  descripcion: "Crear el proyecto inicial de Task List",
  finalizado: true,
  prioridad: "Alta"
  },
  {
  id: 3,
  titulo: "Diseñar Interfaz",
  descripcion: "Diseñar la interfaz de usuario para la aplicación de tareas",
  finalizado: false,
  prioridad: "Media"
  }
];

  constructor() {
    console.log(this.tasks);
  }

  addTask() {
    console.log(this.newTaskStr);
    const newTask: Task = {
      id: Date.now(),
      titulo: this.newTaskStr,
      descripcion: "",
      finalizado: false,
      prioridad: "Media"
    };
    this.tasks.push(newTask);
    this.newTaskStr = "";
    console.log(this.tasks);
    }
}

