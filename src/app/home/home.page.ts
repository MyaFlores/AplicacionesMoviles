import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton, IonList, IonText, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonAccordion, IonCardSubtitle, IonBadge, IonButtons} from '@ionic/angular/standalone';
import {FormsModule} from '@angular/forms';
import { Task } from '../models/task.model';
import { CommonModule } from '@angular/common';
import {ActionSheetController} from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, 
    IonItem, IonLabel, IonInput, IonButton, IonList, 
    IonText, IonCard, IonCardHeader, IonCardTitle, 
    IonCardContent, FormsModule, CommonModule, 
    IonCardSubtitle, IonBadge, IonButtons
  ],
  
})

export class HomePage {
  newTaskStr: string = "";
  newTaskDesc: string = "";
  newTaskPriority: string = "Media";

  tasks: Task[] = [];

  //Mensajes de validación
  mensajeError: string = "";
  mensajeExito: string = "";

  constructor(private actionSheetCtrl: ActionSheetController) {
    this.CargarLocalStorage();
  }

  async abrirSelectorPrioridad() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Selecciona prioridad',
      buttons: [
        {
          text: 'Baja',
          handler: () => {
            this.newTaskPriority = 'Baja';
          }
        },
        {
          text: 'Media',
          handler: () => {
            this.newTaskPriority = 'Media';
          }
        },
        {
          text: 'Alta',
          handler: () => {
            this.newTaskPriority = 'Alta';
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Selección cancelada');
          }
        }
      ]
    });
    await actionSheet.present();
  }

  tareas(){
  this.tasks = [{
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
  }];

      //Guardar en LocalStorage
      this.Guardar();
  }

  // Método para obtener el color según prioridad
getPrioridadColor(prioridad: string): string {
  switch(prioridad) {
    case 'Alta': return 'danger';
    case 'Media': return 'warning';
    case 'Baja': return 'success';
    default: return 'medium';
  }
}
      //Validacion 1: Titulo no vacio
      private NoVacio(titulo: string): boolean {
        return titulo.trim().length > 0;
      }

      //Validacion 1 y 3: Tareas no duplicadas y sensibilidad a mayusculas y minusculas
      private NoDuplicado(titulo: string): boolean {
        const tituloLimpio = titulo.trim();
        //
        const TareaExiste = this.tasks.some(task => task.titulo.trim() === tituloLimpio);
        return !TareaExiste;
      }

      //Agregar tarea
      addTask() {
        this.mensajeError = "";
        this.mensajeExito = "";

        //Limpiar espacios en blanco
        const tituloLimpio = this.newTaskStr.trim();
        if(!this.NoVacio(tituloLimpio)){
          this.mensajeError = "El título no puede estar vacío";
          this.LimpiarMensaje(3000);
          return;
        }

        //No duplicados
        if(!this.NoDuplicado(tituloLimpio)){
          this.mensajeError = "Ya existe una tarea con ese título";
          this.LimpiarMensaje(3000);
          return;
        }

        //Crear nueva tarea
        const newTask: Task = {
          id: Date.now(),
          titulo: tituloLimpio,
          descripcion: this.newTaskDesc.trim(),
          finalizado: false,
          prioridad: this.newTaskPriority as "Baja" | "Media" | "Alta"
        };
        this.tasks.unshift(newTask); //Agregamos al inicio de la lista
        this.newTaskStr = ""; //Limpiamos el Input
        this.newTaskDesc = ""; //Limpiamos el Input
        this.newTaskPriority = "Media"; //Restablecemos la prioridad
        this.mensajeExito = "Tarea agregada exitosamente";
        this.LimpiarMensaje(3000);

        this.Guardar(); //Guardar tareas actualizadas en LocalStorage
        console.log(this.tasks);
      }

      //Eliminar tareas
      EliminarTarea(id: number) {
        const TareEliminada = this.tasks.filter(task => task.id === id);
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.mensajeExito = "Tarea eliminada exitosamente";
        this.LimpiarMensaje(3000);
        this.Guardar();
      }

      //Marcar la tarea como completada o pendiente
      TareaCompletada(id: number) {
        const tarea = this.tasks.find(task => task.id === id);
        if (tarea) {
          tarea.finalizado = !tarea.finalizado;
          const estado = tarea.finalizado ? "pendiente" : "completada";
          this.mensajeExito = `Tarea marcada como ${estado}`;
          this.LimpiarMensaje(3000);
          this.Guardar();
        }
        
      }

      //Guardar en LocalStorage
      Guardar() {
        localStorage.setItem("tasks", JSON.stringify(this.tasks));
      }
      //Cargar tareas
      private CargarLocalStorage() {
        const TareasGuardadas = localStorage.getItem('tasks');
        if (TareasGuardadas) {
          this.tasks = JSON.parse(TareasGuardadas);
        } else {
          this.tareas();
        }
      }

      //Limpar mensajes
      private LimpiarMensaje(segundos: number) {
        setTimeout(() => {
          this.mensajeError = "";
          this.mensajeExito = "";
        }, segundos);
      }
}
