export type Role = 'ADMIN' | 'USER';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  createdAt: string;
}

export interface Photo {
  id: string;
  url: string;
  entryId: string;
}

export interface Entry {
  id: string;
  name: string;
  location: string;
  latitude?: number | null;
  longitude?: number | null;
  medianPrice: string;
  description: string;
  photos: Photo[];
  createdBy?: { id: string; name: string };
  userId: string;
  createdAt: string;
  updatedAt: string;
}
