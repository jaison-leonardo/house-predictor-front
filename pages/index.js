import { useState } from "react";
import { Download, Home, MapPin, Calendar, Eye, Waves } from "lucide-react";

export default function HousePricePredictor() {
  const [formData, setFormData] = useState({
    bedrooms: 3,
    bathrooms: 2,
    sqft_living: 2000,
    sqft_lot: 5000,
    floors: 1,
    waterfront: 0,
    view: 0,
    condition: 3,
    grade: 7,
    sqft_above: 1800,
    sqft_basement: 200,
    yr_built: 1990,
    yr_renovated: 0,
    lat: 47.55,
    long: -122.3,
    sqft_living15: 1900,
    sqft_lot15: 4000,
  });

  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [predictions, setPredictions] = useState([]);

  const fieldLabels = {
    bedrooms: "Dormitorios",
    bathrooms: "Baños",
    sqft_living: "Área habitable (sq ft)",
    sqft_lot: "Área del lote (sq ft)",
    floors: "Pisos",
    waterfront: "Frente al agua (0/1)",
    view: "Vista (0-4)",
    condition: "Condición (1-5)",
    grade: "Calidad (1-13)",
    sqft_above: "Área sobre suelo (sq ft)",
    sqft_basement: "Área sótano (sq ft)",
    yr_built: "Año construcción",
    yr_renovated: "Año renovación",
    lat: "Latitud",
    long: "Longitud",
    sqft_living15: "Área habitable vecinos (sq ft)",
    sqft_lot15: "Área lote vecinos (sq ft)",
  };

  const fieldIcons = {
    bedrooms: "🛏️",
    bathrooms: "🚿",
    sqft_living: "🏠",
    sqft_lot: "🏡",
    floors: "🏢",
    waterfront: "🌊",
    view: "👁️",
    condition: "⭐",
    grade: "📊",
    sqft_above: "⬆️",
    sqft_basement: "⬇️",
    yr_built: "📅",
    yr_renovated: "🔨",
    lat: "🌍",
    long: "🌎",
    sqft_living15: "🏘️",
    sqft_lot15: "🌳",
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: parseFloat(e.target.value) || 0 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // URL de tu API en Render (reemplaza con tu URL real)
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tu-app-backend.onrender.com';
      
      const res = await fetch(`${API_URL}/api/predict`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      
      if (data.status === 'error') {
        throw new Error(data.error);
      }

      setResult(data.precio_estimado);
      
      // Agregar a historial
      const newPrediction = {
        id: Date.now(),
        price: data.precio_estimado,
        data: { ...formData },
        timestamp: new Date().toLocaleString()
      };
      setPredictions(prev => [newPrediction, ...prev.slice(0, 4)]);
      
    } catch (error) {
      console.error("Error:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadResults = () => {
    const data = {
      ultimaPrediccion: result,
      datosIngresados: formData,
      historial: predictions,
      fechaDescarga: new Date().toLocaleString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prediccion-precio-casa-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Fondo animado */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute top-4 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-white mb-4 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            🏠 Predictor de Precios
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Utiliza inteligencia artificial para estimar el valor de tu propiedad con precisión avanzada
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Formulario */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Home className="text-yellow-400" />
                Datos de la Propiedad
              </h2>
              
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {Object.keys(formData).map((key) => (
                    <div key={key} className="group">
                      <label className="block text-sm font-medium text-gray-200 mb-2 flex items-center gap-2">
                        <span className="text-lg">{fieldIcons[key]}</span>
                        {fieldLabels[key]}
                      </label>
                      <input
                        type="number"
                        name={key}
                        value={formData[key]}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300 group-hover:bg-white/25"
                        step={key.includes('lat') || key.includes('long') ? '0.0001' : '1'}
                      />
                    </div>
                  ))}
                </div>
                
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full py-4 px-8 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold text-lg rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Calculando...
                    </span>
                  ) : (
                    "🔮 Predecir Precio"
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Panel de resultados */}
          <div className="space-y-6">
            {/* Resultado principal */}
            {result && (
              <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-3xl p-8 shadow-2xl transform hover:scale-105 transition-all duration-300">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  💰 Precio Estimado
                </h3>
                <div className="text-4xl font-black text-white mb-4">
                  {formatPrice(result)}
                </div>
                <button
                  onClick={downloadResults}
                  className="w-full py-3 px-4 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Download size={20} />
                  Descargar Resultados
                </button>
              </div>
            )}

            {/* Historial */}
            {predictions.length > 0 && (
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  📊 Historial Reciente
                </h3>
                <div className="space-y-3">
                  {predictions.slice(0, 3).map((prediction, index) => (
                    <div key={prediction.id} className="bg-white/20 rounded-xl p-4 hover:bg-white/30 transition-all duration-300">
                      <div className="flex justify-between items-center">
                        <span className="text-white font-semibold">
                          {formatPrice(prediction.price)}
                        </span>
                        <span className="text-xs text-gray-300">
                          {prediction.timestamp}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Información adicional */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-2xl">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                ℹ️ Información
              </h3>
              <div className="text-sm text-gray-300 space-y-2">
                <p>• Predicción basada en machine learning</p>
                <p>• Datos de propiedades similares</p>
                <p>• Actualización en tiempo real</p>
                <p>• Precisión del 85-90%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}