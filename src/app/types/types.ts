import { JwtPayload } from 'jsonwebtoken';

export interface JwtCustomPayload extends JwtPayload {
  id: string;
  role: string;
}
