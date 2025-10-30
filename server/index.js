import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';

const app = express();
const PORT = process.env.PORT || 3001;

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(cors());
app.use(express.json());

app.get('/api/pathogens', async (req, res) => {
  try {
    const { data: pathogens, error: pathogensError } = await supabase
      .from('pathogens')
      .select('*')
      .order('name');

    if (pathogensError) throw pathogensError;

    const pathogensWithTargets = await Promise.all(
      pathogens.map(async (pathogen) => {
        const { data: targets, error: targetsError } = await supabase
          .from('target_sites')
          .select('*')
          .eq('pathogen_id', pathogen.id)
          .order('start_pos');

        if (targetsError) throw targetsError;

        return {
          ...pathogen,
          cas_system: {
            type: pathogen.cas_type,
            description: pathogen.cas_description
          },
          targets: targets.map(t => ({
            sequence: t.sequence,
            pam: t.pam,
            start_pos: t.start_pos,
            end_pos: t.end_pos,
            strand: t.strand,
            gc_content: parseFloat(t.gc_content)
          }))
        };
      })
    );

    res.json(pathogensWithTargets);
  } catch (error) {
    console.error('Error fetching pathogens:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/pathogens/search', async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({ error: 'Name query parameter is required' });
    }

    const { data: pathogens, error: pathogensError } = await supabase
      .from('pathogens')
      .select('*')
      .ilike('name', `%${name}%`)
      .order('name');

    if (pathogensError) throw pathogensError;

    const pathogensWithTargets = await Promise.all(
      pathogens.map(async (pathogen) => {
        const { data: targets, error: targetsError } = await supabase
          .from('target_sites')
          .select('*')
          .eq('pathogen_id', pathogen.id)
          .order('start_pos');

        if (targetsError) throw targetsError;

        return {
          ...pathogen,
          cas_system: {
            type: pathogen.cas_type,
            description: pathogen.cas_description
          },
          targets: targets.map(t => ({
            sequence: t.sequence,
            pam: t.pam,
            start_pos: t.start_pos,
            end_pos: t.end_pos,
            strand: t.strand,
            gc_content: parseFloat(t.gc_content)
          }))
        };
      })
    );

    res.json(pathogensWithTargets);
  } catch (error) {
    console.error('Error searching pathogens:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/pathogens', async (req, res) => {
  try {
    const { name, strain, cas_system, targets } = req.body;

    if (!name || !strain || !cas_system || !targets) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { data: pathogen, error: pathogenError } = await supabase
      .from('pathogens')
      .insert([{
        name,
        strain,
        cas_type: cas_system.type,
        cas_description: cas_system.description
      }])
      .select()
      .single();

    if (pathogenError) throw pathogenError;

    const targetInserts = targets.map(t => ({
      pathogen_id: pathogen.id,
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

    const result = {
      ...pathogen,
      cas_system: {
        type: pathogen.cas_type,
        description: pathogen.cas_description
      },
      targets: insertedTargets.map(t => ({
        sequence: t.sequence,
        pam: t.pam,
        start_pos: t.start_pos,
        end_pos: t.end_pos,
        strand: t.strand,
        gc_content: parseFloat(t.gc_content)
      }))
    };

    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating pathogen:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
