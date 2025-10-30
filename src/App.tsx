import { useState, useEffect } from 'react';
import { Dna, Plus, Loader2 } from 'lucide-react';
import { Pathogen } from './types/pathogen';
import { pathogenService } from './services/pathogenService';
import { SearchBar } from './components/SearchBar';
import { PathogenCard } from './components/PathogenCard';
import { AddPathogenForm } from './components/AddPathogenForm';

function App() {
  const [pathogens, setPathogens] = useState<Pathogen[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPathogens();
  }, []);

  const loadPathogens = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await pathogenService.getAllPathogens();
      setPathogens(data);
    } catch (err) {
      setError('Failed to load pathogens. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await pathogenService.searchPathogens(query);
      setPathogens(data);
    } catch (err) {
      setError('Search failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPathogen = async (pathogen: Pathogen) => {
    try {
      await pathogenService.createPathogen(pathogen);
      setShowAddForm(false);
      await loadPathogens();
    } catch (err) {
      throw err;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Dna className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-slate-900">
              CRISPR/Cas Target Database
            </h1>
          </div>
          <p className="text-center text-slate-600 max-w-2xl mx-auto">
            Database of CRISPR/Cas9 target sites for common bacterial pathogens.
            Search and explore genomic targets for precision genome editing.
          </p>
        </header>

        <div className="flex flex-col items-center gap-6 mb-12">
          <SearchBar onSearch={handleSearch} />

          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md font-medium"
            >
              <Plus className="w-5 h-5" />
              Add New Pathogen
            </button>
          )}
        </div>

        {showAddForm && (
          <div className="max-w-4xl mx-auto mb-12">
            <AddPathogenForm
              onAdd={handleAddPathogen}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        )}

        {error && (
          <div className="max-w-4xl mx-auto mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <p className="text-slate-600">Loading pathogens...</p>
          </div>
        ) : pathogens.length === 0 ? (
          <div className="text-center py-20">
            <Dna className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">No pathogens found.</p>
            <p className="text-slate-400 text-sm mt-2">Try adjusting your search or add a new pathogen.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
            {pathogens.map((pathogen) => (
              <PathogenCard key={pathogen.id} pathogen={pathogen} />
            ))}
          </div>
        )}

        <footer className="mt-16 text-center text-slate-500 text-sm">
          <p>University Mini-Project: Bacterial Pathogen CRISPR/Cas Target Sites</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
