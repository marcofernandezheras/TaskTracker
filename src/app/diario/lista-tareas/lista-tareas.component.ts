import { Component, Input, OnInit, Signal, WritableSignal, effect, signal } from '@angular/core';
import { Activo, Desarrollo, MainServiceService, Tarea, TipoTarea } from '../../shared/services/main-service.service';
import { ElectronAPI } from '../../../../app/preload';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-lista-tareas',
  templateUrl: './lista-tareas.component.html',
  styleUrl: './lista-tareas.component.scss'
})
export class ListaTareasComponent implements OnInit {

  @Input() showCalendar: boolean = false;
  @Input() initialDay: Date = new Date();

  @Input() activos: Activo[] = [];
  @Input() desarrollos: Desarrollo[] = [];

  tipos: Array<TipoTarea> = [];

  indexedTipos: { [s: number]: string } = {};

  indexedDesarrollos: { [s: number]: {
    Desarrollo: Desarrollo,
    Activo: Activo
  } } = {};

  clonedTareas: { [s: number]: { tarea: Tarea, editTask_start: Date, editTask_end: Date | undefined } } = {};
  tareas: Array<Tarea> = [];
  newTask: Tarea;
  newTask_start?: Date;
  newTask_end?: Date;

  currenDate: WritableSignal<Date>;

  constructor(
    private service: MainServiceService, 
    private messageService: MessageService, 
    private confirmationService: ConfirmationService
  ){
    this.newTask = new Tarea();
    this.currenDate = signal<Date>(new Date());
    effect(async () => {
      this.tareas = await this.service.listTareas(this.currenDate());
      if(this.tareas.length > 0 && this.tareas[this.tareas.length-1].endDate){
        this.newTask_start = this.service.convertDateFromUTC(this.tareas[this.tareas.length-1].endDate!);
      }
    });
  }



  ngOnInit(): void {
    
    setTimeout(async () => {
      this.tipos = await this.service.listTipoTarea();
      this.indexedTipos = this.tipos.reduce((ret: any, act) => {
        ret[act.id] = act.name
        return ret;
      }, {});

      this.indexedDesarrollos = this.desarrollos.reduce((ret: any, act) => {
        ret[act.id] = {
          Desarrollo: act,
          Activo: this.activos.find(a => a.id === act.idActivo)
        };         
        return ret;
      }, {});
  
      this.currenDate.set(this.initialDay);  
    }, 0);
  }

  blurDate($event: any){
    if($event.target.value.length == 2){
      let x = $event.target.value;
      $event.target.value = `${x[0]}${x[1]}:`;
    }
  }

  async saveNew(){    
    try{
      if(this.newTask_start){      
        this.newTask_start.setDate(this.currenDate().getDate());
        let unixTimestamp_start = Math.floor(this.service.convertDateToUTC(this.newTask_start).getTime() / 1000);
        this.newTask.startDate = unixTimestamp_start;
      }
      if(this.newTask_end){      
        this.newTask_end.setDate(this.currenDate().getDate());
        let unixTimestamp_end = Math.floor(this.service.convertDateToUTC(this.newTask_end).getTime() / 1000);
        this.newTask.endDate = unixTimestamp_end;
      }
      await this.service.createTarea(this.newTask);
      this.tareas = await this.service.listTareas(this.currenDate());
      this.newTask = new Tarea();

      this.newTask_start = this.newTask_end;
      this.newTask_end = undefined;
    } catch(e){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: e as string });
    }
  }

  onRowEditInit(tarea: Tarea){
    let editTask_start = this.service.convertDateFromUTC(tarea.startDate);
    
    let editTask_end = undefined;
    if (tarea.endDate) 
    {
      editTask_end = this.service.convertDateFromUTC(tarea.endDate);
    }

    this.clonedTareas[tarea.id] = {
      tarea: { ...tarea },
      editTask_start,
      editTask_end
    };
  }

  async onRowEditSave(tarea: Tarea) {
    try {

      if(this.clonedTareas[tarea.id].editTask_start)
      {
        this.clonedTareas[tarea.id].editTask_start.setDate(this.currenDate().getDate());
        let unixTimestamp_start = Math.floor(this.service.convertDateToUTC(this.clonedTareas[tarea.id].editTask_start).getTime() / 1000);
        tarea.startDate = unixTimestamp_start;
      }

      if(this.clonedTareas[tarea.id] && this.clonedTareas[tarea.id].editTask_end){      
        this.clonedTareas[tarea.id].editTask_end!.setDate(this.currenDate().getDate());
        let unixTimestamp_end = Math.floor(this.service.convertDateToUTC(this.clonedTareas[tarea.id].editTask_end!).getTime() / 1000);
        tarea.endDate = unixTimestamp_end;
      }

      await this.service.updateTarea(tarea);
      
      if(tarea.id === this.tareas[this.tareas.length-1].id && this.clonedTareas[tarea.id].editTask_end){
        this.newTask_start = this.clonedTareas[tarea.id].editTask_end;
      }
      delete this.clonedTareas[tarea.id];
    }
    catch (error) 
    {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: error as string });
    }
  }

  onRowEditCancel(desarrollo: Desarrollo, index: number) {
      this.tareas[index] = this.clonedTareas[desarrollo.id].tarea;
      delete this.clonedTareas[desarrollo.id];
  }

  confirmDelete(event: Event, id:number) {
    this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: 'Eliminar registro de tarea?',
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        acceptIcon:"pi-trash",
        rejectIcon:"none",
        rejectButtonStyleClass:"p-button-text",
        accept: async () => {
            await window.electronAPI.db.tareas.delete(id);
            this.tareas = await this.service.listTareas(this.currenDate());
            this.messageService.add({ severity: 'info', summary: 'Borrado', detail: 'Registro borrado' });

            if(this.tareas.length > 0 && this.tareas[this.tareas.length-1].endDate){
              this.newTask_start = this.service.convertDateFromUTC(this.tareas[this.tareas.length-1].endDate!);
            }
        }
    });
  }
}
