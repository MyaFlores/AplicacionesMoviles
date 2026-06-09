import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonItem, 
  IonInput, 
  IonButton, 
  IonIcon 
} from '@ionic/angular/standalone';
import { addOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonItem, 
    IonInput, 
    IonButton,
    IonIcon,
    FormsModule
  ]
})
export class HomePage {
  task: string = "";

  constructor() {
    addIcons({ addOutline });
  }

  addTask() {
    console.log("Tarea a agregar:", this.task);
    // Por ahora solo imprime en consola
    // Después agregaremos la lógica para guardar la tarea
  }
}