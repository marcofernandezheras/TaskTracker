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
      days:{
        0: Date,
        1: Date,
        2: Date,
        3: Date,
        4: Date,
      }
      data: Array<{
        ticket: string,
        hours: {
          0?: number,
          1?: number,
          2?: number,
          3?: number,
          4?: number,

          Tip_0?: Array<string>,
          Tip_1?: Array<string>,
          Tip_2?: Array<string>,
          Tip_3?: Array<string>,
          Tip_4?: Array<string>,

          total: number
        }
      }>,
      totals: {
        0?: number,
        1?: number,
        2?: number,
        3?: number,
        4?: number,
        total: number
      }        
    }> = []


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

    toUnixDate(x: Date) : string {
      if(!x) return '';
      return `${x.getUTCFullYear()}-${(x.getUTCMonth()+1).toString().padStart(2, '0')}-${x.getDate().toString().padStart(2, '0')}`;
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
            const friday = new Date(currentDate);
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

      const plaiData = await window.electronAPI.db.informes.tareasPorDesarrolo(start, end);
      const tickets = [...new Set(plaiData.reduce((t: Array<string>,i) => {t.push(i.Ticket); return t;} , []))];
      
      let temp = new Date(start);

      let daysTemp: any = [];
      let totalsTemp: any = [];

      while(this.toUnixDate(temp) <= this.toUnixDate(end))
      {
        let str = this.toUnixDate(temp);
        const dayData = plaiData.filter(d => d.TaskDate === str);
        const total = dayData.reduce((t,i) => t + i.HoursConsumed, 0);

        totalsTemp.push(total);
        
        let day = new Date(temp);
        daysTemp.push(day);

        temp.setDate(temp.getDate() + 1);
      }

      const data: Array<{
        ticket: string,
        hours: {
          0?: number,
          1?: number,
          2?: number,
          3?: number,
          4?: number,
          Tip_0?: Array<string>,
          Tip_1?: Array<string>,
          Tip_2?: Array<string>,
          Tip_3?: Array<string>,
          Tip_4?: Array<string>,
          total: number
        }
      }> = []

      console.info(daysTemp);
      console.info(this.toUnixDate(daysTemp[0]));

      tickets.forEach(t => {

        const ticketData = plaiData.filter(d => d.Ticket === t);
        console.info(ticketData)

        const tempL = ticketData.find(d => d.TaskDate == this.toUnixDate(daysTemp[0]))
        const tempM = ticketData.find(d => d.TaskDate == this.toUnixDate(daysTemp[1]))
        const tempX = ticketData.find(d => d.TaskDate == this.toUnixDate(daysTemp[2]))
        const tempJ = ticketData.find(d => d.TaskDate == this.toUnixDate(daysTemp[3]))
        const tempV = ticketData.find(d => d.TaskDate == this.toUnixDate(daysTemp[4]))

        const hourL = tempL?.HoursConsumed ?? 0;
        const hourM = tempM?.HoursConsumed ?? 0;
        const hourX = tempX?.HoursConsumed ?? 0;
        const hourJ = tempJ?.HoursConsumed ?? 0;
        const hourV = tempV?.HoursConsumed ?? 0;

        const noteL = tempL?.notes ?? '';
        const noteM = tempM?.notes ?? '';
        const noteX = tempX?.notes ?? '';
        const noteJ = tempJ?.notes ?? '';
        const noteV = tempV?.notes ?? '';


        data.push({
          ticket: t,
          hours: {
            0: hourL,
            1: hourM,
            2: hourX,
            3: hourJ,
            4: hourV,

            Tip_0: noteL.split('|'),
            Tip_1: noteM.split('|'),
            Tip_2: noteX.split('|'),
            Tip_3: noteJ.split('|'),
            Tip_4: noteV.split('|'),

            total: hourL + hourM + hourX + hourJ + hourV
          }
        })
      })

      const days:{
        0: Date,
        1: Date,
        2: Date,
        3: Date,
        4: Date,
      } = {
        0:daysTemp[0],
        1:daysTemp[1],
        2:daysTemp[2],
        3:daysTemp[3],
        4:daysTemp[4]
      };

      const totals: {
        0?: number,
        1?: number,
        2?: number,
        3?: number,
        4?: number,
        total: number
      } = {
        0: totalsTemp[0],
        1: totalsTemp[1],
        2: totalsTemp[2],
        3: totalsTemp[3],
        4: totalsTemp[4],
        total: totalsTemp.reduce((t: any,i: any) => t + i, 0)
      }

      this.weekData[$event.index] = {
        data,
        days,
        totals
      };
    }
}
