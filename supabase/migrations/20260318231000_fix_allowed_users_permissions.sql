-- Grant permissions on allowed_users
GRANT SELECT ON allowed_users TO authenticated;
GRANT ALL ON allowed_users TO service_role;
