import { Component, OnInit } from '@angular/core';
import { Activo, Desarrollo, MainServiceService, Tarea } from '../shared/services/main-service.service';

@Component({
  selector: 'app-diario',
  templateUrl: './diario.component.html',
  styleUrl: './diario.component.scss'
})
export class DiarioComponent implements OnInit {

  activos: Activo[] = [];
  indexedActivos: { [s: number]: Activo } = {};

  desarrollos: Desarrollo[] = [];
  indexedDesarrollos: { [s: number]: Desarrollo } = {};

  hoy!: Date;
  prevDay!: Date;

  loaded = false;

  activeSection = {
    prev: false,
    today: true,
    todo: false,
  }
  taks: number = 0;

  constructor(public service: MainServiceService){}

  ngOnInit(): void {
    setTimeout(async () => {
      this.activos =  await this.service.listActivos();
      this.indexedActivos = this.activos.reduce((ret: any, act) => {ret[act.id] = act; return ret;}, {});

      this.desarrollos = await this.service.listDesarrollos();
      this.indexedDesarrollos = this.desarrollos.reduce((ret: any, des) => {ret[des.id] = des; return ret;}, {});

      this.hoy = new Date();      

      if(this.hoy.getDay() >= 2){
        this.prevDay = new Date((new Date()).setDate((new Date()).getDate()-1));
      } else {
        let lastFridayDate = new Date();
        lastFridayDate.setDate(lastFridayDate.getDate()-1);
  
        while (lastFridayDate.getDay() != 5) {
          lastFridayDate.setDate(lastFridayDate.getDate()-1);
        }
        this.prevDay = lastFridayDate;
      }

      this.taks = (await this.service.listToDo()).length;
      this.activeSection.todo = this.taks > 0;

      this.loaded=true;
    }, 0);
  }

  

}
