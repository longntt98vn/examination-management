import { v4 as uuidv4 } from 'uuid';
import csv from 'csvtojson/v2';
import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';

const ObjectId = mongoose.Types.ObjectId;

async function fCreateClass(req: Request, res: Response) {
    let senderVNUId = (req as any).senderVNUId;
    if ((req as any).senderInstance.role !== 'teacher') {
        res.status(404);
        res.json({
            status: 'Error',
            message:
                'Permission Denied, role != teacher nhung lai tao class ???',
        });
    } else {
        try {
            let newClass = new global.DBConnection.Class({
                class_id: uuidv4(),
                class_name: req.body.class_name,
                class_teacher: new ObjectId((req as any).senderInstance._id),
            });
            await newClass.save();
            res.status(200);
            res.json({
                status: 'Success',
                message: 'Tao lop thanh cong',
            });
        } catch (e) {
            res.status(400);
            res.json({
                status: 'Error',
                message: 'Xay ra loi trong viec tao lop',
            });
        }
    }
}

/** Tiên quyết : có params classId, đã authenticate token và có instance user
 * Gán classInstance vào req
 */
async function findClassByClassId(
    req: Request,
    res: Response,
    next: NextFunction
) {
    let classId = req.params.classId;
    try {
        let classInstance = await global.DBConnection.Class.findOne({
            class_id: classId,
        });
        if (!classInstance) {
            res.status(404);
            res.json({ status: 'Error', message: 'Class not found' });
        } else {
            (req as any).classInstance = classInstance;
            next();
        }
    } catch (e) {
        res.status(404);
        res.json({ status: 'Error', message: 'UnknownError' });
    }
}
/** Tiên quyết đã findClassByClassId */
async function fFindClassByClassId(
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.log(req.query);
    await (req as any).classInstance.populate('class_teacher');
    if (!req.query.without_member)
        await (req as any).classInstance.populate('class_members');
    if (req.query.teacher) {
        res.status(200);
        res.json((req as any).classInstance.class_teacher);
        return;
    }

    res.status(200);
    res.json((req as any).classInstance);
}

/** Tiên quyết: có class Instance (find class rồi), đã authen token, có instance user, senderVNUId */
async function validateClassTeacher(
    req: Request,
    res: Response,
    next: NextFunction
) {
    var classInstance = await (req as any).classInstance.populate(
        'class_teacher'
    );
    if (classInstance.class_teacher.vnu_id == (req as any).senderVNUId) {
        next();
    } else {
        res.status(400);
        res.json({
            status: 'Error',
            message: 'You are not teacher in this class',
        });
    }
}

/** Tiên quyết: đã authentoken, có senderInstance, có classInstance */
function validateClassMember(req: Request, res: Response, next: NextFunction) {
    var classInstance = (req as any).classInstance;
    if (
        classInstance.class_members.includes((req as any).senderInstance._id) ||
        classInstance.class_teacher.equals((req as any).senderInstance._id)
    ) {
        next();
    } else {
        res.status(400);
        res.json({
            status: 'Error',
            message: "You aren't a member in this class",
        });
    }
}

/** Tiên quyết: đã findClass( có class Instance ) */
async function fGetMemberBasicInfors(req: Request, res: Response) {
    let classInstance = await (req as any).classInstance.populate(
        'class_members'
    );
    let limit = req.query.limit as any;
    if (limit > classInstance.class_members.length)
        limit = classInstance.class_members.length;
    let classMembers = classInstance.class_members.slice(0, limit);

    // let members = await global.DBConnection.User.find({ vnu_id: {$in : classMembers}}).limit(parseInt(limit));
    res.status(200);
    res.json({ status: 'Success', data: classMembers });
}

/** Tiên quyết: Body có danh sách emails của các members cần add (Array)
 *  Có classInstance (đã có findClassById, body có classId)
 */
async function fAddMembersToClass(req: Request, res: Response) {
    let membersVNUEmails: string[] = [];
    try {
        membersVNUEmails = JSON.parse(req.body.members);
    } catch (e) {
        res.status(400);
        res.json({
            Status: 'Error',
            Message: 'Array Members Invalid',
        });
        return;
    }

    var curMembers = (req as any).classInstance.class_members;
    var set = new Set();
    for (var i = 0; i < curMembers.length; i++) {
        set.add(curMembers[i].toHexString());
        console.log(curMembers[i].toHexString());
    }
    let instances = await global.DBConnection.User.find({
        email: { $in: membersVNUEmails },
    });
    // if (instance) {
    //     curMembers.push(memberVNUId);
    // }
    var check: { [key: string]: boolean } = {};
    var added: any[] = [];
    for (let i of membersVNUEmails) {
        check[i] = false;
    }
    for (let instance of instances) {
        check[instance.email] = true;
        var oldLength = set.size;
        set.add(instance._id.toHexString());
        var newLength = set.size;
        if (oldLength == newLength) check[instance.email] = false;
    }
    (req as any).classInstance.class_members = [];
    for (let instance of set) {
        (req as any).classInstance.class_members.push(
            new ObjectId(instance as string)
        );
    }
    await (req as any).classInstance.save();
    var notFound: any[] = [];
    for (let [key, value] of Object.entries(check)) {
        if (!value)
            notFound.push({
                email: key,
                error: 'Email không tồn tại trong hệ thống hoặc đã được thêm rồi',
            });
        else added.push({ email: key });
    }
    await (req as any).classInstance.populate('class_members');
    res.status(200);
    res.json({
        status: 'Success',
        data: {
            members: (req as any).classInstance.class_members,
            registered: added,
            failed: notFound,
        },
    });
}

async function fGetCurClasses(req: Request, res: Response) {
    var sender = (req as any).senderInstance;
    if (sender.role == 'teacher') {
        var classes = await global.DBConnection.Class.find({
            class_teacher: sender._id,
        });
        res.status(200);
        res.json({ status: 'Success', data: classes });
    } else if (sender.role == 'student') {
        var classes = await global.DBConnection.Class.find({
            class_members: sender._id,
        });
        res.status(200);
        res.json({ status: 'Success', data: classes });
    }
}

/**Tiên quyết : findClassByClassId => validateClassTeacher */
async function fDeleteMemberInClass(req: Request, res: Response) {
    let membersVNUId: string[] = [];
    try {
        membersVNUId = JSON.parse(req.body.members);
    } catch (e) {
        res.status(400);
        res.json({ status: 'Error', message: 'Array members invalid' });
        return;
    }
    await (req as any).classInstance.populate('class_members');
    let curMembers = (req as any).classInstance.class_members;
    let deleted: any[] = [];
    let deletedIndex: boolean[] = [];
    // let fail = [];
    for (var i of curMembers) {
        let index = membersVNUId.indexOf(i.vnu_id);
        if (index != -1) {
            membersVNUId.splice(index, 1);
            deletedIndex.push(true);
            deleted.push(i);
            continue;
        }
        deletedIndex.push(false);
    }
    let newMembers: any[] = [];
    for (var j in curMembers) {
        if (!deletedIndex[parseInt(j)])
            newMembers.push(new ObjectId(curMembers[j]._id));
    }
    (req as any).classInstance.class_members = newMembers;
    await (req as any).classInstance.save();
    res.status(200);
    res.json({
        status: 'Success',
        data: { deleted: deleted, failed: membersVNUId },
    });
}

async function handleUploadMembers(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const jsonArray = await csv().fromFile((req as any).fileUploadPath);
    let members: string[] = [];
    for (var i of jsonArray) {
        members.push(i.email);
    }
    req.body.members = JSON.stringify(members);
    next();
}

export {
    fCreateClass,
    validateClassTeacher,
    fAddMembersToClass,
    fGetCurClasses,
    findClassByClassId,
    validateClassMember,
    fGetMemberBasicInfors,
    fFindClassByClassId,
    fDeleteMemberInClass,
    handleUploadMembers,
};
