import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import doctorAuthRouter from './doctorAuth.js';
import db from '../../db/index.js';
import { supabase } from '../../lib/supabase.js';

vi.mock('../../db/index.js', () => ({
  default: { query: vi.fn() }
}));

// mock pt supabase stuff
vi.mock('../../lib/supabase.js', () => ({
  supabase: {
    auth: {
      signInWithOtp: vi.fn(),
      verifyOtp: vi.fn()
    }
  }
}));

const app = express();
app.use(express.json());
app.use('/auth/doctor', doctorAuthRouter);

describe('Doctor Authentication', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => { });
    vi.spyOn(console, 'error').mockImplementation(() => { });
  });

  describe('POST /request-code', () => {
    const endpoint = '/auth/doctor/request-code';

    it('should return success even if email is invalid (security by obscurity)', async () => {
      (db.query as any).mockResolvedValue({ rows: [] });

      const res = await request(app).post(endpoint).send({ email: 'invalid@test.com' });

      expect(res.body.message).toContain('if the email is valid');
      expect(supabase.auth.signInWithOtp).not.toHaveBeenCalled();
    });

    it('should send OTP for an active doctor', async () => {
      (db.query as any).mockResolvedValue({ rows: [{ user_id: 'doc-123' }] });
      (supabase.auth.signInWithOtp as any).mockResolvedValue({ error: null });

      const res = await request(app).post(endpoint).send({ email: 'active@doctor.com' });

      expect(res.body.message).toContain('login code was sent');
      expect(supabase.auth.signInWithOtp).toHaveBeenCalledWith({
        email: 'active@doctor.com',
        options: { shouldCreateUser: false }
      });
    });

    it('should handle Supabase OTP errors correctly', async () => {
      (db.query as any).mockResolvedValue({ rows: [{ user_id: 'doc-123' }] });
      (supabase.auth.signInWithOtp as any).mockResolvedValue({
        error: { message: 'rate limit exceeded' }
      });

      const res = await request(app).post(endpoint).send({ email: 'doctor@test.com' });

      expect(res.status).toBe(429);
      expect(res.body.error).toBe('rate limit exceeded');
    });
  });

  describe('POST /verify-code', () => {
    const endpoint = '/auth/doctor/verify-code';

    it('should return error if email or code is missing', async () => {
      const res = await request(app).post(endpoint).send({ email: 'test@test.com' });
      expect(res.status).toBe(400);
      expect(res.body.error).toContain('required');
    });

    it('should authorize active doctor with valid code', async () => {
      (supabase.auth.verifyOtp as any).mockResolvedValue({
        data: {
          session: { access_token: 'valid-token' },
          user: { id: 'user-123' }
        },
        error: null
      });

      (db.query as any)
        .mockResolvedValueOnce({
          rows: [{ user_id: 'user-123', role: 'doctor', is_active: true, email: 'doc@test.com' }]
        })
        .mockResolvedValueOnce({
          rows: [{ specialization: 'Chirurgie', hospital_name: 'Spitalul Central' }]
        });

      const res = await request(app).post(endpoint).send({
        email: 'doc@test.com',
        code: '123456'
      });

      expect(res.status).toBe(200);
      expect(res.body.user.role).toBe('doctor');
      expect(res.body.doctor.specialization).toBe('Chirurgie');
      expect(res.body.session.access_token).toBe('valid-token');
    });

    it('should deny access if user is not a doctor', async () => {
      (supabase.auth.verifyOtp as any).mockResolvedValue({
        data: { session: {}, user: { id: 'user-123' } },
        error: null
      });

      (db.query as any).mockResolvedValue({
        rows: [{ user_id: 'user-123', role: 'patient', is_active: true }]
      });

      const res = await request(app).post(endpoint).send({
        email: 'patient@test.com',
        code: '123456'
      });

      expect(res.status).toBe(401);
      expect(res.body.error).toBe('access denied');
    });
  });
});
