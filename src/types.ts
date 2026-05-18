/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Movie {
  id: number;
  title: string;
  name?: string; // For compatibility
  overview: string;
  posterPath: string;
  backdropPath: string;
  releaseDate: string;
  voteAverage: number;
  mediaType: 'movie' | 'tv';
  // Custom fields
  videoUrl?: string;
  trailerUrl?: string;
  author?: string;
  director?: string;
  dubbers?: string;
  category?: string;
  isExplicit?: boolean;
  ageRating?: number;
}

export interface Series {
  id: number;
  name: string;
  title?: string; // For compatibility
  overview: string;
  posterPath: string;
  backdropPath: string;
  firstAirDate: string;
  voteAverage: number;
  mediaType: 'tv';
  // Custom fields
  videoUrl?: string;
  trailerUrl?: string;
  author?: string;
  director?: string;
  dubbers?: string;
  category?: string;
  isExplicit?: boolean;
  ageRating?: number;
}

export type Content = Movie | Series;

export interface Comment {
  id: string;
  userId: string;
  username: string;
  avatarUrl?: string;
  contentId?: string;
  contentTitle?: string;
  category?: string;
  text: string;
  rating?: number; // 0-5
  timestamp: string;
  likes: number;
}

export interface SocialPost {
  id: string;
  userId: string;
  username: string;
  videoUrl: string;
  thumbnailUrl: string;
  description: string;
  contentTitle: string;
  tags: string[];
  likes: number;
  views: number;
  comments: number;
  isExplicit: boolean;
  monetizationEnabled: boolean;
  earnings?: number;
}

export interface UserProfile {
  id: string;
  username: string;
  email?: string;
  bio: string;
  avatarUrl: string;
  subscribers: number;
  totalViews: number;
  totalEarnings: number;
  posts: SocialPost[];
  playlists?: { id: string; name: string; items: string[] }[];
  wishlist?: string[]; // IDs of content
  youtubeLink?: string;
  externalLinks?: { label: string; url: string }[];
}

export type CommunityCategory = 'All' | 'Discussion' | 'Review' | 'Theory' | 'News';

export type ViewType = 'home' | 'community' | 'social' | 'profile' | 'judy';

export function getTitle(content: Content): string {
  return content.title || content.name || '';
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}
