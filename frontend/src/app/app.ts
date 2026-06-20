import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast'; 
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastModule], //toast es para mostrar mensajes de notificación en la app
  templateUrl: './app.html',
  styleUrl: './app.css',
  providers: [MessageService]
})
export class App {
  protected readonly title = signal('frontend');
}
