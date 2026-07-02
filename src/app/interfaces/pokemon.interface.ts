// Interfaz para los Tipos de Pokémon
export interface ITipo {
    slot: number;
    type: {
        name: string;
        url: string;
    };
}

// Interfaz para las Estadísticas
export interface IEstadistica {
    base_stat: number;
    stat: {
        name: string;
    };
}

// Interfaz para las Habilidades
export interface IHabilidad {
    ability: {
        name: string;
        url: string;
    };
    is_hidden: boolean;
    slot: number;
}

// Interfaz principal de Pokémon
export interface IPokemon {
    id: number;
    name: string;
    height: number;
    weight: number;
    base_experience: number;
    sprites: {
        front_default: string;
        other?: {
            'official-artwork': {
                front_default: string;
            };
        };
    };
    types: ITipo[];
    stats: IEstadistica[];
    abilities: IHabilidad[];
}