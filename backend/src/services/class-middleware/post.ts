import { RES_FORM } from '../../config/constants';

import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;

/** FindClass and have classInstance in req */
async function getFeedInstanceFromClassInstance(
    req: Request,
    res: Response,
    next: NextFunction
) {
    let feedInstance = await global.DBConnection.Feed.findOne({
        class_ref: req.classInstance._id,
    });
    if (!feedInstance) {
        // Create a new Feed for class
        try {
            let newFeed = new global.DBConnection.Feed({
                class_ref: new ObjectId(req.classInstance._id),
                posts: [],
            });
            await newFeed.save();
            req.classInstance.feed_ref = new ObjectId(newFeed._id);
            await req.classInstance.save();
            req.feedInstance = newFeed;
            next();
        } catch (e) {
            res.status(400);
            res.json(
                RES_FORM(
                    400,
                    'Error when creating feed for class. Err:' +
                        (e as Error).message
                )
            );
            return;
        }
    } else {
        req.feedInstance = feedInstance;
        next();
    }
}

/** Tien quyet: validateToken, validateClassMember, findClassByClassId, findFeed
 * req.senderInstance, req.body.content, req.feedInstance
 */
async function getPostInstance(
    req: Request,
    res: Response,
    next: NextFunction
) {
    let sender = req.senderInstance;
    let postId = req.params.postId;
    let postInstance = await global.DBConnection.Post.findOne({ _id: postId });
    if (!postInstance) {
        res.status(404);
        res.json(RES_FORM(404, 'Post not found'));
        return;
    }
    // await req.classInstance.populate('feed_ref');
    var foundInClass = false;
    for (var i of req.feedInstance.posts) {
        if (i.toHexString() == postInstance._id.toHexString()) {
            foundInClass = true;
            break;
        }
    }
    if (!foundInClass) {
        res.status(404);
        res.json(RES_FORM(404, 'Post found but not in your class'));
    }
    req.postInstance = postInstance;
    next();
}

/** Tien quyet: validateToken, validateClassMember, findClassByClassId, getFeedInstanceFromClassInstance
 * req.senderInstance, feedInstance, req.body.content
 */
async function fPostToFeed(req: Request, res: Response) {
    let sender = req.senderInstance;
    if (!sender) {
        res.status(401);
        res.json(RES_FORM(401, 'Unauthorized'));
        return;
    }
    let feedInstance = req.feedInstance;
    let postContent = req.body.content;
    let post = null;
    try {
        post = new global.DBConnection.Post({
            from: new ObjectId(sender._id),
            content: postContent,
            created_date: req.body.created_date
                ? req.body.created_date
                : new Date().getTime(),
            comment: [],
        });
        await post.save();
    } catch (e) {
        res.status(400);
        res.json(
            RES_FORM(
                400,
                'Error when creating new post to class feed. Err: ' +
                    (e as Error).message
            )
        );
        return;
    }
    try {
        feedInstance.posts.push(new ObjectId(post._id));
        await feedInstance.save();
    } catch (e) {
        res.status(400);
        res.json(
            RES_FORM(
                400,
                'Error when push post to feed instance. Err : ' +
                    (e as Error).message
            )
        );
    }
    try {
        await post.populate('from');
        (global as any).IOConnection.notifyNewPost(
            post,
            req.classInstance.class_id
        );
    } catch (e) {
        console.log('Socket.io emit NewPost event fail');
    }

    res.status(200);
    res.json(RES_FORM(200, 'Success', post));
}

/** Tien quyet: validateToken, validateClassMember, findClassByClassId, getPostInstance
 * req.senderInstance, req.body.content, req.postInstance
 */
async function fCommentToPost(req: Request, res: Response) {
    let sender = req.senderInstance;
    if (!sender) {
        res.status(401);
        res.json(RES_FORM(401, 'Unauthorized'));
        return;
    }
    let post = req.postInstance;
    let newComment = null;
    try {
        newComment = new global.DBConnection.Comment({
            from: new ObjectId(sender._id),
            content: req.body.content,
        });
        await newComment.save();
        await newComment.populate('from');
    } catch (e) {
        res.status(400);
        res.json(
            RES_FORM(
                400,
                'Error when creating comment. Err: ' + (e as Error).message
            )
        );
        return;
    }
    try {
        post.comments.push(newComment);
        await post.save();
        await post.populate('comments');
        (global as any).IOConnection.notifyNewComment(
            newComment,
            req.params.postId,
            req.classInstance.class_id
        );
    } catch (e) {
        res.status(400);
        res.json(
            RES_FORM(
                400,
                'Error when pushing comment to post. Err: ' +
                    (e as Error).message
            )
        );
        return;
    }

    res.status(200);
    res.json(RES_FORM(200, 'Success', post));
}
async function fLikePost(req: Request, res: Response) {
    let sender = req.senderInstance;
    if (!sender) {
        res.status(401);
        res.json(RES_FORM(401, 'Unauthorized'));
        return;
    }
    let post = req.postInstance;
    try {
        // post.comments.push(newComment);
        // await post.save();
        // await post.populate('comments');
        // global.IOConnection.notifyNewComment(newComment, req.params.postId, req.classInstance.class_id);
        var set = new Set();
        let temp = post.liked;
        let liked = false;
        let new_liked: any[] = [];
        for (let i of temp) {
            if (i.toHexString() == sender._id.toHexString()) {
                liked = true;
                continue;
            }
            set.add(i.toHexString());
        }
        if (!liked) set.add(sender._id.toHexString());
        for (let i of set) {
            new_liked.push(new ObjectId(i as string));
        }
        post.liked = new_liked;
        await post.save();
        await post.populate({
            path: 'comments',
            populate: {
                path: 'from',
            },
        });
        await post.populate('liked');
        await post.populate('from');
        (global as any).IOConnection.notifyUpdatePost(
            post,
            req.classInstance.class_id
        );
    } catch (e) {
        res.status(400);
        res.json(
            RES_FORM(400, 'Lỗi khi like post. Err: ' + (e as Error).message)
        );
        return;
    }

    res.status(200);
    res.json(RES_FORM(200, 'Success', ''));
}

/** validateToken, findClassByClassId, validateClassMember, getPostInstance
 * req.senderInstance, classInstance, postInstance
 * params.classId, params.postId
 */
async function fGetCommentsInPost(req: Request, res: Response) {
    let post = req.postInstance;
    await post.populate({
        path: 'comments',
        populate: {
            path: 'from',
        },
    });
    res.status(200);
    res.json(RES_FORM(200, 'Success', post.comments));
}

/** validateToken, findClassByClassId, validateClassMember, getFeedInstanceFromClassInstance, getPostInstance
 *  req.params.classId, req.params.postId, req.postInstance, req.classInstance, req.senderInstance
 */
async function fGetPostById(req: Request, res: Response) {
    await req.postInstance.populate('comments');
    await req.postInstance.populate('from');
    res.status(200);
    res.json(RES_FORM(200, 'Success', req.postInstance));
}

/** validateToken, findClassByClassId, validateClassMember, getFeedInstanceFromClassInstance
 * req.params.classId,
 * req.classInstance, req.senderInstance
 */
async function fGetAllPost(req: Request, res: Response) {
    // await req.feedInstance.populate({
    //     path: "posts",
    //     populate: {
    //         path: "comments",
    //         populate : {
    //             path : "from"
    //         }
    //     }
    // });
    let feed = await req.feedInstance.populate({
        path: 'posts',
        populate: {
            path: 'from',
        },
    });
    feed = feed.posts;
    for (let i of feed) {
        await i.populate({
            path: 'comments',
            populate: {
                path: 'from',
            },
        });
        await i.populate({
            path: 'liked',
        });
    }
    res.status(200);
    res.json(RES_FORM(200, 'Success', req.feedInstance.posts));
}
export {
    fCommentToPost,
    fGetAllPost,
    fGetCommentsInPost,
    fGetPostById,
    fLikePost,
    fPostToFeed,
    getFeedInstanceFromClassInstance,
    getPostInstance,
};
