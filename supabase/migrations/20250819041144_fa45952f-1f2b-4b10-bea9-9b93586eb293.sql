-- Fix security vulnerability: Restrict profile data access to prevent email harvesting
-- This addresses the critical security issue where user profile data including emails could be harvested

-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Create a security definer function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Create a security definer function to get current user role (for avoiding recursion)
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT role
  FROM public.profiles
  WHERE id = auth.uid();
$$;

-- Create restrictive RLS policies
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (public.get_current_user_role() = 'admin');

-- Create a security definer function for profile statistics that doesn't expose sensitive data
CREATE OR REPLACE FUNCTION public.get_profile_stats()
RETURNS json
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT json_build_object(
    'total', COUNT(*),
    'byRole', json_build_object(
      'admin', COUNT(*) FILTER (WHERE role = 'admin'),
      'petugas', COUNT(*) FILTER (WHERE role = 'petugas'), 
      'dispatcher', COUNT(*) FILTER (WHERE role = 'dispatcher')
    )
  )
  FROM public.profiles;
$$;

-- Create a security definer function for admin to list profiles (without exposing to non-admins)
CREATE OR REPLACE FUNCTION public.get_profiles_for_admin()
RETURNS SETOF public.profiles
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT *
  FROM public.profiles
  WHERE public.get_current_user_role() = 'admin'
  ORDER BY created_at DESC;
$$;