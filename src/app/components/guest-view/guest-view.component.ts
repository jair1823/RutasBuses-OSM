import { Component, OnInit } from '@angular/core';
import { Map, tileLayer, latLng, Routing, marker } from 'leaflet';
@Component({
  selector: 'app-guest-view',
  templateUrl: './guest-view.component.html',
  styleUrls: ['./guest-view.component.css']
})
export class GuestViewComponent implements OnInit {

  options;


  constructor() { }

  ngOnInit() {
    this.options = {
      layers: [
        tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 18,
          attribution:
            "<a target='_blank' href='https://www.openstreetmap.org/'>OpenStreetMap</a>|" +
            "<a target='_blank' href='https://www.liedman.net/leaflet-routing-machine/'>Routeing Machine</a>"
        })
      ],
      zoom: 17,
      center: latLng(9.932465, -84.049161)
    }
  }

}
