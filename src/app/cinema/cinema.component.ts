import { Component, OnInit } from '@angular/core';
import {CinemaServiceService} from "../service/cinema-service.service";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-cinema',
  templateUrl: './cinema.component.html',
  styleUrls: ['./cinema.component.css']
})
export class CinemaComponent implements OnInit {
  public villes:any;
  public cinema:any
  public salle:any
  public currentVille:any;
  public currentCinema:any;
  public currentProjection: any;
  public listSelectedTickets!: any;

  payTicket!: FormGroup;
  dataform: any;


  constructor(public service:CinemaServiceService,
             private fb:FormBuilder) { }

  ngOnInit(): void {
    this.service.getVille().subscribe(data=>{
      this.villes=data
    },error => {
      console.log(error)
    })
    this.payTicket=this.fb.group({
      nomClient : this.fb.control(null),
      codePaiement : this.fb.control(null)
    })
  }

  ongetCinema(v: any) {
    this.salle=undefined
    this.currentVille=v
  this.service.getCinema(v).subscribe(data=>{
    this.cinema=data
  },error => {
    console.log(error)
  })
  }

  onGetSalle(c:any) {
    this.currentCinema=c
    this.service.getSalle(c).subscribe(data=>{
      this.salle=data
      // @ts-ignore
      this.salle._embedded.salles.forEach(s=>{
        this.service.getProjection(s).subscribe(data=>{
         s.projections=data
        },error => {
          console.log(error)
        })
      })
    },error => {
      console.log(error)
    })
  }

  onGetTicketPlace(p: any) {
    this.currentProjection=p;
    this.service.getPlace(p).subscribe(data=>{
      this.currentProjection.tickets=data
      this.listSelectedTickets=[]
    },error => {
      console.log(error)
    })
  }

  onSelectTicket(t: any) {
   if(!t.selected){
      t.selected=true;
      this.listSelectedTickets.push(t);
    }
    else{
      t.selected=false;
      this.listSelectedTickets.splice(this.listSelectedTickets.indexOf(t),1);
    }
    console.log(this.listSelectedTickets)
  }

  getTicketClass(t: any) {
    let c = "btn ";
    if(t.reserve){
      c+="btn-danger margin"
    }
    else if(t.selected){
      c+="btn-warning margin";
    }else{
       c+="btn-success margin"
     }
    return c;

  }

  onPayTickets() {
    let data=this.payTicket.value;
   console.log(data)
    let ticket: any[]=[];
    // @ts-ignore
    this.listSelectedTickets.forEach(t=>{
     ticket.push(t.id)
   });
    this.payTicket.value.tickets=ticket;
   this.service.payerTicket(this.payTicket.value).subscribe(data=>{
     alert("Ticket Reserve avec succès")
      this.onGetTicketPlace(this.currentProjection)
   },error => {
     console.log(error)
   })



  }
}
