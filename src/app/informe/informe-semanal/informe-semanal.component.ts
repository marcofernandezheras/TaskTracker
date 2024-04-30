import { Component, WritableSignal, effect, signal } from '@angular/core';
import { MainServiceService, TareaPorDesarrollo } from '../../shared/services/main-service.service';
import { AccordionTabOpenEvent } from 'primeng/accordion';

@Component({
  selector: 'app-informe-semanal',
  templateUrl: './informe-semanal.component.html',
  styleUrl: './informe-semanal.component.scss'
})
export class InformeSemanalComponent {
    month: WritableSignal<Date>;
    weeks: Array<{ start: Date, end: Date}> = [];

    weekData: Array<{
      plaiData: Array<TareaPorDesarrollo>,
      total: number
    }> = []

    cache: { [timestamp: number]: {
                plaiData: Array<TareaPorDesarrollo>,
                total: number
              }
    } = {}

    locale: Intl.LocalesArgument = 'es-ES'
    locale_options: Intl.DateTimeFormatOptions= {
      year: 'numeric',
      month: '2-digit', // Dos dígitos para el mes
      day: '2-digit' // Dos dígitos para el día
    };

    loadingWeeks = true;

    constructor(private service: MainServiceService){
      const d = new Date();
      this.weeks = this.getWeeksInMonth(d.getFullYear(), d.getMonth());
      this.month = signal<Date>(new Date());
      effect(async () => {
        this.loadingWeeks = true;
        this.weeks = this.getWeeksInMonth(this.month().getFullYear(), this.month().getMonth());
        setTimeout(() => {
          this.loadingWeeks = false;
        }, 0);
      });
    }

    getWeeksInMonth(year: number, month: number): Array<{ start: Date, end: Date}> {
      this.weekData = [];
      const weeks = [];
      const firstDate = new Date(year, month, 1);
      const lastDate = new Date(year, month + 1, 1);
  
      let currentDate = firstDate;
      while (currentDate <= lastDate) {
          if (currentDate.getUTCDay() === 0) { // Monday
            const monday = new Date(currentDate);
            const friday = new Date();
            friday.setDate(monday.getDate() + 4);

              weeks.push({
                start: monday,
                end: friday
              });
          }
          currentDate.setDate(currentDate.getDate() + 1);
      }
  
      return weeks;
    }

    async weekOpen($event: AccordionTabOpenEvent){
      const {start, end} = {... this.weeks[$event.index]};

      let timestamp = this.service.convertDateToUnixTime(start);
      if(this.cache[timestamp]){
        this.weekData[$event.index] = this.cache[timestamp];  
      } else {
        const plaiData = await window.electronAPI.db.informes.tareasPorDesarrolo(start, end);
        const total = plaiData.reduce((t,i) => t + i.HoursConsumed, 0);
        const weekItem = {
          plaiData,
          total
        };
        this.weekData[$event.index] = weekItem
        this.cache[timestamp] = weekItem;
      }
    }
}
