import { Pathogen } from '../types/pathogen';
import { Dna, MapPin } from 'lucide-react';

interface PathogenCardProps {
  pathogen: Pathogen;
}

export function PathogenCard({ pathogen }: PathogenCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md border border-slate-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-slate-900 italic">{pathogen.name}</h3>
          <p className="text-sm text-slate-600 mt-1">Strain: {pathogen.strain}</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
          <Dna className="w-4 h-4" />
          {pathogen.cas_system.type}
        </div>
      </div>

      <div className="mb-4 p-3 bg-slate-50 rounded-md">
        <p className="text-sm text-slate-700">{pathogen.cas_system.description}</p>
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Target Sites ({pathogen.targets.length})
        </h4>

        {pathogen.targets.map((target, idx) => (
          <div key={idx} className="border border-slate-200 rounded-md p-3 bg-slate-50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500">Target #{idx + 1}</span>
              <div className="flex gap-2 text-xs">
                <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded">
                  GC: {target.gc_content.toFixed(1)}%
                </span>
                <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded">
                  {target.strand}
                </span>
              </div>
            </div>

            <div className="font-mono text-sm bg-white p-2 rounded border border-slate-200 mb-2">
              <span className="text-blue-600">{target.sequence}</span>
              <span className="text-red-600 ml-2">({target.pam})</span>
            </div>

            <div className="text-xs text-slate-600 flex gap-4">
              <span>Position: {target.start_pos} - {target.end_pos}</span>
              <span>Length: {target.end_pos - target.start_pos} bp</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
