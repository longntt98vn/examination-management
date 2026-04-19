import { Request, Response } from 'express';
import { Contract } from 'fabric-network';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import { evatuateTransaction } from '../utils/fabric';
import { logger } from '../utils/logger';
import { addSubmitTransactionJob } from '../utils/jobs';
import { Queue } from 'bullmq';
import { AssetNotFoundError, ContractError } from '../utils/errors';
import { validationResult } from 'express-validator';

const { NOT_FOUND, INTERNAL_SERVER_ERROR, ACCEPTED, BAD_REQUEST, OK } =
    StatusCodes;

export const getAllAssets = async (req: Request, res: Response) => {
    logger.debug('Get all assets request received');
    try {
        const mspId = req.user as string;
        const contract = req.app.locals[mspId]?.assetContract as Contract;

        const data = await evatuateTransaction(contract, 'GetAllAssets');
        let assets = [];
        if (data.length > 0) {
            assets = JSON.parse(data.toString());
        }

        return res.status(OK).json(assets);
    } catch (err) {
        logger.error({ err }, 'Error processing get all assets request');
        return res.status(INTERNAL_SERVER_ERROR).json({
            status: getReasonPhrase(INTERNAL_SERVER_ERROR),
            timestamp: new Date().toISOString(),
        });
    }
};

export const createAsset = async (req: Request, res: Response) => {
    logger.debug(req.body, 'Create asset request received');

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(BAD_REQUEST).json({
            status: getReasonPhrase(BAD_REQUEST),
            reason: 'VALIDATION_ERROR',
            message: 'Invalid request body',
            timestamp: new Date().toISOString(),
            errors: errors.array(),
        });
    }

    const mspId = req.user as string;
    const assetId = req.body.ID;

    try {
        const submitQueue = req.app.locals.jobq as Queue;
        const jobId = await addSubmitTransactionJob(
            submitQueue,
            mspId,
            'CreateAsset',
            assetId,
            req.body.Color,
            req.body.Size,
            req.body.Owner,
            req.body.AppraisedValue
        );

        return res.status(ACCEPTED).json({
            status: getReasonPhrase(ACCEPTED),
            jobId: jobId,
            timestamp: new Date().toISOString(),
        });
    } catch (err) {
        logger.error(
            { err },
            'Error processing create asset request for asset ID %s',
            assetId
        );

        return res.status(INTERNAL_SERVER_ERROR).json({
            status: getReasonPhrase(INTERNAL_SERVER_ERROR),
            timestamp: new Date().toISOString(),
        });
    }
};

export const getAsset = async (req: Request, res: Response) => {
    const assetId = req.params.assetId;
    logger.debug('Read asset request received for asset ID %s', assetId);

    try {
        const mspId = req.user as string;
        const contract = req.app.locals[mspId]?.assetContract as Contract;

        const data = await evatuateTransaction(
            contract,
            'ReadAsset',
            assetId.toString()
        );
        const asset = JSON.parse(data.toString());

        return res.status(OK).json(asset);
    } catch (err) {
        logger.error(
            { err },
            'Error processing read asset request for asset ID %s',
            assetId
        );

        if (err instanceof AssetNotFoundError) {
            return res.status(NOT_FOUND).json({
                status: getReasonPhrase(NOT_FOUND),
                timestamp: new Date().toISOString(),
            });
        }

        return res.status(INTERNAL_SERVER_ERROR).json({
            status: getReasonPhrase(INTERNAL_SERVER_ERROR),
            timestamp: new Date().toISOString(),
        });
    }
};

export const transferAsset = async (req: Request, res: Response) => {
    logger.debug(req.body, 'Transfer asset request received');

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(BAD_REQUEST).json({
            status: getReasonPhrase(BAD_REQUEST),
            reason: 'VALIDATION_ERROR',
            message: 'Invalid request body',
            timestamp: new Date().toISOString(),
            errors: errors.array(),
        });
    }

    if (req.params.assetId != req.body.ID) {
        return res.status(BAD_REQUEST).json({
            status: getReasonPhrase(BAD_REQUEST),
            reason: 'ASSET_ID_MISMATCH',
            message: 'Asset IDs must match',
            timestamp: new Date().toISOString(),
        });
    }

    const mspId = req.user as string;
    const assetId = req.params.assetId;

    try {
        const submitQueue = req.app.locals.jobq as Queue;
        const jobId = await addSubmitTransactionJob(
            submitQueue,
            mspId,
            'UpdateAsset',
            assetId.toString(),
            req.body.color,
            req.body.size,
            req.body.owner,
            req.body.appraisedValue
        );

        return res.status(ACCEPTED).json({
            status: getReasonPhrase(ACCEPTED),
            jobId: jobId,
            timestamp: new Date().toISOString(),
        });
    } catch (err) {
        logger.error(
            { err },
            'Error processing update asset request for asset ID %s',
            assetId
        );

        return res.status(INTERNAL_SERVER_ERROR).json({
            status: getReasonPhrase(INTERNAL_SERVER_ERROR),
            timestamp: new Date().toISOString(),
        });
    }
};

export const patchAsset = async (req: Request, res: Response) => {
    logger.debug(req.body, 'Transfer asset request received');

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(BAD_REQUEST).json({
            status: getReasonPhrase(BAD_REQUEST),
            reason: 'VALIDATION_ERROR',
            message: 'Invalid request body',
            timestamp: new Date().toISOString(),
            errors: errors.array(),
        });
    }

    const mspId = req.user as string;
    const assetId = req.params.assetId;
    const newOwner = req.body[0].value;

    try {
        const submitQueue = req.app.locals.jobq as Queue;
        const jobId = await addSubmitTransactionJob(
            submitQueue,
            mspId,
            'TransferAsset',
            assetId.toString(),
            newOwner
        );

        return res.status(ACCEPTED).json({
            status: getReasonPhrase(ACCEPTED),
            jobId: jobId,
            timestamp: new Date().toISOString(),
        });
    } catch (err) {
        logger.error(
            { err },
            'Error processing update asset request for asset ID %s',
            req.params.assetId
        );

        return res.status(INTERNAL_SERVER_ERROR).json({
            status: getReasonPhrase(INTERNAL_SERVER_ERROR),
            timestamp: new Date().toISOString(),
        });
    }
};

export const deleteAsset = async (req: Request, res: Response) => {
    logger.debug(req.body, 'Delete asset request received');

    const mspId = req.user as string;
    const assetId = req.params.assetId;

    try {
        const submitQueue = req.app.locals.jobq as Queue;
        const jobId = await addSubmitTransactionJob(
            submitQueue,
            mspId,
            'DeleteAsset',
            assetId.toString()
        );

        return res.status(ACCEPTED).json({
            status: getReasonPhrase(ACCEPTED),
            jobId: jobId,
            timestamp: new Date().toISOString(),
        });
    } catch (err) {
        logger.error(
            { err },
            'Error processing delete asset request for asset ID %s',
            assetId
        );

        return res.status(INTERNAL_SERVER_ERROR).json({
            status: getReasonPhrase(INTERNAL_SERVER_ERROR),
            timestamp: new Date().toISOString(),
        });
    }
};
