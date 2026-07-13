export type Base = {
  publishedAt: string;
  _id: string;
  _rev: string;
  _type: string;
  _updatedAt: string;
};

export interface Span {
  _key: string;
  _type: 'span';
  marks: string[];
  text: string;
}

export interface Block {
  _key: string;
  _type: 'block';
  children: Span[];
  markDefs: unknown[];
  style: 'normal' | 'h1' | 'h2' | 'h3' | 'h4' | 'blockquote';
}

export interface Reference {
  _ref: string;
  _type: 'reference';
}

export interface Image {
  _type: 'image';
  asset: Reference;
  alt?: string;
}

export interface Slug {
  _type: 'slug';
  current: string;
}

export interface Category extends Base {
  title: string;
  description?: string;
}

export interface Comment {
  approved: boolean;
  comment: string;
  email: string;
  name: string;
  post: {
    _ref: string;
    _type: string;
  };
  _createdAt: string;
  _id: string;
  _rev: string;
  _type: string;
  _updatedAt: string;
}

export interface Post extends Base {
  authorName: string;
  body: Block[];
  mainImage: Image;
  slug: Slug;
  title: string;
  description: string;
  categories?: Category[];
  comments?: Comment[];
}
