import axios from "axios";
const API_URL = "http://localhost:8080/api/courses";
let token;

class CourseService {
  tokenMethod() {
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
  }

  post(title, description, price) {
    this.tokenMethod();

    return axios.post(
      API_URL,
      { title, description, price },
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }

  //利用課程id尋找課程
  getCourseId(_id) {
    this.tokenMethod();

    return axios.get(API_URL + "/" + _id, {
      headers: {
        Authorization: token,
      },
    });
  }

  // 使用學生id，找到學生註冊的課程
  getEnrolledCourses(_id) {
    this.tokenMethod();

    return axios.get(API_URL + "/student/" + _id, {
      headers: {
        Authorization: token,
      },
    });
  }

  // 使用instructor id，來找到講師擁有的課程
  get(_id) {
    this.tokenMethod();

    return axios.get(API_URL + "/instructor/" + _id, {
      headers: {
        Authorization: token,
      },
    });
  }

  getCourseByName(name) {
    this.tokenMethod();

    return axios.get(API_URL + "/findByName/" + name, {
      headers: {
        Authorization: token,
      },
    });
  }

  enroll(_id) {
    this.tokenMethod();

    return axios.post(
      API_URL + "/enroll/" + _id,
      {},
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }

  cancel(_id) {
    this.tokenMethod();

    return axios.post(
      API_URL + "/cancel/" + _id,
      {},
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }

  delete(_id) {
    this.tokenMethod();

    return axios.delete(API_URL + "/" + _id, {
      headers: {
        Authorization: token,
      },
    });
  }
}

export default new CourseService();
