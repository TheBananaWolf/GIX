import * as React from 'react';
import { FieldRenderProps } from 'react-final-form';
import TextField, { OnePirateTextFieldProps } from '../items/TextField';

function RFTextField(
  props: OnePirateTextFieldProps & FieldRenderProps<string, HTMLElement>,
) {
  const {
    autoComplete,
    input,
    InputProps,
    meta: { touched, error, submitError },
    ...other
  } = props;

  // 检查是否有特殊处理 type 属性的代码，如果没有，这里添加
  input.type = InputProps?.type || input.type;

  return (
    <TextField
      error={Boolean(!!touched && (error || submitError))}
      {...input}
      {...other}
      InputProps={{
        inputProps: {
          autoComplete,
          ...input, // 确保 input 中的 type 属性在这里被设置
        },
        ...InputProps,
      }}
      helperText={touched ? error || submitError : ''}
      variant="standard"
    />
  );
}

export default RFTextField;
