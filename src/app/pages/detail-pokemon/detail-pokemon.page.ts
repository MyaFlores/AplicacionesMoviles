import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonBackButton, IonButtons, IonText, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonChip, IonLabel, IonItem, LoadingController, IonIcon, IonFab, IonFabButton, IonList, IonBadge, IonProgressBar, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';

import { PokemonApiService } from '../../services/pokemon-api.service';
import { IPokemon } from '../../interfaces/pokemon.interface';
import { Router } from '@angular/router';
import { arrowBackOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-detail-pokemon',
  templateUrl: './detail-pokemon.page.html',
  styleUrls: ['./detail-pokemon.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar,
     IonButtons, IonText, IonCard,
    IonCardHeader, IonCardTitle, IonCardContent,
    IonChip, IonLabel, IonItem, IonIcon,
    CommonModule,
    IonFab,
    IonFabButton,
    IonList,
    IonBadge,
    IonProgressBar,
    IonGrid,
    IonRow,
    IonCol
]
})
export class DetailPokemonPage implements OnInit {
  @Input() id!: string;

  pokemon: IPokemon | null = null;
  isLoading: boolean = true;
  errorMessage: string = '';

  private pokemonService = inject(PokemonApiService);
  private loadingController = inject(LoadingController);
  private router = inject(Router);

  constructor() {
    addIcons({ arrowBackOutline });
  }

  getStatColor(value: number): string {
  if (value >= 100) return 'success';
  if (value >= 35) return 'warning';
  if (value < 30) return 'danger';
  return 'danger';
}

  ngOnInit() {
    if (this.id) {
      this.loadPokemonDetail(this.id);
    }
  }

 async loadPokemonDetail(name: string): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';

    // 👇 Crear y mostrar el loading
    const loading = await this.loadingController.create({
      message: 'Cargando Pokémon...',
      spinner: 'crescent',
    });
    await loading.present();

    try {
      const data = await this.pokemonService.getPokemon(name);
      this.pokemon = data;
      this.isLoading = false;
    } catch (error: any) {
      console.error('Error:', error);
      this.errorMessage = 'Error al cargar los detalles.';
      this.isLoading = false;
    } finally {
      // 👇 4. Cerrar el loading en el bloque finally
      await loading.dismiss();
    }
  }

  goBack(): void {
    this.router.navigate(['/list-pokemons']);
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

  getTypeSpanish(type: string): string {
    const types: { [key: string]: string } = {
      normal: 'NORMAL', fire: 'FUEGO', water: 'AGUA',
      grass: 'PLANTA', electric: 'ELÉCTRICO', ice: 'HIELO',
      fighting: 'LUCHA', poison: 'VENENO', ground: 'TIERRA',
      flying: 'VOLADOR', psychic: 'PSÍQUICO', bug: 'BICHO',
      rock: 'ROCA', ghost: 'FANTASMA', dark: 'SINIESTRO',
      dragon: 'DRAGÓN', steel: 'ACERO', fairy: 'HADA'
    };
    return types[type] || type.toUpperCase();
  }
}