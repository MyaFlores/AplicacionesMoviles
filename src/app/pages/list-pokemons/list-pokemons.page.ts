import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonText, IonIcon } from '@ionic/angular/standalone';
import { PokemonApiService } from '../../services/pokemon-api.service';  // 👈 Nuevo nombre

@Component({
  selector: 'app-list-pokemons',
  templateUrl: './list-pokemons.page.html',
  styleUrls: ['./list-pokemons.page.scss'],
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonList, IonItem, IonLabel, IonText, IonIcon,
    CommonModule,
    RouterLink
  ]
})
export class ListPokemonsPage implements OnInit {
  pokemonList: { name: string; url: string }[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private pokemonService: PokemonApiService) {}  //Nuevo nombre

  ngOnInit() {
    this.loadPokemon();
  }

  loadPokemon() {
    this.isLoading = true;
    this.errorMessage = '';

    this.pokemonService.getPokemonList(1000, 0).subscribe({
      next: (response) => {
        this.pokemonList = response.results;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error:', error);
        this.errorMessage = 'Error al cargar los Pokémon.';
        this.isLoading = false;
      }
    });
  }
}