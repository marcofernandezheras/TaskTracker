import { Component, OnInit } from '@angular/core';
import { Activo, MainServiceService } from '../shared/services/main-service.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-activos',
  templateUrl: './activos.component.html',
  styleUrl: './activos.component.scss'
})
export class ActivosComponent implements OnInit{

  activos: Activo[] = [];
  clonedActivos: { [s: number]: Activo } = {};

  newActivo: Activo = { id: -1, name: '' }

  constructor(private service: MainServiceService, private messageService: MessageService){}

  ngOnInit(): void {
    setTimeout(async () => {
      this.activos =  await this.service.listActivos();
    }, 0);
  }

  onRowEditInit(activo: Activo) {
    this.clonedActivos[activo.id] = { ...activo };
  }

  async onRowEditSave(activo: Activo) {
      try {
        if (activo.name.length > 0) {
            await this.service.updateActivo(activo.id, activo.name, activo.notes);
            delete this.clonedActivos[activo.id];          
        } 
      } catch (error) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error as string });
      }
  }

  onRowEditCancel(activo: Activo, index: number) {
      this.activos[index] = this.clonedActivos[activo.id];
      delete this.clonedActivos[activo.id];
  }

  async onRowAddSave(){
    try {
      if(this.newActivo.name.length > 0)
      {
        const n = await this.service.createActivo(this.newActivo.name, this.newActivo.notes);
        this.activos.push(n);
        this.newActivo = { id: -1, name: '' };
      }
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: error as string });
    }
  }
}
