import { query } from '@/helpers/database';

export const citiesService = {
  // Buscar cidades de um usuário
  async getCitiesByUser(userId) {
    try {
      const result = await query(
        'SELECT * FROM cities WHERE user_id = $1 ORDER BY created_at DESC',
        [userId]
      );
      
      return {
        success: true,
        cities: result.rows
      };
    } catch (error) {
      console.error('Erro ao buscar cidades:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Adicionar nova cidade
  async addCity(userId, cityData) {
    try {
      const { name, valorInvestido, conversas, custoPorResultado, image } = cityData;
      
      const result = await query(
        'INSERT INTO cities (user_id, name, valor_investido, conversas, custo_por_resultado, image) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [userId, name, valorInvestido, conversas, custoPorResultado, image]
      );
      
      return {
        success: true,
        city: result.rows[0]
      };
    } catch (error) {
      console.error('Erro ao adicionar cidade:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Atualizar cidade
  async updateCity(cityId, userId, cityData) {
    try {
      const { name, valorInvestido, conversas, custoPorResultado, image } = cityData;
      
      const result = await query(
        'UPDATE cities SET name = $1, valor_investido = $2, conversas = $3, custo_por_resultado = $4, image = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 AND user_id = $7 RETURNING *',
        [name, valorInvestido, conversas, custoPorResultado, image, cityId, userId]
      );
      
      if (result.rows.length === 0) {
        return {
          success: false,
          error: 'Cidade não encontrada ou você não tem permissão para editá-la'
        };
      }
      
      return {
        success: true,
        city: result.rows[0]
      };
    } catch (error) {
      console.error('Erro ao atualizar cidade:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Deletar cidade
  async deleteCity(cityId, userId) {
    try {
      const result = await query(
        'DELETE FROM cities WHERE id = $1 AND user_id = $2 RETURNING *',
        [cityId, userId]
      );
      
      if (result.rows.length === 0) {
        return {
          success: false,
          error: 'Cidade não encontrada ou você não tem permissão para deletá-la'
        };
      }
      
      return {
        success: true,
        message: 'Cidade deletada com sucesso'
      };
    } catch (error) {
      console.error('Erro ao deletar cidade:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
};

export default citiesService;
