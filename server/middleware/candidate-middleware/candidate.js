const axios = require("axios");
module.exports = {
  registerCandidate: async (req, res) => {
    try {
      // 1. Lưu vào MongoDB
      const candidate = new global.DBConnection.Candidate(req.body);
      await candidate.save();

      // 2. Gửi lên Blockchain qua Backend API
      const blockchainResponse = await axios.post(
        "http://localhost:3000/api/candidates",
        req.body,
        { headers: { "X-Api-Key": process.env.FABRIC_API_KEY } },
      );

      // 3. Cập nhật jobId vào MongoDB
      candidate.blockchainTxId = blockchainResponse.data.jobId;
      await candidate.save();

      res.json({ success: true, candidate });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getCandidate: async (req, res) => {
    // Logic lấy thông tin
  },

  // ... các functions khác
};
