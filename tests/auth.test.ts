import request from 'supertest';
import express from 'express';
import session from 'express-session';
import bcrypt from 'bcrypt';
import { User } from '../server/models/User';

// Mock express app for testing
const createTestApp = () => {
  const app = express();
  app.use(express.json());
  app.use(session({
    secret: 'test-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
  }));
  
  // Import routes here
  return app;
};

describe('Authentication Tests', () => {
  let app: express.Application;

  beforeEach(() => {
    app = createTestApp();
  });

  describe('User Registration', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password123!',
        firstName: 'Test',
        lastName: 'User'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user.password).toBeUndefined(); // Password should not be returned
    });

    it('should reject registration with weak password', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: '123', // Weak password
        firstName: 'Test',
        lastName: 'User'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('password');
    });

    it('should reject registration with duplicate email', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password123!',
        firstName: 'Test',
        lastName: 'User'
      };

      // First registration
      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      // Second registration with same email
      const response = await request(app)
        .post('/api/auth/register')
        .send({ ...userData, username: 'testuser2' })
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('already exists');
    });
  });

  describe('User Login', () => {
    beforeEach(async () => {
      // Create test user
      const hashedPassword = await bcrypt.hash('Password123!', 12);
      await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: hashedPassword,
        firstName: 'Test',
        lastName: 'User',
        isEmailVerified: true
      });
    });

    it('should login with valid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'Password123!'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.user.email).toBe(loginData.email);
      expect(response.headers['set-cookie']).toBeDefined();
    });

    it('should reject login with invalid password', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'WrongPassword!'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid');
    });

    it('should reject login for non-existent user', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'Password123!'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('Session Management', () => {
    it('should maintain session after login', async () => {
      // Test session persistence
      const agent = request.agent(app);
      
      // Login
      await agent
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Password123!'
        })
        .expect(200);

      // Access protected route
      const response = await agent
        .get('/api/auth/user')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.user).toBeDefined();
    });

    it('should logout successfully', async () => {
      const agent = request.agent(app);
      
      // Login first
      await agent
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Password123!'
        })
        .expect(200);

      // Logout
      const response = await agent
        .post('/api/auth/logout')
        .expect(200);

      expect(response.body.success).toBe(true);

      // Try to access protected route after logout
      await agent
        .get('/api/auth/user')
        .expect(401);
    });
  });

  describe('Input Sanitization', () => {
    it('should reject SQL injection attempts', async () => {
      const maliciousData = {
        email: "test@example.com'; DROP TABLE users; --",
        password: 'Password123!'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(maliciousData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should reject XSS attempts in registration', async () => {
      const xssData = {
        username: '<script>alert("xss")</script>',
        email: 'test@example.com',
        password: 'Password123!',
        firstName: '<img src=x onerror=alert(1)>',
        lastName: 'User'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(xssData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });
});