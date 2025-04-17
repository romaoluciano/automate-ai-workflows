
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redireciona para o Dashboard ao carregar a página
    navigate('/');
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4 text-primary-700">AutomateAI</h1>
        <p className="text-xl text-gray-600">Carregando...</p>
      </div>
    </div>
  );
};

export default Index;
