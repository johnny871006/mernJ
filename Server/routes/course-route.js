const { course } = require("../models");
const { eventNames } = require("../models/user-model");

const router = require("express").Router();
const Course = require("../models").course;
const courseValidation = require("../validation").courseValidation;

router.use((req, res, next) => {
  console.log("course route正在接受一個request...");
  next();
});

//查看系統內所有課程
router.get("/", async (req, res) => {
  try {
    let courseFound = await Course.find({})
      .populate("instructor", ["username", "email"]) // 顯示instructor資料
      .exec();
    return res.send(courseFound);
  } catch (e) {
    return res.status(500).send(e);
  }
});

// 用課程id尋找課程
router.get("/:_id", async (req, res) => {
  let { _id } = req.params;
  try {
    let courseFound = await Course.findOne({ _id })
      .populate("instructor", ["username", "email"]) // 顯示instructor資料
      .exec();
    return res.send(courseFound);
  } catch (e) {
    return res.status(500).send(e);
  }
});

// 用教師id來尋找課程
router.get("/instructor/:_instructor_id", async (req, res) => {
  let { _instructor_id } = req.params;
  try {
    let coursesFound = await Course.find({ instructor: _instructor_id })
      .populate("instructor", ["username", "email"])
      .exec();
    return res.send(coursesFound);
  } catch (e) {
    return res.status(500).send(e);
  }
});

// 用課程名稱來尋找課程
router.get("/findByName/:name", async (req, res) => {
  let { name } = req.params;
  try {
    let coursesFound = await Course.find({ title: name })
      .populate("instructor", ["username", "email"])
      .exec();
    return res.send(coursesFound);
  } catch (e) {
    return res.status(500).send(e);
  }
});

// 用學生id來尋找註冊過的課程
router.get("/student/:_student_id", async (req, res) => {
  let { _student_id } = req.params;
  try {
    let coursesFound = await Course.find({ students: _student_id })
      .populate("instructor", ["username", "email"])
      .exec();
    return res.send(coursesFound);
  } catch (e) {
    return res.status(500).send(e);
  }
});

// 讓學生透過id來註冊新課程
router.post("/enroll/:_id", async (req, res) => {
  let { _id } = req.params;
  try {
    let courseEnroll = await Course.findOne({ _id }).exec();
    courseEnroll.students.push(req.user._id);
    await courseEnroll.save();
    return res.send("註冊完成");
  } catch (e) {
    return res.send(e);
  }
});

//新增課程
router.post("/", async (req, res) => {
  //驗證數據符合規範
  let { error } = courseValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  if (req.user.isStudent()) {
    return res
      .status(400)
      .send("只有講師可以發布新課程，若你已是講師，請透過講師帳號登入。");
  }

  let { title, description, price } = req.body;
  try {
    let newCourse = new Course({
      title,
      description,
      price,
      instructor: req.user._id,
    });
    let savedCourse = await newCourse.save();
    return res.send("新課程已經保存");
  } catch (e) {
    return res.status(500).send("無法創建課程");
  }
});

//更新課程
router.patch("/:_id", async (req, res) => {
  //驗證數據符合規範
  let { error } = courseValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let { _id } = req.params;

  try {
    //確認課程是否存在
    let foundCourse = await Course.findOne({ _id }).exec();
    if (!foundCourse) {
      return res.status(400).send("找不到此課程，無法更新。");
    }

    // 必須是此課程講師，才能更改課程
    if (foundCourse.instructor.equals(req.user._id)) {
      let updatedCourse = await Course.findOneAndUpdate({ _id }, req.body, {
        new: true,
        runValidators: true,
      });
      return res.send({
        message: "課程已經被更新!",
        updatedCourse,
      });
    } else {
      return res.status(403).send("只有此課程講師才能更新課程!");
    }
  } catch (e) {
    return res.status(500).send(e);
  }
});

// 讓學生透過id來取消課程
router.post("/cancel/:_id", async (req, res) => {
  let { _id } = req.params;
  try {
    let courseCancel = await Course.findOne({ _id }).exec();
    let s = courseCancel.students.indexOf(req.user._id);
    courseCancel.students.splice(s, 1);
    await courseCancel.save();
    return res.send("取消成功");
  } catch (e) {
    return res.send(e);
  }
});

//刪除課程
router.delete("/:_id", async (req, res) => {
  let { _id } = req.params;

  try {
    //確認課程是否存在
    let foundCourse = await Course.findOne({ _id }).exec();
    if (!foundCourse) {
      return res.status(400).send("找不到此課程，無法刪除。");
    }

    // 必須是此課程講師，才能刪除課程
    if (foundCourse.instructor.equals(req.user._id)) {
      await Course.deleteOne({ _id }).exec();
      return res.send("課程已成功刪除!");
    } else {
      return res.status(403).send("只有此課程講師才能刪除課程!");
    }
  } catch (e) {
    return res.status(500).send(e);
  }
});

module.exports = router;
