import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { supabase } from '../../supabase';

const AuthGuard = () => {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/admin/login');
      }
      setChecking(false);
    };
    checkSession();
    // Optionally, listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate('/admin/login');
      }
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, [navigate]);

  if (checking) return null;
  return <Outlet />;
};

export default AuthGuard;