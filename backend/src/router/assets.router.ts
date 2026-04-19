/*
 * SPDX-License-Identifier: Apache-2.0
 *
 * This sample is intended to work with the basic asset transfer
 * chaincode which imposes some constraints on what is possible here.
 *
 * For example,
 *  - There is no validation for Asset IDs
 *  - There are no error codes from the chaincode
 *
 * To avoid timeouts, long running tasks should be decoupled from HTTP request
 * processing
 *
 * Submit transactions can potentially be very long running, especially if the
 * transaction fails and needs to be retried one or more times
 *
 * To allow requests to respond quickly enough, this sample queues submit
 * requests for processing asynchronously and immediately returns 202 Accepted
 */

import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
    createAsset,
    deleteAsset,
    getAllAssets,
    getAsset,
    patchAsset,
    transferAsset,
} from '../services/assets.service';

export const assetsRouter = express.Router();

assetsRouter.get('/', async (req: Request, res: Response) => {
    return await getAllAssets(req, res);
});

assetsRouter.post(
    '/',
    body().isObject().withMessage('body must contain an asset object'),
    body('ID', 'must be a string').notEmpty(),
    body('Color', 'must be a string').notEmpty(),
    body('Size', 'must be a number').isNumeric(),
    body('Owner', 'must be a string').notEmpty(),
    body('AppraisedValue', 'must be a number').isNumeric(),
    async (req: Request, res: Response) => {
        return await createAsset(req, res);
    }
);

assetsRouter.get('/:assetId', async (req: Request, res: Response) => {
    return await getAsset(req, res);
});

assetsRouter.put(
    '/:assetId',
    body().isObject().withMessage('body must contain an asset object'),
    body('ID', 'must be a string').notEmpty(),
    body('Color', 'must be a string').notEmpty(),
    body('Size', 'must be a number').isNumeric(),
    body('Owner', 'must be a string').notEmpty(),
    body('AppraisedValue', 'must be a number').isNumeric(),
    async (req: Request, res: Response) => {
        return await transferAsset(req, res);
    }
);

assetsRouter.patch(
    '/:assetId',
    body()
        .isArray({
            min: 1,
            max: 1,
        })
        .withMessage(
            'body must contain an array with a single patch operation'
        ),
    body('*.op', "operation must be 'replace'").equals('replace'),
    body('*.path', "path must be '/Owner'").equals('/Owner'),
    body('*.value', 'must be a string').isString(),
    async (req: Request, res: Response) => {
        return await patchAsset(req, res);
    }
);

assetsRouter.delete('/:assetId', async (req: Request, res: Response) => {
    return await deleteAsset(req, res);
});
