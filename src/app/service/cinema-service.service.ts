import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class CinemaServiceService {
host="http://localhost:8080"

  constructor(private http:HttpClient) { }
  public getVille(){
    return this.http.get("http://localhost:8080/villes")

  }


  getCinema(v: any) {
    return this.http.get(v._links.cinemas.href)
  }

  getSalle(c: any) {
    return this.http.get(c._links.salles.href)
  }

  getProjection(salle:any) {
    let url=salle._links.projections.href.replace("{?projection}","")
    return this.http.get(url+"?projection=p1")
  }

  getPlace(p: any) {
    let url=p._links.tickets.href.replace("{?projection}","")
    return this.http.get(url+"?projection=ticketsProj")
  }

  payerTicket(value: any) {
  console.log(value)
    return this.http.post(this.host+"/payerTicket",value)
  }
}
