import React, { useState, useEffect, memo } from 'react';
import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const AdsTable = memo(({ selectedCity }) => {
  const [adsData, setAdsData] = useState([]);

  useEffect(() => {
    const loadAdsData = () => {
      const savedData = localStorage.getItem('ads-data');
      if (savedData) {
        try {
          const data = JSON.parse(savedData);
          setAdsData(data);
        } catch (error) {
          console.error('Erro ao carregar dados de anúncios:', error);
          setAdsData([]);
        }
      }
    };

    loadAdsData();

    const handleAdsDataUpdate = () => {
      loadAdsData();
    };

    window.addEventListener('adsDataUpdated', handleAdsDataUpdate);

    return () => {
      window.removeEventListener('adsDataUpdated', handleAdsDataUpdate);
    };
  }, []);

  // Filtrar dados de forma simples
  const getFilteredData = () => {
    if (!adsData || adsData.length === 0) {
      return [];
    }
    
    if (selectedCity && selectedCity.id) {
      return adsData.filter(ad => ad.cityId === selectedCity.id);
    }
    
    return adsData.slice(0, 5);
  };

  const filteredData = getFilteredData();

  return (
    <div className="table-responsive table-centered">
      <style>
        {`
          .alcance-azul {
            color: #1c84ee !important;
          }
          .conversas-amarelo {
            color: #fed03d !important;
          }
        `}
      </style>
      <Table className="table mb-0">
        <thead>
          <tr>
            <th className="ps-3">Prévia</th>
            <th>Alcance</th>
            <th>Conversas Iniciadas</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((item, idx) => (
              <tr key={`ad-${item.id}-${idx}`}>
                <td className="ps-3">
                  <img 
                    src={item.preview} 
                    alt="Preview" 
                    className="img-fluid" 
                    style={{ width: '100px', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/100x150/6c757d/ffffff?text=?';
                    }}
                  />
                </td>
                <td>
                  <span className="alcance-azul">{item.alcance}</span>
                </td>
                <td className="conversas-amarelo fw-bold">{item.conversasIniciadas}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center text-muted py-4">
                {selectedCity ? `Nenhum anúncio encontrado para ${selectedCity.name}` : 'Nenhum anúncio cadastrado'}
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
});

AdsTable.displayName = 'AdsTable';

export default AdsTable;
