
import { validateCredentials, signToken } from '@/lib/auth';
import { validateLoginData } from '@/lib/validation';
import { AuthResponse } from '@/types/api';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // Validate input
    const validationErrors = validateLoginData(username, password);
    if (validationErrors.length > 0) {
      return Response.json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors.map(e => e.message)
      } as AuthResponse, { status: 400 });
    }

    // Validate credentials
    const user = validateCredentials(username, password);
    if (!user) {
      return Response.json({
        success: false,
        message: 'Username atau password salah'
      } as AuthResponse, { status: 401 });
    }

    // Generate token
    const token = await signToken(user);

    return Response.json({
      success: true,
      token,
      user,
      message: 'Login berhasil'
    } as AuthResponse);

  } catch (error) {
    console.error('Auth error:', error);
    return Response.json({
      success: false,
      message: 'Internal server error'
    } as AuthResponse, { status: 500 });
  }
}

