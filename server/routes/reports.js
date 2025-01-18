// Not Started
// Not Started
// Not Started
const express = require("express");
const router = express.Router();
const { Reports } = require("../models");

// Lấy danh sách tất cả các báo cáo
router.get("/", async (req, res) => {
  try {
    const reports = await Reports.findAll();
    res.json(reports);
  } catch (error) {
    console.error("Error fetching reports: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Lấy một báo cáo theo ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const report = await Reports.findByPk(id);
    if (report) {
      res.json(report);
    } else {
      res.status(404).json({ error: "Report not found" });
    }
  } catch (error) {
    console.error("Error fetching report: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Tạo một báo cáo mới
router.post("/", async (req, res) => {
  const { task_id, user_id, description, attachment } = req.body;
  try {
    const newReport = await Reports.create({
      task_id,
      user_id,
      description,
      attachment,
    });
    res.status(201).json(newReport);
  } catch (error) {
    console.error("Error creating report: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Cập nhật một báo cáo theo ID
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { task_id, user_id, description, attachment } = req.body;
  try {
    const report = await Reports.findByPk(id);
    if (report) {
      report.task_id = task_id;
      report.user_id = user_id;
      report.description = description;
      report.attachment = attachment;
      await report.save();
      res.json(report);
    } else {
      res.status(404).json({ error: "Report not found" });
    }
  } catch (error) {
    console.error("Error updating report: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Xóa một báo cáo theo ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const report = await Reports.findByPk(id);
    if (report) {
      await report.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Report not found" });
    }
  } catch (error) {
    console.error("Error deleting report: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
