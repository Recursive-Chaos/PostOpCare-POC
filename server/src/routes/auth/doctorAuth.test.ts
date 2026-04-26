import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import doctorAuthRouter from './doctorAuth.js';

// mock pt baza de date
vi.mock('../../db/index.js', () => ({
  default: {
    query: vi.fn()
  }
}));

// mock pt Supabase
vi.mock('../../lib/supabase.js', () => ({
  supabase: {
    auth: {
      signInWithOtp: vi.fn(),
      verifyOtp: vi.fn()
    }
  }
}));

import db from '../../db/index.js';
import { supabase } from '../../lib/supabase.js';

const app = express();
app.use(express.json());
app.use('/auth/doctor', doctorAuthRouter);

describe('Doctor Auth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fail generic la email invalid', async () => {
    (db.query as any).mockResolvedValue({ rows: [] });

    const res = await request(app)
      .post('/auth/doctor/request-code')
      .send({ email: 'pacient@test.com' });

    expect(res.body.message).toBe('if the email is valid, a login code was sent');
    expect(supabase.auth.signInWithOtp).not.toHaveBeenCalled();
  });

  it('succes la medic activ', async () => {
    (db.query as any).mockResolvedValue({ rows: [{ user_id: '123' }] });

    const res = await request(app)
      .post('/auth/doctor/request-code')
      .send({ email: 'medic@test.com' });

    expect(res.body.message).toBe('if the email is valid, a login code was sent');
    expect(supabase.auth.signInWithOtp).toHaveBeenCalledWith({
      email: 'medic@test.com',
      options: { shouldCreateUser: false }
    });
  });
});
