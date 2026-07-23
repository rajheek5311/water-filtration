/*
# Create filtration_records table

1. New Tables
- `filtration_records`
  - `id` (uuid, primary key)
  - `sample_id` (text, unique human-readable identifier e.g. TWF-20260721-001)
  - `sample_type` (text, 'before' or 'after' filtration)
  - `test_date` (date the sample was taken)
  - `test_time` (time the sample was taken)
  - `ph_value` (numeric estimated pH from strip image)
  - `ph_confidence` (numeric 0-1 confidence of pH estimate)
  - `ph_strip_image` (text data URL of the uploaded pH strip image)
  - `water_color` (text detected water colour name)
  - `dye_category` (text predicted dye category)
  - `color_intensity` (numeric 0-100 colour intensity)
  - `water_sample_image` (text data URL of the uploaded water sample image)
  - `microfiber_count` (int approximate microfiber count)
  - `fiber_density` (numeric fibers per unit area)
  - `average_fiber_length` (numeric average fiber length in µm)
  - `filter_paper_image` (text data URL of the uploaded filter paper image)
  - `temperature` (numeric °C manual input)
  - `turbidity` (numeric NTU manual input)
  - `flow_rate` (numeric L/min manual input)
  - `water_level` (numeric cm manual input)
  - `pressure_drop` (numeric kPa manual input)
  - `electrical_conductivity` (numeric µS/cm manual input)
  - `dissolved_oxygen` (numeric mg/L manual input)
  - `estimated_cod` (numeric estimated COD mg/L)
  - `estimated_bod` (numeric estimated BOD mg/L)
  - `filtration_efficiency` (numeric 0-100 %)
  - `overall_quality` (text qualitative quality rating)
  - `alerts` (jsonb array of generated alert objects)
  - `notes` (text optional notes)
  - `created_at` (timestamptz)

2. Security
- Enable RLS on `filtration_records`.
- Multi-tenant app with sign-in: owner-scoped CRUD via auth.uid().
- `user_id` defaults to auth.uid() so inserts omitting it still succeed.
*/

CREATE TABLE IF NOT EXISTS filtration_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  sample_id text NOT NULL,
  sample_type text NOT NULL CHECK (sample_type IN ('before', 'after')),
  test_date date NOT NULL DEFAULT CURRENT_DATE,
  test_time time NOT NULL DEFAULT CURRENT_TIME,
  ph_value numeric,
  ph_confidence numeric,
  ph_strip_image text,
  water_color text,
  dye_category text,
  color_intensity numeric,
  water_sample_image text,
  microfiber_count integer,
  fiber_density numeric,
  average_fiber_length numeric,
  filter_paper_image text,
  temperature numeric,
  turbidity numeric,
  flow_rate numeric,
  water_level numeric,
  pressure_drop numeric,
  electrical_conductivity numeric,
  dissolved_oxygen numeric,
  estimated_cod numeric,
  estimated_bod numeric,
  filtration_efficiency numeric,
  overall_quality text,
  alerts jsonb DEFAULT '[]'::jsonb,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_filtration_records_user_id ON filtration_records(user_id);
CREATE INDEX IF NOT EXISTS idx_filtration_records_sample_id ON filtration_records(sample_id);
CREATE INDEX IF NOT EXISTS idx_filtration_records_sample_type ON filtration_records(sample_type);
CREATE INDEX IF NOT EXISTS idx_filtration_records_test_date ON filtration_records(test_date);

ALTER TABLE filtration_records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_filtration_records" ON filtration_records;
CREATE POLICY "select_own_filtration_records" ON filtration_records FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_filtration_records" ON filtration_records;
CREATE POLICY "insert_own_filtration_records" ON filtration_records FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_filtration_records" ON filtration_records;
CREATE POLICY "update_own_filtration_records" ON filtration_records FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_filtration_records" ON filtration_records;
CREATE POLICY "delete_own_filtration_records" ON filtration_records FOR DELETE
  TO authenticated USING (auth.uid() = user_id);
