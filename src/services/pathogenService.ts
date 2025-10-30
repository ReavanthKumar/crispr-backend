import { supabase } from '../lib/supabase';
import { Pathogen, TargetSite } from '../types/pathogen';

export const pathogenService = {
  async getAllPathogens(): Promise<Pathogen[]> {
    const { data: pathogens, error: pathogensError } = await supabase
      .from('pathogens')
      .select('*')
      .order('name');

    if (pathogensError) throw pathogensError;

    const pathogensWithTargets = await Promise.all(
      (pathogens || []).map(async (pathogen) => {
        const { data: targets, error: targetsError } = await supabase
          .from('target_sites')
          .select('*')
          .eq('pathogen_id', pathogen.id)
          .order('start_pos');

        if (targetsError) throw targetsError;

        return {
          id: pathogen.id,
          name: pathogen.name,
          strain: pathogen.strain,
          cas_system: {
            type: pathogen.cas_type,
            description: pathogen.cas_description
          },
          targets: (targets || []).map((t: any) => ({
            sequence: t.sequence,
            pam: t.pam,
            start_pos: t.start_pos,
            end_pos: t.end_pos,
            strand: t.strand,
            gc_content: parseFloat(t.gc_content)
          })),
          created_at: pathogen.created_at,
          updated_at: pathogen.updated_at
        };
      })
    );

    return pathogensWithTargets;
  },

  async searchPathogens(searchTerm: string): Promise<Pathogen[]> {
    if (!searchTerm.trim()) {
      return this.getAllPathogens();
    }

    const { data: pathogens, error: pathogensError } = await supabase
      .from('pathogens')
      .select('*')
      .ilike('name', `%${searchTerm}%`)
      .order('name');

    if (pathogensError) throw pathogensError;

    const pathogensWithTargets = await Promise.all(
      (pathogens || []).map(async (pathogen) => {
        const { data: targets, error: targetsError } = await supabase
          .from('target_sites')
          .select('*')
          .eq('pathogen_id', pathogen.id)
          .order('start_pos');

        if (targetsError) throw targetsError;

        return {
          id: pathogen.id,
          name: pathogen.name,
          strain: pathogen.strain,
          cas_system: {
            type: pathogen.cas_type,
            description: pathogen.cas_description
          },
          targets: (targets || []).map((t: any) => ({
            sequence: t.sequence,
            pam: t.pam,
            start_pos: t.start_pos,
            end_pos: t.end_pos,
            strand: t.strand,
            gc_content: parseFloat(t.gc_content)
          })),
          created_at: pathogen.created_at,
          updated_at: pathogen.updated_at
        };
      })
    );

    return pathogensWithTargets;
  },

  async createPathogen(pathogen: Pathogen): Promise<Pathogen> {
    const { data: newPathogen, error: pathogenError } = await supabase
      .from('pathogens')
      .insert([{
        name: pathogen.name,
        strain: pathogen.strain,
        cas_type: pathogen.cas_system.type,
        cas_description: pathogen.cas_system.description
      }])
      .select()
      .single();

    if (pathogenError) throw pathogenError;

    const targetInserts = pathogen.targets.map((t: TargetSite) => ({
      pathogen_id: newPathogen.id,
      sequence: t.sequence,
      pam: t.pam,
      start_pos: t.start_pos,
      end_pos: t.end_pos,
      strand: t.strand,
      gc_content: t.gc_content
    }));

    const { data: insertedTargets, error: targetsError } = await supabase
      .from('target_sites')
      .insert(targetInserts)
      .select();

    if (targetsError) throw targetsError;

    return {
      id: newPathogen.id,
      name: newPathogen.name,
      strain: newPathogen.strain,
      cas_system: {
        type: newPathogen.cas_type,
        description: newPathogen.cas_description
      },
      targets: (insertedTargets || []).map((t: any) => ({
        sequence: t.sequence,
        pam: t.pam,
        start_pos: t.start_pos,
        end_pos: t.end_pos,
        strand: t.strand,
        gc_content: parseFloat(t.gc_content)
      })),
      created_at: newPathogen.created_at,
      updated_at: newPathogen.updated_at
    };
  }
};
