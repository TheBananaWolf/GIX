import React, { useState, useEffect } from 'react';
import { Button, TextField, Box } from '@mui/material';
import { updateData } from '../../services/apiService';

type EditProfileFormProps = {
  userInfo: {
    firstName:string;
    lastName: string;
    // email: string;
    gender: string;
    location: string;
    // 其他需要的字段...
  };
  onSave: (userInfo: any) => void; // 假设 onSave 是一个接受用户信息对象并进行处理的函数
};

const EditProfileForm: React.FC<EditProfileFormProps> = ({ userInfo, onSave }) => {
  const [isEditing, setIsEditing] = useState(false); // 添加编辑模式状态
  const handleEdit = () => {
    setIsEditing(true); // 启用编辑模式
  };

  const handleCancel = () => {
    setIsEditing(false); // 取消编辑模式
  };

  const [formValues, setFormValues] = useState({
    firstName: userInfo.firstName || '',
    lastName: userInfo.lastName || '',
    // email: userInfo.email || '',
    gender: userInfo.gender || '',
    location: userInfo.location || '',
    // 初始化其他字段...
  });

  useEffect(() => {
    // 当组件接收到新的 userInfo props 时，更新表单字段
    if (userInfo) {
      setFormValues({
        firstName: userInfo.firstName || '',
        lastName: userInfo.lastName || '',
        // email: userInfo.email || '',
        gender: userInfo.gender || '',
        location: userInfo.location || '',
          // 根据需要更新其他字段...
        });
    }
  }, [userInfo]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // 阻止表单默认提交行为
    console.log(formValues); // 在这里打印，检查地址字段是否被正确更新

    const token = localStorage.getItem('userToken');
    if (token && isEditing) {
      try {
        // 调用API更新用户信息
        const updatedUserInfo = await updateData('/api/profile/updateProfileInfos', formValues, token);
        onSave(updatedUserInfo); // 可以使用这个回调函数将更新后的用户信息传递回ProfilePage组件
        setIsEditing(false); // 提交后禁用编辑模式
      } catch (error) {
        console.error('Failed to update user profile:', error);
      }
    }
  };

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <TextField
          label="First Name"
          variant="outlined"
          fullWidth
          margin="normal"
          name="firstName"
          value={formValues.firstName}
          onChange={handleInputChange}
          disabled={!isEditing}
        />
        <TextField
          label="Last Name"
          variant="outlined"
          fullWidth
          margin="normal"
          name="lastName"
          value={formValues.lastName}
          onChange={handleInputChange}
          disabled={!isEditing}
        />
        {/* <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          name="email"
          value={formValues.email}
          onChange={handleInputChange}
          disabled={!isEditing}
        /> */}
        <TextField
          label="Gender"
          variant="outlined"
          fullWidth
          margin="normal"
          name="gender"
          value={formValues.gender}
          onChange={handleInputChange}
          disabled={!isEditing}
        />
        <TextField
          label="Location"
          variant="outlined"
          fullWidth
          margin="normal"
          name="location"
          value={formValues.location}
          onChange={handleInputChange}
          disabled={!isEditing}
        />
        {/* 根据需要添加其他字段 */}
        {/* <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button type="submit" color="primary">
            Save
          </Button>
        </Box> */}
        {isEditing ? (
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button onClick={() => setIsEditing(false)} color="primary">Cancel</Button>
          <Button type="submit" color="secondary">Save</Button>
        </Box>
        ) : (
          <Button onClick={() => setIsEditing(true)} color="primary" sx={{ mt: 2 }}>Edit</Button>
        )}
      </form>
    </Box>
  );
};

export default EditProfileForm;
