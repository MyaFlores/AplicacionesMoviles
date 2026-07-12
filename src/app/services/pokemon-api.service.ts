import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'; // 👈 Importar Observable
import { IPokemon } from '../interfaces/pokemon.interface';

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
  private readonly baseUrl = 'https://pokeapi.co/api/v2';
  private nextUrl: string | null = null;
  private prevUrl: string | null = null;

  private http = inject(HttpClient);

  // Método para obtener la lista base (devuelve Observable)
  getPokemonList(limit: number = 20, offset: number = 0): Observable<PokemonListResponse> {
    const url = `${this.baseUrl}/pokemon?limit=${limit}&offset=${offset}`;
    return this.http.get<PokemonListResponse>(url);
  }

  getPokemon(nameOrId: string | number): Promise<IPokemon> {
    return this.http.get<IPokemon>(`${this.baseUrl}/pokemon/${nameOrId}`).toPromise() as Promise<IPokemon>;
  }

  // 👇 getPokemons con Promesa (corregido)
  getPokemons(limit: number = 20, offset: number = 0): Promise<IPokemon[]> | null {
    this.resetPagination();

    return new Promise((resolve, reject) => {
      this.getPokemonList(limit, offset).subscribe({
        next: (response: PokemonListResponse) => {
          this.updatePaginationUrls(response);
          
          const detailPromises = response.results.map(pokemon =>
            this.http.get<IPokemon>(pokemon.url).toPromise()
          );

          Promise.all(detailPromises)
            .then((pokemonDetails: (IPokemon | undefined)[]) => {
              const validPokemons = pokemonDetails.filter(
                (p): p is IPokemon => p !== undefined
              );
              resolve(validPokemons);
            })
            .catch((error: any) => reject(error));
        },
        error: (error: any) => reject(error) // 👈 Agregar tipo any
      });
    });
  }

  // 👇 getNextPageWithDetails (corregido)
  getNextPageWithDetails(): Promise<IPokemon[]> | null {
    if (!this.nextUrl) {
      console.warn('No hay siguiente página disponible.');
      return null;
    }

    return new Promise((resolve, reject) => {
      // 👈 Usar non-null assertion (!) ya que validamos que no es null
      this.http.get<PokemonListResponse>(this.nextUrl!).subscribe({
        next: (response: PokemonListResponse) => {
          this.updatePaginationUrls(response);
          
          const detailPromises = response.results.map(pokemon =>
            this.http.get<IPokemon>(pokemon.url).toPromise()
          );

          Promise.all(detailPromises)
            .then((pokemonDetails: (IPokemon | undefined)[]) => {
              const validPokemons = pokemonDetails.filter(
                (p): p is IPokemon => p !== undefined
              );
              resolve(validPokemons);
            })
            .catch((error: any) => reject(error));
        },
        error: (error: any) => reject(error) //Agregar tipo any
      });
    });
  }

  //getPrevPageWithDetails (corregido)
  getPrevPageWithDetails(): Promise<IPokemon[]> | null {
    if (!this.prevUrl) {
      console.warn('No hay página anterior disponible.');
      return null;
    }

    return new Promise((resolve, reject) => {
      //Usar non-null assertion (!) ya que validamos que no es null
      this.http.get<PokemonListResponse>(this.prevUrl!).subscribe({
        next: (response: PokemonListResponse) => {
          this.updatePaginationUrls(response);
          
          const detailPromises = response.results.map(pokemon =>
            this.http.get<IPokemon>(pokemon.url).toPromise()
          );

          Promise.all(detailPromises)
            .then((pokemonDetails: (IPokemon | undefined)[]) => {
              const validPokemons = pokemonDetails.filter(
                (p): p is IPokemon => p !== undefined
              );
              resolve(validPokemons);
            })
            .catch((error: any) => reject(error));
        },
        error: (error: any) => reject(error) // 👈 Agregar tipo any
      });
    });
  }

  // 👇 getPokemonDetail (corregido para asegurar que no devuelva undefined)
  getPokemonDetail(nameOrId: string | number): Promise<IPokemon> {
    return new Promise((resolve, reject) => {
      this.http.get<IPokemon>(`${this.baseUrl}/pokemon/${nameOrId}`).subscribe({
        next: (data: IPokemon) => {
          resolve(data);
        },
        error: (error: any) => {
          reject(error);
        }
      });
    });
  }

  resetPagination(): void {
    this.nextUrl = null;
    this.prevUrl = null;
  }

  private updatePaginationUrls(response: PokemonListResponse): void {
    this.nextUrl = response.next;
    this.prevUrl = response.previous;
  }
}