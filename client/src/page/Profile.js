import axios from "axios";
import { useState, useEffect } from "react";

function Profile() {
  const [userData, setUserData] = useState({
    id: null,
    name: "",
    email: "",
    bio: "",
    phone: "",
    company: "",
    location: "",
    dob: null,
    social_link: "",
    createAt: "",
    updateAt: "",
    avatar: ""
  })

  const [tempUserData, setTempUserData] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  // Lấy dữ liệu từ server
  const getUserfromServer = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) throw new Error("No token in session storage!");
      const res = await axios.get(`${process.env.REACT_APP_SERVER}/users/profile`, {
        headers: {
          token: `${token}`,
        },
      });
      console.log(res.data);
      setUserData(res.data);
      setTempUserData(res.data);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getUserfromServer();
  }, []);

  // Chuyển đổi chế độ chỉnh sửa
  const toggleEdit = () => {
    setIsEditing(!isEditing);
    setTempUserData(userData); // Reset lại dữ liệu tạm thời
  };

  // Lưu thay đổi
  const saveChanges = () => {
    const updatedData = {
      ...tempUserData,
      updateAt: new Date().toISOString()
    };
    // hai: call api
    UpdateProfile(updatedData);

    setUserData(updatedData);
    setIsEditing(false);
  };

  // call api update profile ======================= author : Hai
  const UpdateProfile = async function (updatedData) {
    const token = sessionStorage.getItem("token")
    try {
      await axios.put(`${process.env.REACT_APP_SERVER}/users/update-profile`, updatedData, {
        headers: {
          token
        }
      })
    } catch (err) {
      console.log(err)
    }
  }
  // ============================================================

  return (
    <div className="flex h-screen">
      <div className="w-1/4 bg-gray-100 flex flex-col items-center p-6 border-r pt-12">
        <img
          src={userData.avatar?userData.avatar:"https://th.bing.com/th/id/OIP.te14DcGDGx0pREICZjuyfgHaHa?w=151&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7"}
          alt="Avatar"
          className="w-28 h-28 rounded-full mb-4"
        />
        <h2 className="text-lg font-semibold">{userData.name}</h2>
        <p className="text-gray-500">{userData.email}</p>
        {/*  
        <div className="mt-6 flex justify-between space-x-4 w-4/5">
          <button className="flex-1 bg-red-500 text-white px-4 py-2 rounded-md">
            Project
          </button>
          <button className="flex-1 bg-green-500 text-white px-4 py-2 rounded-md">
            Message
          </button>
        </div>
            */}
      </div>

      <div className="w-2/4 p-6 border-r">
        <h2 className="text-3xl font-bold mb-10 text-center">User Profile</h2>

        {isEditing ? (
          <div className="space-y-4">
            {/* Form chỉnh sửa */}
            <div>
              <label className="block text-sm font-medium text-gray-700">UserName</label>
              <input
                type="text"
                value={tempUserData.name}
                onChange={(e) => setTempUserData({ ...tempUserData, name: e.target.value })}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={tempUserData.email}
                onChange={(e) => setTempUserData({ ...tempUserData, email: e.target.value })}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Bio</label>
              <textarea
                value={tempUserData.bio}
                onChange={(e) => setTempUserData({ ...tempUserData, bio: e.target.value })}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="text"
                value={tempUserData.phone}
                onChange={(e) => setTempUserData({ ...tempUserData, phone: e.target.value })}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
              <input
                type="date"
                value={tempUserData.dob || ""} // Giá trị mặc định nếu null
                onChange={(e) => setTempUserData({ ...tempUserData, dob: e.target.value })}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300"
              />

            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Company</label>
              <input
                type="text"
                value={tempUserData.company}
                onChange={(e) => setTempUserData({ ...tempUserData, company: e.target.value })}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                value={tempUserData.location}
                onChange={(e) => setTempUserData({ ...tempUserData, location: e.target.value })}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Github Link</label>
              <input
                type="url"
                value={tempUserData.githubLink}
                onChange={(e) => setTempUserData({ ...tempUserData, social_link: e.target.value })}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300"
              />
            </div>


            <div className="flex space-x-4 mt-4">
              <button
                onClick={saveChanges}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Save
              </button>
              <button
                onClick={toggleEdit}
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Thông tin chỉ đọc */}
            <div className="w-full p-6">
              <div className="grid gap-4 grid-cols-1">
                <div className="flex  border-b pb-2">
                  <span className="w-40 font-bold">UserName</span>
                  <span>{userData.name}</span>
                </div>
                <div className="flex  border-b pb-2">
                  <span className="w-40 font-bold">Email</span>
                  <span>{userData.email}</span>
                </div>
                <div className="flex  border-b pb-2">
                  <span className="w-40 font-bold">Bio</span>
                  <span>{userData.bio || "No bio provided"}</span>
                </div>
                <div className="flex  border-b pb-2">
                  <span className="w-40 font-bold">Phone</span>
                  <span>{userData.phone}</span>
                </div>
                <div className="flex  border-b pb-2">
                  <span className="w-40 font-bold">Date of Birth</span>
                  <span>{new Date(userData.dob).toLocaleDateString()}</span>
                </div>
                <div className="flex  border-b pb-2">
                  <span className="w-40 font-bold">Company</span>
                  <span>{userData.company}</span>
                </div>
                <div className="flex  border-b pb-2">
                  <span className="w-40 font-bold">Location</span>
                  <span>{userData.location || "Not specified"}</span>
                </div>
                <div className="flex  border-b pb-2">
                  <span className="w-40 font-bold">Github link</span>
                  <span className="text-blue-600">{userData.social_link}</span>
                </div>

              </div>
            </div>
          </div>
        )}

        {!isEditing && (
          <button
            onClick={toggleEdit}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md "
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
}

export default Profile;
