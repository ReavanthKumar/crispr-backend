export interface TargetSite {
  sequence: string;
  pam: string;
  start_pos: number;
  end_pos: number;
  strand: string;
  gc_content: number;
}

export interface CasSystem {
  type: string;
  description: string;
}

export interface Pathogen {
  id?: string;
  name: string;
  strain: string;
  cas_system: CasSystem;
  targets: TargetSite[];
  created_at?: string;
  updated_at?: string;
}
