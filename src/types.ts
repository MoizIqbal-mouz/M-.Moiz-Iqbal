export interface User {
  id: number;
  username: string;
  role: 'customer' | 'staff';
  email: string;
  country?: string;
}

export interface Order {
  id: string;
  userId: number;
  items: any[];
  total: number;
  status: 'pending' | 'cancelled' | 'shipped';
  createdAt: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
}

export interface Notification {
  id: number;
  message: string;
  targetRole: string;
  createdAt: string;
}
