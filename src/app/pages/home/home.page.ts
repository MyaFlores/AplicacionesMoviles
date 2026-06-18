import { Component } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonItem,
  IonInput, IonButton, IonList, IonLabel,
  IonButtons, IonText, IonIcon, IonItemSliding,
  IonItemOptions, IonItemOption, IonReorderGroup,
  IonReorder
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Task } from '../../models/task.model';
import { AlertService } from '../../services/alert.service';
import { addIcons } from 'ionicons';
import { addOutline, trashOutline, checkmarkOutline, reorderTwoOutline } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonItem,
    IonInput, IonButton, IonList, IonLabel,
    IonButtons, IonText, IonIcon, IonItemSliding,
    IonItemOptions, IonItemOption, IonReorderGroup,
    IonReorder,
    FormsModule, CommonModule
  ],
})
export class HomePage {
  newTaskStr: string = "";
  tasks: Task[] = [];
  mensajeError: string = "";
  mensajeExito: string = "";

  constructor(private alertService: AlertService) {
    // Registrar iconos
    addIcons({ addOutline, trashOutline, checkmarkOutline, reorderTwoOutline });
    this.CargarLocalStorage();
  }

  private cargarTareasIniciales() {
    this.tasks = [
      { id: 1, titulo: "Configuración de Ionic", descripcion: "", finalizado: true, prioridad: "Media" },
      { id: 2, titulo: "Crear Task List", descripcion: "", finalizado: true, prioridad: "Media" },
      { id: 3, titulo: "Diseñar Interfaz", descripcion: "", finalizado: false, prioridad: "Media" }
    ];
    this.Guardar();
  }

  private NoVacio(titulo: string): boolean {
    return titulo.trim().length > 0;
  }

  private NoDuplicado(titulo: string): boolean {
    const tituloLimpio = titulo.trim();
    const TareaExiste = this.tasks.some(task => task.titulo.trim() === tituloLimpio);
    return !TareaExiste;
  }

  // Agregar tarea con validaciones + ALERTA DE ÉXITO
  addTask() {
    this.mensajeError = "";
    this.mensajeExito = "";

    const tituloLimpio = this.newTaskStr.trim();

    // Validación: Título no vacío
    if (!this.NoVacio(tituloLimpio)) {
      this.alertService.showAlert('Error',  'El título no puede estar vacío', 'Entendido');
      return;
    }

    // Validación: No duplicados
    if (!this.NoDuplicado(tituloLimpio)) {
      this.alertService.showAlert('Error', `Ya existe una tarea con el título "${tituloLimpio}"`, 'Entendido');
      return;
    }

    // Crear nueva tarea
    const newTask: Task = {
      id: Date.now(),
      titulo: tituloLimpio,
      descripcion: "",
      finalizado: false,
      prioridad: "Media"
    };

    this.tasks.unshift(newTask);
    this.newTaskStr = "";
    this.Guardar();

    // Alerta de éxito
    this.alertService.showAlert('Éxito', `Tarea "${tituloLimpio}" agregada`, 'OK');
  }

  // Marcar como completada
  TareaCompletada(id: number) {
    const tarea = this.tasks.find(task => task.id === id);
    if (tarea) {
      tarea.finalizado = !tarea.finalizado;
      this.Guardar();
      const estado = tarea.finalizado ? 'completada' : 'pendiente';
      this.alertService.showAlert('Estado', `Tarea "${tarea.titulo}" marcada como ${estado}`, 'OK');
    }
  }

  // Eliminar tarea con confirmación
  async deleteTask(id: number) {
    const tarea = this.tasks.find(task => task.id === id);
    if (!tarea) return;

    this.alertService.confirmAlert(
      'Eliminar tarea',
      `¿Estás seguro de eliminar "${tarea.titulo}"?`,
      () => {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.Guardar();
        this.alertService.showAlert('Eliminada', `Tarea "${tarea.titulo}" eliminada`, 'OK');
      },
      'Cancelar',
      'Eliminar'
    );
  }

  //Ordenamiento de tareas
  actualizarPosiciones(event: any) {
    const reorderedTasks = event.detail.complete(this.tasks);
    this.tasks = reorderedTasks;
    this.Guardar();
    console.log('Nuevo orden:', this.tasks);
  }

  Guardar() {
    localStorage.setItem("tasks", JSON.stringify(this.tasks));
  }

  private CargarLocalStorage() {
    const TareasGuardadas = localStorage.getItem("tasks");
    if (TareasGuardadas) {
      this.tasks = JSON.parse(TareasGuardadas);
    } else {
      this.cargarTareasIniciales();
    }
  }

  private LimpiarMensaje(segundos: number) {
    setTimeout(() => {
      this.mensajeError = "";
      this.mensajeExito = "";
    }, segundos);
  }
}