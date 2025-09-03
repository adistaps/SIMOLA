
-- Allow admin users to create new users in profiles table
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

-- Create new policy that allows admin to insert any profile, and users to insert their own
CREATE POLICY "Admin can insert any profile, users can insert own" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (
    get_current_user_role() = 'admin'::text OR auth.uid() = id
  );

-- Also allow admin to update any profile
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Admin can update any profile, users can update own" 
  ON public.profiles 
  FOR UPDATE 
  USING (
    get_current_user_role() = 'admin'::text OR auth.uid() = id
  );
