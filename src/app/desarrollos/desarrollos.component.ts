import { Component } from '@angular/core';
import { Activo, Desarrollo, MainServiceService } from '../shared/services/main-service.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-desarrollos',
  templateUrl: './desarrollos.component.html',
  styleUrl: './desarrollos.component.scss'
})
export class DesarrollosComponent {
  activos: Activo[] = [];
  indexedActivos: { [s: number]: Activo } = {};

  desarrollos: Desarrollo[] = [];
  clonedDesarrollos: { [s: number]: Desarrollo } = {};

  newDesarrollo : Desarrollo = {
    id: -1,
    idActivo: -1,
    ticket: '',
    title: ''
  }

  constructor(public service: MainServiceService, private messageService: MessageService){}

  ngOnInit(): void {
    setTimeout(async () => {
      this.activos =  await this.service.listActivos();
      this.indexedActivos = this.activos.reduce((ret: any, act) => {ret[act.id] = act; return ret;}, {});
      this.desarrollos = await this.service.listDesarrollos();
    }, 0);
  }

  onRowEditInit(desarrollo: Desarrollo) {
    this.clonedDesarrollos[desarrollo.id] = { ...desarrollo };
  }

  async onRowEditSave(desarrollo: Desarrollo) {
      try {
        if (desarrollo.ticket.length > 0) {
            await this.service.updateDesarrollo(desarrollo.id, desarrollo.idActivo, desarrollo.ticket,  desarrollo.title,  desarrollo.notes);
            delete this.clonedDesarrollos[desarrollo.id];
        } 
      } catch (error) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error as string });
      }
  }

  onRowEditCancel(desarrollo: Desarrollo, index: number) {
      this.desarrollos[index] = this.clonedDesarrollos[desarrollo.id];
      delete this.clonedDesarrollos[desarrollo.id];
  }

  async onRowAddSave(){
    try {
      if(this.newDesarrollo.ticket.length > 0 &&
         this.newDesarrollo.title.length > 0 &&
         this.newDesarrollo.idActivo > 0)
      {
        const n = await this.service.createDesarrollo(this.newDesarrollo.idActivo, this.newDesarrollo.ticket,  this.newDesarrollo.title,  this.newDesarrollo.notes);
        this.desarrollos.push(n);
        this.newDesarrollo = {
          id: -1,
          idActivo: -1,
          ticket: '',
          title: ''
        };
      }
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: error as string });
    }
  }
}
