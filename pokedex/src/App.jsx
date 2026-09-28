import React, { useEffect, useState } from 'react';
import PokemonCard from './PokemonCard';

function App() {
  const [cards, setCards] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cardType, setCardType] = useState('ALL'); // 'ALL', 'BASIC', 'EX'
  const [loading, setLoading] = useState(false);

  const fetchPokemon = (query = '', type = cardType) => {
    setLoading(true);
    const cleanQuery = query.trim();

    let queryParts = [];

    // 1. Search name with wildcards
    if (cleanQuery) {
      queryParts.push(`name:${cleanQuery}*`);
    }

    // 2. Filter subtypes
    if (type === 'EX') {
      queryParts.push('subtypes:EX');
    } else if (type === 'BASIC') {
      queryParts.push('subtypes:Basic');
    }

    // Combine parameters with raw spaces rather than encoding them together
    const queryParam = queryParts.join(' ');
    
    // Default fallback to fetch popular cards if search and filters are empty
    const endpoint = queryParam
      ? `/api-tcg/cards?q=${encodeURIComponent(queryParam)}`
      : '/api-tcg/cards?q=supertype:pokemon';

    fetch(endpoint)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data && data.data) {
          setCards(data.data.slice(0, 16));
        } else {
          setCards([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setCards([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPokemon(searchTerm, cardType);
  }, [cardType]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPokemon(searchTerm, cardType);
  };

  return (
    <div style={{ background: '#121212', minHeight: '100vh', padding: '20px', color: '#fff', textAlign: 'center' }}>
      <h1>Pokémon TCG Search</h1>

      <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search Pokémon (e.g., Swampert, Charizard, Mudkip)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '12px 20px',
            width: '320px',
            borderRadius: '25px',
            border: 'none',
            fontSize: '16px',
            marginRight: '10px',
          }}
        />
        <button
          type="submit"
          style={{
            padding: '12px 24px',
            borderRadius: '25px',
            border: 'none',
            background: '#ffcb05',
            color: '#121212',
            fontWeight: 'bold',
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          Search
        </button>
      </form>

      {/* Card Category Filters */}
      <div style={{ marginBottom: '30px' }}>
        {[
          { label: 'All Cards', value: 'ALL' },
          { label: 'Basic Cards', value: 'BASIC' },
          { label: 'EX Cards', value: 'EX' },
        ].map((type) => (
          <button
            key={type.value}
            onClick={() => setCardType(type.value)}
            style={{
              padding: '8px 18px',
              margin: '0 5px',
              borderRadius: '20px',
              border: '1px solid #ffcb05',
              background: cardType === type.value ? '#ffcb05' : 'transparent',
              color: cardType === type.value ? '#121212' : '#fff',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            {type.label}
          </button>
        ))}
      </div>

      {loading ? (
        <h2>Loading cards...</h2>
      ) : cards.length === 0 ? (
        <h3>No cards found for "{searchTerm}". Try setting the filter to "All Cards".</h3>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          {cards.map((card) => (
            <PokemonCard key={card.id} card={card} />
          ))}
        </div>
      )}
    </div>
  );
}

export default App;