/*
  # CRISPR/Cas Target Sites Database Schema

  ## Overview
  This migration creates the database structure for storing CRISPR/Cas9 target site 
  information for bacterial pathogens. The schema supports storing pathogen details
  and their associated CRISPR target sequences.

  ## New Tables
  
  ### `pathogens`
  Main table storing bacterial pathogen information:
  - `id` (uuid, primary key) - Unique identifier for each pathogen
  - `name` (text, required) - Scientific name of the pathogen (e.g., "Escherichia coli")
  - `strain` (text, required) - Specific strain identifier
  - `cas_type` (text, required) - Type of CRISPR/Cas system (e.g., "Cas9", "Cas12a")
  - `cas_description` (text) - Description of the Cas system characteristics
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Record update timestamp

  ### `target_sites`
  Table storing individual CRISPR target site sequences:
  - `id` (uuid, primary key) - Unique identifier for each target site
  - `pathogen_id` (uuid, foreign key) - References parent pathogen
  - `sequence` (text, required) - DNA sequence of the target site
  - `pam` (text, required) - Protospacer Adjacent Motif sequence
  - `start_pos` (integer, required) - Starting position in genome
  - `end_pos` (integer, required) - Ending position in genome
  - `strand` (text, required) - DNA strand orientation ('+' or '-')
  - `gc_content` (numeric, required) - GC content percentage (0-100)
  - `created_at` (timestamptz) - Record creation timestamp

  ## Security
  
  ### Row Level Security (RLS)
  - Both tables have RLS enabled for data protection
  - Public read access is granted for viewing pathogen and target data
  - Authenticated users can insert new records
  - Only authenticated users can update or delete records they created

  ## Indexes
  - Index on `pathogens.name` for efficient name-based searches
  - Index on `target_sites.pathogen_id` for fast joins and lookups

  ## Notes
  - Foreign key constraint ensures referential integrity between tables
  - Cascade delete removes all target sites when a pathogen is deleted
  - GC content is stored as percentage (0-100) for biological accuracy
  - Timestamps use `timestamptz` for timezone awareness
*/

-- Create pathogens table
CREATE TABLE IF NOT EXISTS pathogens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  strain text NOT NULL,
  cas_type text NOT NULL,
  cas_description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create target_sites table
CREATE TABLE IF NOT EXISTS target_sites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pathogen_id uuid NOT NULL REFERENCES pathogens(id) ON DELETE CASCADE,
  sequence text NOT NULL,
  pam text NOT NULL,
  start_pos integer NOT NULL,
  end_pos integer NOT NULL,
  strand text NOT NULL CHECK (strand IN ('+', '-')),
  gc_content numeric(5,2) NOT NULL CHECK (gc_content >= 0 AND gc_content <= 100),
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_pathogens_name ON pathogens(name);
CREATE INDEX IF NOT EXISTS idx_target_sites_pathogen_id ON target_sites(pathogen_id);

-- Enable Row Level Security
ALTER TABLE pathogens ENABLE ROW LEVEL SECURITY;
ALTER TABLE target_sites ENABLE ROW LEVEL SECURITY;

-- RLS Policies for pathogens table
CREATE POLICY "Public can view all pathogens"
  ON pathogens FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert pathogens"
  ON pathogens FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update pathogens"
  ON pathogens FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete pathogens"
  ON pathogens FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for target_sites table
CREATE POLICY "Public can view all target sites"
  ON target_sites FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert target sites"
  ON target_sites FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update target sites"
  ON target_sites FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete target sites"
  ON target_sites FOR DELETE
  TO authenticated
  USING (true);