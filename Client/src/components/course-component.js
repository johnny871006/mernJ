import React from "react";
import { useNavigate } from "react-router-dom";
import CourseService from "../services/course.service";
import { useState, useEffect } from "react";

const CourseComponent = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();
  const handleToLogin = () => {
    navigate("/login");
  };

  const [courseData, setCourseData] = useState(null);
  useEffect(() => {
    let _id;
    if (currentUser) {
      _id = currentUser.user._id;
      if (currentUser.user.role == "instructor") {
        CourseService.get(_id)
          .then((data) => {
            setCourseData(data.data);
          })
          .catch((e) => {
            console.log(e);
          });
      } else if (currentUser.user.role == "student") {
        CourseService.getEnrolledCourses(_id)
          .then((data) => {
            setCourseData(data.data);
          })
          .catch((e) => {
            console.log(e);
          });
      }
    }
  }, []);

  const handleDelete = (e) => {
    CourseService.delete(e.target.id)
      .then(() => {
        window.alert("課程刪除成功。請重新整理頁面。");
        navigate("/profile");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCancel = (e) => {
    CourseService.cancel(e.target.id)
      .then(() => {
        window.alert("課程取消成功。重新導向到課程頁面。");
        navigate("/profile");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div style={{ padding: "3em" }}>
      {!currentUser && (
        <div>
          <p>你必須先登入才能看到課程</p>
          <button className="btn btn-primary" onClick={handleToLogin}>
            回到登入畫面
          </button>
        </div>
      )}
      {currentUser && currentUser.user.role == "instructor" && (
        <div>
          <h1>歡迎來到講師的課程頁面</h1>
        </div>
      )}
      {currentUser && currentUser.user.role == "student" && (
        <div>
          <h1>歡迎來到學生的課程頁面</h1>
        </div>
      )}
      {currentUser && courseData && courseData.length != 0 && (
        <div style={{ display: "flex", flexwrap: "wrap" }}>
          {courseData.map((course) => {
            return (
              <div className="card" style={{ width: "18rem", margin: "1rem" }}>
                <div className="card-body">
                  <h5 className="card-title">課程名稱:{course.title}</h5>
                  <p style={{ margin: "0.5rem 0rem" }} className="card-text">
                    {course.description}
                  </p>
                  <p style={{ margin: "0.5rem 0rem" }} className="card-text">
                    學生人數:{course.students.length}
                  </p>
                  <p style={{ margin: "0.5rem 0rem" }} className="card-text">
                    課程價格:{course.price}
                  </p>
                  {currentUser && currentUser.user.role == "instructor" && (
                    <a
                      href="#"
                      id={course._id}
                      className="card-text btn btn-primary"
                      style={{ margin: "0.5rem 0.5rem" }}
                      onClick={handleDelete}
                    >
                      刪除課程
                    </a>
                  )}
                  {currentUser && currentUser.user.role == "student" && (
                    <a
                      href="#"
                      id={course._id}
                      className="card-text btn btn-primary"
                      style={{ margin: "0.5rem 0.5rem" }}
                      onClick={handleCancel}
                    >
                      取消註冊課程
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CourseComponent;
