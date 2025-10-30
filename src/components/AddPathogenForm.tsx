import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Pathogen, TargetSite } from '../types/pathogen';

interface AddPathogenFormProps {
  onAdd: (pathogen: Pathogen) => Promise<void>;
  onCancel: () => void;
}

export function AddPathogenForm({ onAdd, onCancel }: AddPathogenFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    strain: '',
    casType: '',
    casDescription: '',
  });

  const [targets, setTargets] = useState<TargetSite[]>([{
    sequence: '',
    pam: '',
    start_pos: 0,
    end_pos: 0,
    strand: '+',
    gc_content: 0
  }]);

  const [loading, setLoading] = useState(false);

  const handleAddTarget = () => {
    setTargets([...targets, {
      sequence: '',
      pam: '',
      start_pos: 0,
      end_pos: 0,
      strand: '+',
      gc_content: 0
    }]);
  };

  const handleRemoveTarget = (index: number) => {
    setTargets(targets.filter((_, i) => i !== index));
  };

  const handleTargetChange = (index: number, field: keyof TargetSite, value: any) => {
    const newTargets = [...targets];
    newTargets[index] = { ...newTargets[index], [field]: value };
    setTargets(newTargets);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const pathogen: Pathogen = {
        name: formData.name,
        strain: formData.strain,
        cas_system: {
          type: formData.casType,
          description: formData.casDescription
        },
        targets: targets
      };

      await onAdd(pathogen);
    } catch (error) {
      console.error('Error adding pathogen:', error);
      alert('Failed to add pathogen. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Add New Pathogen</h2>
        <button
          onClick={onCancel}
          className="text-slate-400 hover:text-slate-600"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Pathogen Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Escherichia coli"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Strain
            </label>
            <input
              type="text"
              required
              value={formData.strain}
              onChange={(e) => setFormData({ ...formData, strain: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., K-12 MG1655"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Cas System Type
            </label>
            <input
              type="text"
              required
              value={formData.casType}
              onChange={(e) => setFormData({ ...formData, casType: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Cas9"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Cas System Description
            </label>
            <input
              type="text"
              required
              value={formData.casDescription}
              onChange={(e) => setFormData({ ...formData, casDescription: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Description"
            />
          </div>
        </div>

        <div className="border-t border-slate-200 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Target Sites</h3>
            <button
              type="button"
              onClick={handleAddTarget}
              className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Target
            </button>
          </div>

          <div className="space-y-4">
            {targets.map((target, idx) => (
              <div key={idx} className="border border-slate-200 rounded-md p-4 bg-slate-50">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-slate-700">Target #{idx + 1}</span>
                  {targets.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTarget(idx)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div className="col-span-full">
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Sequence
                    </label>
                    <input
                      type="text"
                      required
                      value={target.sequence}
                      onChange={(e) => handleTargetChange(idx, 'sequence', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md font-mono text-sm"
                      placeholder="ATCGATCG..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      PAM
                    </label>
                    <input
                      type="text"
                      required
                      value={target.pam}
                      onChange={(e) => handleTargetChange(idx, 'pam', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md font-mono text-sm"
                      placeholder="NGG"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Start Position
                    </label>
                    <input
                      type="number"
                      required
                      value={target.start_pos}
                      onChange={(e) => handleTargetChange(idx, 'start_pos', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      End Position
                    </label>
                    <input
                      type="number"
                      required
                      value={target.end_pos}
                      onChange={(e) => handleTargetChange(idx, 'end_pos', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Strand
                    </label>
                    <select
                      value={target.strand}
                      onChange={(e) => handleTargetChange(idx, 'strand', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                    >
                      <option value="+">+ (Forward)</option>
                      <option value="-">- (Reverse)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      GC Content (%)
                    </label>
                    <input
                      type="number"
                      required
                      step="0.01"
                      min="0"
                      max="100"
                      value={target.gc_content}
                      onChange={(e) => handleTargetChange(idx, 'gc_content', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Adding...' : 'Add Pathogen'}
          </button>
        </div>
      </form>
    </div>
  );
}
