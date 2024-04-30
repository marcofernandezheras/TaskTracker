import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent implements OnInit, OnDestroy {
  links: Array<Link> = [
    {
      name: 'Activos',
      url: '/activos',
      icon: 'pi-box',
      active: false
    },
    {
      name: 'Desarrollos',
      url: '/desarrollos',
      icon: 'pi-briefcase',
      active: false
    },
    {
      name: 'Diario',
      url: '/diario',
      icon: 'pi-calendar-plus',
      active: false
    },
    {
      name: 'Informe',
      url: '/informe',
      icon: 'pi-chart-line',
      active: false
    }
  ]

  constructor(private router: Router){}

  sub?: Subscription;

  ngOnInit(): void {
    this.sub = this.router.events.subscribe((val) => {
      if(val instanceof NavigationEnd){
        this.links.forEach(l => l.active = val.url.indexOf(l.url) === 0);
      }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}

export interface Link {
  name: string;
  url: string;
  icon: string;
  active: boolean; 
}