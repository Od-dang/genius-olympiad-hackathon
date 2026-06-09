'use client';

import { useState, useRef, useEffect } from 'react';
import { api } from '@/lib/api';
import { GeocodeResult } from '@/types';

interface Props {
  onSelect: (lat: number, lon: number) => void;
}

export default function SearchBar({ onSelect }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodeResult[]>([]);
  const [open, setOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const data = await api.geocode(query);
        setResults(data);
        setOpen(data.length > 0);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 400);
  }, [query]);

  const handleSelect = (r: GeocodeResult) => {
    setQuery(r.city ? `${r.city}${r.state ? ', ' + r.state : ''}` : r.display_name.split(',')[0]);
    setOpen(false);
    onSelect(r.lat, r.lon);
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2 rounded-lg px-3 py-2 border border-blue-700/60 focus-within:border-blue-400 transition-colors"
           style={{ background: '#0a1e35' }}>
        <span className="text-blue-500 text-sm">🔍</span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search city or zip code..."
          className="bg-transparent flex-1 text-sm outline-none text-blue-100 placeholder:text-blue-600"
          onFocus={() => results.length > 0 && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
        />
        {searching && (
          <div className="w-3.5 h-3.5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
        )}
      </div>

      {open && (
        <ul
          className="absolute top-full left-0 right-0 mt-1 rounded-xl shadow-2xl overflow-hidden z-50 border border-blue-800"
          style={{ background: '#0a1e35' }}
        >
          {results.map((r) => (
            <li
              key={`${r.lat}-${r.lon}`}
              onMouseDown={() => handleSelect(r)}
              className="px-4 py-2.5 text-sm text-blue-200 hover:bg-blue-800/60 hover:text-white cursor-pointer truncate transition-colors border-b border-blue-900 last:border-0"
            >
              {r.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
