import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-guest-view',
  templateUrl: './guest-view.component.html',
  styleUrls: ['./guest-view.component.css']
})
export class GuestViewComponent implements OnInit {
  time = { hour: 13, minute: 30 };
  meridian = true;


  constructor() { }

  ngOnInit() {
  }

  toggleMeridian() {
    this.meridian = !this.meridian;
  }
}
