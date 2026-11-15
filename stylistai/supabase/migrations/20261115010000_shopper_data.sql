BEGIN;

CREATE TABLE public.stylist_profiles (
  user_id uuid PRIMARY KEY DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  payload jsonb NOT NULL CHECK (jsonb_typeof(payload) = 'object'),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.stylist_requests (
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  id uuid NOT NULL,
  payload jsonb NOT NULL CHECK (jsonb_typeof(payload) = 'object'),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, id)
);
CREATE INDEX stylist_requests_history ON public.stylist_requests (user_id, created_at DESC, id DESC);

CREATE TABLE public.stylist_saved_looks (
  user_id uuid NOT NULL DEFAULT auth.uid(),
  request_id uuid NOT NULL,
  look_id text NOT NULL CHECK (length(look_id) BETWEEN 1 AND 160),
  payload jsonb NOT NULL CHECK (jsonb_typeof(payload) = 'object'),
  saved_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, request_id, look_id),
  FOREIGN KEY (user_id, request_id) REFERENCES public.stylist_requests (user_id, id) ON DELETE CASCADE
);
CREATE INDEX stylist_saved_looks_history ON public.stylist_saved_looks (user_id, saved_at DESC, request_id, look_id);

CREATE TABLE public.stylist_ratings (
  user_id uuid NOT NULL DEFAULT auth.uid(),
  request_id uuid NOT NULL,
  look_id text NOT NULL CHECK (length(look_id) BETWEEN 1 AND 160),
  rating text NOT NULL CHECK (rating IN ('like', 'dislike')),
  PRIMARY KEY (user_id, request_id, look_id),
  FOREIGN KEY (user_id, request_id) REFERENCES public.stylist_requests (user_id, id) ON DELETE CASCADE
);

ALTER TABLE public.stylist_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stylist_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stylist_saved_looks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stylist_ratings ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.stylist_profiles, public.stylist_requests, public.stylist_saved_looks, public.stylist_ratings
  FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.stylist_profiles, public.stylist_saved_looks, public.stylist_ratings TO authenticated;
GRANT SELECT ON public.stylist_requests TO authenticated;

CREATE FUNCTION public.stylist_save_request(request_id uuid, request_payload jsonb)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE owner_id uuid := auth.uid();
BEGIN
  IF owner_id IS NULL THEN
    RAISE EXCEPTION 'Authentication is required' USING ERRCODE = '42501';
  END IF;
  IF jsonb_typeof(request_payload) IS DISTINCT FROM 'object'
    OR request_payload->>'id' IS DISTINCT FROM request_id::text
    OR octet_length(request_payload::text) > 8192 THEN
    RAISE EXCEPTION 'Invalid styling request' USING ERRCODE = '22023';
  END IF;
  PERFORM pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(owner_id::text, 0));
  IF EXISTS (SELECT 1 FROM public.stylist_requests WHERE user_id = owner_id AND id = request_id) THEN
    RETURN true;
  END IF;
  IF (SELECT count(*) FROM public.stylist_requests
      WHERE user_id = owner_id AND created_at > now() - interval '24 hours') >= 30 THEN
    RETURN false;
  END IF;
  INSERT INTO public.stylist_requests (user_id, id, payload) VALUES (owner_id, request_id, request_payload);
  RETURN true;
END;
$$;
REVOKE ALL ON FUNCTION public.stylist_save_request(uuid, jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.stylist_save_request(uuid, jsonb) TO authenticated;

CREATE POLICY stylist_profiles_owner ON public.stylist_profiles FOR ALL TO authenticated
  USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);
CREATE POLICY stylist_requests_owner ON public.stylist_requests FOR ALL TO authenticated
  USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);
CREATE POLICY stylist_saved_looks_owner ON public.stylist_saved_looks FOR ALL TO authenticated
  USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);
CREATE POLICY stylist_ratings_owner ON public.stylist_ratings FOR ALL TO authenticated
  USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);

COMMIT;
