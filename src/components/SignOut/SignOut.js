import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { supabase } from '../../supabaseClient.js';

function SignOut() {
  const navigate = useNavigate();

  useEffect(() => {
    const signOut = async () => {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error.message);
      } else {
        navigate('/');
      }
    };

    signOut();
  }, [navigate]);

  return (
    <div className="signin">
      <div className="signin-container">
        <div className="text-center">
          <p>Thanks for using <span className="bold-text">Bee Finance</span></p>
          <p>Redirecting to sign in...</p>
        </div>
      </div>
    </div>
  );
}

export default SignOut;
