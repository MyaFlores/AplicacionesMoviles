import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators'; //Para manejar efectos secundarios
import { IPokemon } from '../interfaces/pokemon.interface';

// Interfaz para la respuesta de la lista
export interface PokemonListResponse {
  results: { name: string; url: string }[];
  count: number;
  next: string | null;
  previous: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class PokemonApiService {
  // 👇 1. Variable de solo lectura para la URL base
  private readonly baseUrl = 'https://pokeapi.co/api/v2';
  
  // 👇 2. Variables para almacenar las URLs de paginación
  private nextUrl: string | null = null;
  private prevUrl: string | null = null;

  constructor(private http: HttpClient) {}

  // Método para obtener la lista inicial o una página específica
  getPokemonList(limit: number = 20, offset: number = 0): Observable<PokemonListResponse> {
    const url = `${this.baseUrl}/pokemon?limit=${limit}&offset=${offset}`;
    return this.http.get<PokemonListResponse>(url)
      .pipe(
        tap(response => this.updatePaginationUrls(response)) // 👈 3. Actualizar las URLs al recibir la respuesta
      );
  }

  // Método para obtener la siguiente página
  getNextPage(): Observable<PokemonListResponse> | null {
    if (!this.nextUrl) {
      console.warn('No hay siguiente página disponible.');
      return null;
    }
    return this.http.get<PokemonListResponse>(this.nextUrl)
      .pipe(
        tap(response => this.updatePaginationUrls(response))
      );
  }

  // Método para obtener la página anterior
  getPrevPage(): Observable<PokemonListResponse> | null {
    if (!this.prevUrl) {
      console.warn('No hay página anterior disponible.');
      return null;
    }
    return this.http.get<PokemonListResponse>(this.prevUrl)
      .pipe(
        tap(response => this.updatePaginationUrls(response))
      );
  }

  // Método para obtener detalles de un Pokémon específico
  getPokemonDetail(nameOrId: string | number): Observable<IPokemon> {
    return this.http.get<IPokemon>(`${this.baseUrl}/pokemon/${nameOrId}`);
  }

  // Método para reiniciar la paginación
  resetPagination() {
    this.nextUrl = null;
    this.prevUrl = null;
  }

  // 👇 4. Método privado para actualizar las URLs de paginación
  private updatePaginationUrls(response: PokemonListResponse): void {
    this.nextUrl = response.next;
    this.prevUrl = response.previous;
    console.log('Paginación actualizada:', { next: this.nextUrl, prev: this.prevUrl });
  }
}