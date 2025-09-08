import { query } from '@/helpers/database';
import bcrypt from 'bcryptjs';

export const authService = {
  // Registrar novo usuário
  async register(userData) {
    try {
      const { name, email, password } = userData;
      
      // Verificar se o email já existe
      const existingUser = await query(
        'SELECT id FROM users WHERE email = $1',
        [email]
      );
      
      if (existingUser.rows.length > 0) {
        throw new Error('Email já está em uso');
      }
      
      // Hash da senha
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      // Criar usuário
      const result = await query(
        'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
        [name, email, hashedPassword]
      );
      
      return {
        success: true,
        user: result.rows[0]
      };
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Fazer login
  async login(email, password) {
    try {
      // Buscar usuário por email
      const result = await query(
        'SELECT id, name, email, password FROM users WHERE email = $1',
        [email]
      );
      
      if (result.rows.length === 0) {
        throw new Error('Email ou senha incorretos');
      }
      
      const user = result.rows[0];
      
      // Verificar senha
      const isValidPassword = await bcrypt.compare(password, user.password);
      
      if (!isValidPassword) {
        throw new Error('Email ou senha incorretos');
      }
      
      // Retornar dados do usuário (sem a senha)
      const { password: _, ...userWithoutPassword } = user;
      
      return {
        success: true,
        user: userWithoutPassword
      };
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Buscar usuário por ID
  async getUserById(userId) {
    try {
      const result = await query(
        'SELECT id, name, email, avatar, created_at FROM users WHERE id = $1',
        [userId]
      );
      
      if (result.rows.length === 0) {
        throw new Error('Usuário não encontrado');
      }
      
      return {
        success: true,
        user: result.rows[0]
      };
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Atualizar perfil do usuário
  async updateProfile(userId, userData) {
    try {
      const { name, avatar } = userData;
      
      const result = await query(
        'UPDATE users SET name = $1, avatar = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING id, name, email, avatar',
        [name, avatar, userId]
      );
      
      if (result.rows.length === 0) {
        throw new Error('Usuário não encontrado');
      }
      
      return {
        success: true,
        user: result.rows[0]
      };
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Alterar senha
  async changePassword(userId, currentPassword, newPassword) {
    try {
      // Buscar usuário atual
      const userResult = await query(
        'SELECT password FROM users WHERE id = $1',
        [userId]
      );
      
      if (userResult.rows.length === 0) {
        throw new Error('Usuário não encontrado');
      }
      
      // Verificar senha atual
      const isValidPassword = await bcrypt.compare(currentPassword, userResult.rows[0].password);
      
      if (!isValidPassword) {
        throw new Error('Senha atual incorreta');
      }
      
      // Hash da nova senha
      const saltRounds = 10;
      const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
      
      // Atualizar senha
      await query(
        'UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [hashedNewPassword, userId]
      );
      
      return {
        success: true,
        message: 'Senha alterada com sucesso'
      };
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
};

export default authService;
