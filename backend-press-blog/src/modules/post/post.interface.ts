import { PostStatus } from "../../../generated/prisma/enums";

export interface IPost {
    title: string;
    content: string;
    thumbnail?: string;
    isFeatured?: boolean;
    status?: PostStatus;
    tags: string[];
}

export interface IPostUpdate {
    title?: string;
    content?: string;
    thumbnail?: string;
    isFeatured?: boolean;
    status?: PostStatus;
    tags: string[];
}