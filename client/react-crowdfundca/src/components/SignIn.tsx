import * as React from 'react';
import { Field, Form, FormSpy } from 'react-final-form';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from './items/Typography';
import AppFooter from './views/AppFooter';
import AppAppBar from './views/AppAppBar';
import AppForm from './views/AppForm';
import { email, required } from './form/validation';
import RFTextField from './form/RFTextField';
import FormButton from './form/FormButton';
import FormFeedback from './form/FormFeedback';
import withRoot from './withRoot';
import { submitDataInJson } from '../services/apiService';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

interface LoginResponse {
  token: string;
}

// interface LoginFormValues {
//   email: string;
//   password: string;
// }

function SignIn() {
  const [sent, setSent] = React.useState(false);
  // // 假设用户未登录，因为这是登录页面
  // const isLoggedIn = false;
  // // 登出函数只是一个空函数，因为在登录页面无需登出
  // const handleLogout = () => {};
  // 跟踪密码是否可见
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
    // console.log('Password visibility set to:', !showPassword); // 这应该在每次点击时输出相反的值
  };  

  const validate = (values: { [index: string]: string }) => {
    const errors = required(['email', 'password'], values);

    if (!errors.email) {
      const emailError = email(values.email);
      if (emailError) {
        errors.email = emailError;
      }
    }

    return errors;
  };

  // 修改后的handleSubmit函数
  const handleSubmit = async (values: any) => {
    setSent(true);
    // const formData = new FormData();
    // formData.append('email', values.email);
    // formData.append('password', values.password);
    const data = {
      email: values.email,
      password: values.password,
    };  

    // submitDataInJson('/api/auth/login', data, (responseData: LoginResponse) => {
    //   console.log('Login successful', responseData);
    //   // 保存Token到localStorage
    //   localStorage.setItem('userToken', responseData.token);
    //   // 登录成功后的逻辑，例如重定向到用户profile页面
    //   window.location.href = '/profile';
    // });
    try {
      // Attempt user login first
      await submitDataInJson('/api/auth/login', data, (responseData: LoginResponse) => {
        console.log('Login successful', responseData);
        // 保存Token到localStorage
        localStorage.setItem('userToken', responseData.token);
        // 登录成功后的逻辑，例如重定向到用户profile页面
        window.location.href = '/profile';
      });
    } 
    // catch (error) {
    //   console.error('User login failed, attempting admin login:');
    //   // Proceed to attempt admin login below
    // }
    finally{
      // Attempt admin login if user login fails
      await submitDataInJson('/api/admin/adminlogin', data, (responseData: LoginResponse) => {
        console.log('Login successful', responseData);
        // 保存Token到localStorage
        localStorage.setItem('adminToken', responseData.token);
        // 登录成功后的逻辑，例如重定向到用户profile页面
        window.location.href = '/admin-profile';
      });
    }
  
    // try {
    //   // Attempt admin login if user login fails
    //   submitDataInJson('/api/admin/adminlogin', data, (responseData: LoginResponse) => {
    //     console.log('Login successful', responseData);
    //     // 保存Token到localStorage
    //     localStorage.setItem('adminToken', responseData.token);
    //     // 登录成功后的逻辑，例如重定向到用户profile页面
    //     window.location.href = '/admin-profile';
    //   });
    // } catch (error) {
    //   console.error('Admin login failed:');
    //   // Handle failed login attempts here, such as displaying an error message to the user
    // }
  };
  // Use submitData function to send data to the server
  // const handleSubmit = async (values: any) => {
  //   setSent(true);
  //   const response = await fetch
  //   ('/api/auth/signin', {
  //     method: 'POST',
      // headers: {
      //   'Content-Type': 'application/json'
      // },
  //     body: JSON.stringify({ ...values})
  //   });
  //   if (response.ok) {
  //     const data = await response.json();
  //     console.log(data); // Put logic here to handle successful sign in
  //   } else {
  //     const error = await response.json();
  //     console.log(error); // Put logic here to handle sign in errors
  //   }
  // };

  // // This is a callback function after submit
  // const afterSubmit = async (values: any) => {
  //   // Test, reloacte to home page
  //   window.location.href = '/profile';
  //   return;
  // };


  return (
    <React.Fragment>
    <AppAppBar />
      <AppForm>
        <React.Fragment>
          <Typography variant="h3" gutterBottom marked="center" align="center">
            Sign In
          </Typography>
          <Typography variant="body2" align="center">
            {'Not a member yet? '}
            <Link
              href="/sign-up"
              align="center"
              underline="always"
            >
              Sign Up here
            </Link>
          </Typography>
        </React.Fragment>
        <Form
          onSubmit={handleSubmit}
          // onSubmit={(values) => submitData('/api/auth/signin', values, afterSubmit)}
          subscription={{ submitting: true }}
          validate={validate}
        >
          {({ handleSubmit: handleSubmit2, submitting }) => (
            <Box component="form" onSubmit={handleSubmit2} noValidate sx={{ mt: 6 }}>
              <Field
                autoComplete="email"
                autoFocus
                component={RFTextField}
                disabled={submitting || sent}
                // fullWidth
                label="Email"
                margin="normal"
                name="email"
                required
                size="large"
                sx={{ width: '95%' }} // 使邮箱输入框占满可用宽度
              />
              <Field
                // fullWidth
                size="large"
                component={RFTextField}
                type={showPassword ? 'text' : 'password'} // 确保传递正确的 type
                disabled={submitting || sent}
                required
                name="password"
                autoComplete="current-password"
                label="Password"
                // type="password"
                margin="normal"
                sx={{ width: 'calc(94% + 39px)' }} // 减去图标的宽度加上间隙
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              <FormSpy subscription={{ submitError: true }}>
                {({ submitError }) =>
                  submitError ? (
                    <FormFeedback error sx={{ mt: 2 }}>
                      {submitError}
                    </FormFeedback>
                  ) : null
                }
              </FormSpy>
              <FormButton
                sx={{ mt: 3, mb: 2 }}
                disabled={submitting || sent}
                size="large"
                color="secondary"
                fullWidth
              >
                {submitting || sent ? 'In progress…' : 'Sign In'}
              </FormButton>
              
            </Box>
          )}
        </Form>
        {/* <Typography align="center">
          <Link underline="always" href="/profile">
            Forgot password?
          </Link>
        </Typography> */}
      </AppForm>
      <AppFooter />
    </React.Fragment>
  );
}

export default withRoot(SignIn);
