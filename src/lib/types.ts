export interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
}

export interface ApiFailure {
  success: false;
  message: string;
  errors: { field?: string; message: string }[] | unknown[];
}

export type ApiEnvelope<T> = ApiSuccess<T> | ApiFailure;

export interface AdminSummary {
  id: string;
  email: string;
  name: string | null;
}

export interface Realisation {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  client: string | null;
  category: string;
  technologies: string[];
  coverImage: string;
  gallery: string[];
  projectUrl: string | null;
  completionDate: string | null;
  featured: boolean;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Formation {
  id: string;
  title: string;
  description: string;
  image: string;
  duration: string;
  price: string; // Prisma Decimal serializes as a string
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Contact {
  id: number;
  email: string;
  phone: string | null;
  whatsapp: string | null;
  location: string | null;
  availability: string | null;
  cvUrl: string | null;
  updatedAt: string | null;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  active: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  company: string | null;
  rating: number;
  comment: string;
  image: string | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}
