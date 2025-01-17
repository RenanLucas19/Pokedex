import React, { useEffect, useState } from 'react';

function App() {
  const [pokemon, setPokemon] = useState([]);
  
  useEffect(() => {
    // Função para obter dados do Pokemon
    const fetchPokemon = async () => {
      const response = await fetch("https://pokeapi.co/api/v2/pokemon/?limit=40"); // Alterei para limitar a quantidade de Pokémon
      const data = await response.json();
      setPokemon(data.results); // Salva a lista de Pokémon
    };

    // Chama a função de fetch
    fetchPokemon();
  }, []);

  return (
    <div>
      <h1>Pokémon Data</h1>
      <div>
        <h2>Lista de Pokémons</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {pokemon.map((poke) => (
            <PokemonCard key={poke.name} pokemonUrl={poke.url} />
          ))}
        </div>
      </div>
    </div>
  );
}

function PokemonCard({ pokemonUrl }) {
  const [pokemonData, setPokemonData] = useState(null);

  useEffect(() => {
    // Função para obter dados detalhados do Pokémon
    const fetchPokemonData = async () => {
      const response = await fetch(pokemonUrl);
      const data = await response.json();
      setPokemonData(data);
    };

    // Chama a função de fetch
    fetchPokemonData();
  }, [pokemonUrl]);

  if (!pokemonData) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ margin: '20px', width: '150px', textAlign: 'center' }}>
      <img 
        src={pokemonData.sprites.front_default} 
        alt={pokemonData.name} 
        style={{ width: '100px', height: '100px' }} 
      />
      <h3>{pokemonData.name}</h3>
    </div>
  );
}

export default App;
