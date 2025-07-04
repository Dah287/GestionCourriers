import { useEffect } from 'react';
// ❌ Ancienne importation
// import { useHistory } from 'react-router-dom';

// ✅ Nouvelle façon avec react-router-dom v6+
import { useNavigate } from 'react-router-dom';

const useAutoLogout = () => {
  const navigate = useNavigate(); // ✅ Remplace useHistory()

  useEffect(() => {
    let timer;

const resetTimer = () => {
  clearTimeout(timer);
  timer = setTimeout(() => {
    const login = localStorage.getItem('login');
    if (login === "login") {
      // login correct => rester sur la page, gérer couleur verte ici
           localStorage.clear();
      navigate('/'); 
      // Par exemple, mettre une classe css ou un état pour afficher en vert
    } else {
      // login absent ou différent => redirection vers /login1
      localStorage.clear();
      navigate('/login1'); // redirection vers /login1
    }
  }, 10 * 60 * 1000); // 10 minutes
};

    const events = ['mousemove', 'keydown', 'click', 'scroll'];
    events.forEach(event => window.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      events.forEach(event => window.removeEventListener(event, resetTimer));
      clearTimeout(timer);
    };
  }, [navigate]); // ✅ Attention ici aussi
};

export default useAutoLogout;
