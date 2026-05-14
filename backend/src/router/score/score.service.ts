import { Request, Response } from 'express';
import { ScoreStatus } from '../../config/constants';

export const updateScores = async (req: Request, res: Response) => {
    try {
        const { examId, scores } = req.body;

        // Kiểm tra input
        if (!examId || !scores || !Array.isArray(scores)) {
            return res.status(400).json({
                status: 'Bad Request',
                message: 'Invalid input: examId and scores array are required',
            });
        }

        const results = [];

        // Xử lý từng score trong mảng
        for (const scoreData of scores) {
            const { studentId, value, status } = scoreData;

            // Tìm score hiện tại theo examId và studentId
            const existingScore = await global.DBConnection.Score.findOne({
                exam_id: examId,
                student_id: studentId,
                is_deleted: false,
            });

            if (existingScore) {
                // Nếu đã tồn tại => cập nhật
                existingScore.value = value;
                existingScore.status = status;
                existingScore.updated_at = new Date();

                await existingScore.save();

                await global.DBConnection.ScoreLog.create({
                    score_id: existingScore._id,
                    user_ref: req.body.user_ref,
                    score_before: existingScore.value,
                    score_after: value,
                    status_before: existingScore.status,
                    status_after: status,
                });

                results.push({
                    studentId,
                    action: 'updated',
                    scoreId: existingScore._id,
                });
            } else {
                // Nếu chưa tồn tại => tạo mới
                const newScore = new global.DBConnection.Score({
                    exam_id: examId,
                    student_id: studentId,
                    value: value,
                    status: status,
                    is_deleted: false,
                    created_at: new Date(),
                    updated_at: new Date(),
                });

                await newScore.save();
                await global.DBConnection.ScoreLog.create({
                    score_id: newScore._id,
                    user_ref: req.body.user_ref,
                    score_before: 0,
                    score_after: value,
                    status_before: ScoreStatus.NOT_SIGNED,
                    status_after: status,
                });

                results.push({
                    studentId,
                    action: 'created',
                    scoreId: newScore._id,
                });
            }
        }

        return res.status(200).json({
            status: 'OK',
            message: 'Scores updated successfully',
            data: results,
        });
    } catch (error) {
        console.error('Error in updateScores:', error);
        return res.status(500).json({
            status: 'Internal Server Error',
            message: 'Failed to update scores',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
