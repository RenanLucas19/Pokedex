import React, { useEffect, useState } from 'react';
import './App.css'; // Certifique-se de ter este arquivo CSS

function App() {
  const [pokemon, setPokemon] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  useEffect(() => {
    const fetchPokemon = async () => {
      const response = await fetch("https://pokeapi.co/api/v2/pokemon/?limit=1000");
      const data = await response.json();
      setPokemon(data.results);
      setFilteredPokemon(data.results); // Inicializa a lista filtrada com todos os Pokémon
    };

    fetchPokemon();
  }, []);

  useEffect(() => {
    const filtered = pokemon.filter((poke) =>
      poke.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPokemon(filtered);
  }, [searchTerm, pokemon]);

  return (
    <div>
      <h1>Pokédex</h1>
      {/* Barra de pesquisa abaixo do título */}
      <div style={{ marginTop: '20px' }}>
        <input
          type="text"
          placeholder="Pesquisar Pokémon..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            margin: '10px 0',
            padding: '8px 12px', // Tamanho menor
            width: '300px', // Define uma largura fixa
            fontSize: '14px',
            borderRadius: '20px', // Bordas redondas
            border: '1px solid #ccc', // Adiciona uma borda cinza
            outline: 'none', // Remove o contorno azul ao focar
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)', // Adiciona um leve sombreamento
          }}
        />
      </div>
      {selectedPokemon && (
        <PokemonDetails 
          pokemonUrl={selectedPokemon} 
          onClose={() => setSelectedPokemon(null)} 
        />
      )}
      <div>
        <h2>Lista de Pokémons</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {filteredPokemon.map((poke) => (
            <PokemonCard 
              key={poke.name} 
              pokemonUrl={poke.url} 
              onClick={() => setSelectedPokemon(poke.url)} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function PokemonCard({ pokemonUrl, onClick }) {
  const [pokemonData, setPokemonData] = useState(null);

  useEffect(() => {
    const fetchPokemonData = async () => {
      const response = await fetch(pokemonUrl);
      const data = await response.json();
      setPokemonData(data);
    };

    fetchPokemonData();
  }, [pokemonUrl]);

  if (!pokemonData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="pokemon-card" onClick={onClick} style={{ cursor: 'pointer' }}>
      <img 
        src={pokemonData.sprites.front_default} 
        alt={pokemonData.name} 
      />
      <h3>{pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1)}</h3>
      <div className="types">
        {pokemonData.types.map((type) => (
          <span key={type.type.name} className={`type ${type.type.name}`}>
            {type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)}
          </span>
        ))}
      </div>
    </div>
  );
}

function PokemonDetails({ pokemonUrl, onClose }) {
  const [pokemonData, setPokemonData] = useState(null);
  const [speciesData, setSpeciesData] = useState(null);

  useEffect(() => {
    const fetchPokemonData = async () => {
      const response = await fetch(pokemonUrl);
      const data = await response.json();
      setPokemonData(data);

      // Busca informações adicionais da espécie
      const speciesResponse = await fetch(data.species.url);
      const speciesDetails = await speciesResponse.json();
      setSpeciesData(speciesDetails);
    };

    fetchPokemonData();
  }, [pokemonUrl]);

  if (!pokemonData || !speciesData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="pokemon-details" style={{ padding: '20px', border: '1px solid #ccc', margin: '20px', borderRadius: '8px' }}>
      <button onClick={onClose} style={{ float: 'right', cursor: 'pointer' }}>Close</button>
      <h2>{pokemonData.name.toUpperCase()}</h2>
      <img src={pokemonData.sprites.front_default} alt={pokemonData.name} />
      <p><strong>ID:</strong> #{pokemonData.id}</p>
      <p><strong>Altura:</strong> {pokemonData.height / 10} m</p>
      <p><strong>Peso:</strong> {pokemonData.weight / 10} kg</p>
      <p>
        <strong>Tipos:</strong> {pokemonData.types.map((type) => type.type.name).join(', ')}
      </p>
      <p>
        <strong>Habilidades:</strong> {pokemonData.abilities.map((ability) => ability.ability.name).join(', ')}
      </p>
      <p><strong>Habitat:</strong> {speciesData.habitat ? speciesData.habitat.name : 'Desconhecido'}</p>
      <p>
        <strong>Descrição:</strong> {speciesData.flavor_text_entries.find(entry => entry.language.name === "en").flavor_text}
      </p>
    </div>
  );
}

export default App;
