import { CommentStatus, PostStatus } from "../../../generated/prisma/enums";
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

const getPostStatsFromDB = async () => {
    const transactionResult = await prisma.$transaction(
        async (tx) => {
            const [
                totalPosts,
                totalPublishedPosts,
                totalDraftedPost,
                totalArchivedPosts,
                totalComments,
                totalApprovedComments,
                totalRejectedComments,
                totalPostViewsAggregate
            ] = await Promise.all([
                await tx.post.count(),
                await tx.post.count({
                    where: {
                        status: PostStatus.PUBLISHED
                    }
                }),
                await tx.post.count({
                    where: {
                        status: PostStatus.DRAFT
                    }
                }),
                await tx.post.count({
                    where: {
                        status: PostStatus.ARCHIVED
                    }
                }),

                await tx.comment.count(),
                await tx.comment.count({
                    where: {
                        status: CommentStatus.APPROVED
                    }
                }),
                await tx.comment.count({
                    where: {
                        status: CommentStatus.REJECT
                    }
                }),

                await tx.post.aggregate({
                    _sum: {
                        views: true
                    }
                }),
            ]);

            return {
                totalPosts,
                totalPublishedPosts,
                totalDraftedPost,
                totalArchivedPosts,
                totalComments,
                totalApprovedComments,
                totalRejectedComments,
                totalViews: totalPostViewsAggregate._sum.views
            }
        }
    );

    return transactionResult;
};

const getSinglePostFromDB = async (postId: string) => {
    const transactionResult = await prisma.$transaction(
        async (tx) => {
            await tx.post.update({
                where: { id: postId },
                data: {
                    views: {
                        increment: 1
                    },
                },
            });

            const post = await tx.post.findUniqueOrThrow({
                where: {
                    id: postId
                },
                include: {
                    author: {
                        omit: {
                            password: true
                        }
                    },
                    comments: {
                        where: {
                            status: CommentStatus.APPROVED
                        },
                    },
                },
            });

            return post;
        }
    );

    return transactionResult;
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
    getPostStatsFromDB,
    getSinglePostFromDB,
    updatePostFromDB,
    deletePostFromDB
};