import httpStatus from 'http-status';
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { postService } from "./post.service";
import { SelfErrorHandler } from '../../utils/handleErrors';

const createPost = catchAsync(async (req, res) => {
    const id = req.user?.id;

    const result = await postService.createPostIntoDB(req.body, id as string);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Post created successfully",
        data: result
    });
});

const getAllPosts = catchAsync(async (req, res) => {
    const result = await postService.getAllPostsFromDB();

    if (result.length === 0) {
        throw new SelfErrorHandler("Post not found", httpStatus.NOT_FOUND);
    }

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "All post fetched successfully",
        data: result
    });
});

const getMyPost = catchAsync(async (req, res) => {
    const authorId = req.user?.id;

    const result = await postService.getMyPostFromDB(authorId as string);

    if (result.length === 0) {
        throw new SelfErrorHandler("Post not found", httpStatus.NOT_FOUND);
    }

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "My Post retrieved successfully",
        data: result
    });
});

const getSinglePost = catchAsync(async(req, res)=>{
    const postId = req.params.postId;

    if (!postId) {
        throw new SelfErrorHandler("Post id required in params");
    }

    const result = await postService.getSinglePostFromDB(postId as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Single post retrieved successfully",
        data: result
    });
});

const updatePost = catchAsync(async(req, res)=>{
    const postId = req.params.postId as string;
    const authorId = req.user?.id as string;
    const isAdmin = req.user?.role === "ADMIN";

    if(!postId){
        throw new SelfErrorHandler("Post id required in params");
    }

    const result = await postService.updatePostFromDB(postId, authorId, isAdmin, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Post updated successfully",
        data: result
    });
});

const deletePost = catchAsync(async(req, res )=>{
    const postId = req.params.postId as string;
    const authorId = req.user?.id as string;
    const isAdmin = req.user?.role === "ADMIN";

    if (!postId) {
        throw new SelfErrorHandler("Post id required in params");
    }

    const result = await postService.deletePostFromDB(postId, authorId, isAdmin);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Post deleted successfully",
        data: result
    });
});


export const postController = {
    createPost,
    getAllPosts,
    getMyPost,
    getSinglePost,
    updatePost,
    deletePost
};