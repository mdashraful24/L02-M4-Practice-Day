import { prisma } from "../../lib/prisma";
import { SelfErrorHandler } from "../../utils/handleErrors";
import { IPost, IPostUpdate } from "./post.interface";

const createPostIntoDB = async (payLoad: IPost, userId: string) => {
    const post = await prisma.post.create({
        data: {
            ...payLoad,
            authorId: userId
        }
    });

    return post;
};

const getAllPostsFromDB = async () => {
    const posts = await prisma.post.findMany({
        include: {
            author: {
                omit: {
                    id: true,
                    email: true,
                    password: true,
                    activeStatus: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true
                }
            },
            comment: true
        }
    });

    return posts;
};

const getMyPostFromDB = async (authorId: string) => {
    const myPost = await prisma.post.findMany({
        where: { authorId },
        orderBy: {
            createdAt: "desc"
        },
        include: {
            comments: true,
            author: {
                omit: {
                    password: true
                }
            },
            _count: {
                select: {
                    comments: true
                }
            }
        }
    });

    return myPost;
};

const updatePostFromDB = async (postId: string, authorId: string, isAdmin: boolean, payload: IPostUpdate) => {
    const findPost = await prisma.post.findUniqueOrThrow({
        where: { id: postId }
    });

    if (findPost.authorId !== authorId && !isAdmin) {
        throw new SelfErrorHandler("You are not eligible to update this post");
    }

    const post = await prisma.post.update({
        where: {
            id: postId
        },
        data: payload,
        include: {
            author: {
                omit: {
                    id: true,
                    password: true,
                    activeStatus: true,
                    // role: true,
                    createdAt: true,
                    updatedAt: true
                }
            },
            comments: true
        }
    });

    return post;
};

const deletePostFromDB = async (postId: string, authorId: string, isAdmin: boolean) => {
    const findPost = await prisma.post.findUniqueOrThrow({
        where: { id: postId }
    });

    if (findPost.authorId !== authorId && !isAdmin) {
        throw new SelfErrorHandler("You are not eligible to update this post");
    }

    await prisma.post.delete({
        where: { id: postId }
    });

    return null;
};


export const postService = {
    createPostIntoDB,
    getAllPostsFromDB,
    getMyPostFromDB,
    updatePostFromDB,
    deletePostFromDB
};