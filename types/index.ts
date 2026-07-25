export interface User {
  id: string;
  email: string;
  pen_name: string;
  photo?: string;
  bio?: string;
}

export interface Writer {
  id: string;
  pen_name?: string;
}

export interface Work {
  id: string;
  title: string;
  body: string;
  categories: string[];
  writer: Writer;
  reader_count?: number;
  rating_count?: number;
  bookmarked?: boolean;
}

export interface CreateWorkPayload {
  title: string;
  body: string;
  categories: string[];
}

export interface UpdateWorkPayload {
  title: string;
  body: string;
  categories: string[];
}

export interface UpdateUserPayload {
  pen_name: string;
  photo: string;
  bio: string;
}
