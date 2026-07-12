import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonList, IonItem, IonLabel, IonAvatar, IonBadge,
  IonButton, IonButtons, IonIcon, IonLoading,
  IonText, IonInfiniteScroll, IonInfiniteScrollContent
} from '@ionic/angular/standalone';
import { IPokemon } from '../../interfaces/pokemon.interface';
import { PokemonApiService } from '../../services/pokemon-api.service';

@Component({
  selector: 'app-list-pokemons',
  templateUrl: './list-pokemons.page.html',
  styleUrls: ['./list-pokemons.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonList, IonItem, IonLabel, IonAvatar, IonBadge,
    IonButton, IonButtons, IonIcon, IonLoading,
    IonText, IonInfiniteScroll, IonInfiniteScrollContent,
    CommonModule,
    RouterLink
  ]
})
export class ListPokemonsPage {
  private pokemonService: PokemonApiService = inject(PokemonApiService);

  pokemons: IPokemon[] = [];

  isLoading: boolean = false;
  isLoadingMore: boolean = false;
  errorMessage: string = '';
  hasNext: boolean = false;
  hasPrev: boolean = false;

  constructor() {
    this.loadInitialPokemons();
  }

  // Método para traducir tipos al español
  getTypeSpanish(type: string): string {
    const types: { [key: string]: string } = {
      normal: 'NORMAL',
      fire: 'FUEGO',
      water: 'AGUA',
      grass: 'PLANTA',
      electric: 'ELÉCTRICO',
      ice: 'HIELO',
      fighting: 'LUCHA',
      poison: 'VENENO',
      ground: 'TIERRA',
      flying: 'VOLADOR',
      psychic: 'PSÍQUICO',
      bug: 'BICHO',
      rock: 'ROCA',
      ghost: 'FANTASMA',
      dark: 'SINIESTRO',
      dragon: 'DRAGÓN',
      steel: 'ACERO',
      fairy: 'HADA'
    };
    return types[type] || type.toUpperCase();
  }

  // Método para obtener color según el tipo
  getTypeColor(type: string): string {
    const colors: { [key: string]: string } = {
      normal: 'medium',
      fire: 'danger',
      water: 'primary',
      grass: 'success',
      electric: 'warning',
      ice: 'light',
      fighting: 'danger',
      poison: 'tertiary',
      ground: 'warning',
      flying: 'secondary',
      psychic: 'tertiary',
      bug: 'success',
      rock: 'dark',
      ghost: 'medium',
      dark: 'dark',
      dragon: 'primary',
      steel: 'medium',
      fairy: 'secondary'
    };
    return colors[type] || 'medium';
  }

  loadInitialPokemons(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.pokemonService.resetPagination();
    this.pokemons = [];

    const promisePokemons = this.pokemonService.getPokemons(20, 0);
    if (promisePokemons) {
      promisePokemons
        .then((pokemons: IPokemon[]) => {
          this.pokemons = pokemons;
          this.updatePaginationState();
          this.isLoading = false;
        })
        .catch((error: any) => {
          console.error('Error:', error);
          this.errorMessage = 'Error al cargar los Pokémon.';
          this.isLoading = false;
        });
    }
  }

  // 👇 Función ACTUALIZADA para recibir el evento del infinite scroll
  async getMorePokemons(event?: any): Promise<void> {
    if (this.isLoading) {
      if (event) {
        event.target.complete();
      }
      return;
    }

    this.isLoading = true;
    this.isLoadingMore = true;
    this.errorMessage = '';

    const promisePokemons = this.pokemonService.getNextPageWithDetails();
    if (!promisePokemons) {
      this.isLoading = false;
      this.isLoadingMore = false;
      if (event) {
        event.target.complete();
      }
      return;
    }

    promisePokemons
      .then((pokemons: IPokemon[]) => {
        this.pokemons = this.pokemons.concat(pokemons);
        this.updatePaginationState();
        this.isLoading = false;
        this.isLoadingMore = false;
        if (event) {
          event.target.complete(); // 👈 COMPLETAR EL INFINITE SCROLL
        }
      })
      .catch((error: any) => {
        console.error('Error loading more Pokémon:', error);
        this.errorMessage = 'Error al cargar más Pokémon.';
        this.isLoading = false;
        this.isLoadingMore = false;
        if (event) {
          event.target.complete();
        }
      });
  }

  async loadPrevPage(): Promise<void> {
    if (this.isLoading) return;
    this.isLoading = true;
    this.isLoadingMore = true;
    this.errorMessage = '';

    const promisePokemons = this.pokemonService.getPrevPageWithDetails();
    if (!promisePokemons) {
      this.isLoading = false;
      this.isLoadingMore = false;
      return;
    }

    promisePokemons
      .then((pokemons: IPokemon[]) => {
        this.pokemons = pokemons;
        this.updatePaginationState();
        this.isLoading = false;
        this.isLoadingMore = false;
      })
      .catch((error: any) => {
        console.error('Error loading previous page:', error);
        this.errorMessage = 'Error al cargar la página anterior.';
        this.isLoading = false;
        this.isLoadingMore = false;
      });
  }

  private updatePaginationState(): void {
    this.hasNext = !!(this.pokemonService as any).nextUrl;
    this.hasPrev = !!(this.pokemonService as any).prevUrl;
  }
}