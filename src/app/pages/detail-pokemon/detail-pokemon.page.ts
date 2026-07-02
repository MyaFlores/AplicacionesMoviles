import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonBackButton, IonButtons, IonText, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonChip, IonLabel, IonIcon, IonItem } from '@ionic/angular/standalone';
import { PokemonApiService } from '../../services/pokemon-api.service';
import { IPokemon } from '../../interfaces/pokemon.interface';  // 👈 Importar IPokemon

@Component({
  selector: 'app-detail-pokemon',
  templateUrl: './detail-pokemon.page.html',
  styleUrls: ['./detail-pokemon.page.scss'],
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonBackButton, IonButtons,
    IonText, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonChip, IonLabel, IonItem,
    CommonModule
  ]
})
export class DetailPokemonPage implements OnInit {
  pokemon: IPokemon | null = null;  // 👈 Usar IPokemon
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private pokemonService: PokemonApiService  // 👈 Nuevo nombre
  ) {}

  ngOnInit() {
    const name = this.route.snapshot.paramMap.get('id');
    if (name) {
      this.loadPokemonDetail(name);
    }
  }

  loadPokemonDetail(name: string) {
    this.isLoading = true;
    this.errorMessage = '';

    this.pokemonService.getPokemonDetail(name).subscribe({
      next: (data: IPokemon) => {  // 👈 Usar IPokemon
        this.pokemon = data;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error:', error);
        this.errorMessage = 'Error al cargar los detalles.';
        this.isLoading = false;
      }
    });
  }

  getPokemonImage(): string {
    return this.pokemon?.sprites?.other?.['official-artwork']?.front_default ||
           this.pokemon?.sprites?.front_default ||
           '';
  }

  getTypeColor(type: string): string {
    const colors: any = {
      normal: 'medium', fire: 'danger', water: 'primary',
      grass: 'success', electric: 'warning', ice: 'light',
      fighting: 'danger', poison: 'tertiary', ground: 'warning',
      flying: 'secondary', psychic: 'tertiary', bug: 'success',
      rock: 'dark', ghost: 'medium', dark: 'dark',
      dragon: 'primary', steel: 'medium', fairy: 'secondary'
    };
    return colors[type] || 'medium';
  }

  getStatLabel(statName: string): string {
    const labels: any = {
      hp: 'HP', attack: 'Ataque', defense: 'Defensa',
      'special-attack': 'At. Especial', 'special-defense': 'Def. Especial',
      speed: 'Velocidad'
    };
    return labels[statName] || statName;
  }
}