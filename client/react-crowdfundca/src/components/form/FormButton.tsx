import * as React from 'react';
import {ButtonProps} from '@mui/material';
import Button from '../items/Button';
import defer from './defer';

interface FormButtonProps {
    disabled?: boolean;
    mounted?: boolean;
}

function FormButton<C extends React.ElementType>(
    props: FormButtonProps & ButtonProps<C, { component?: C }>,
) {
    const {disabled, mounted, ...others} = props;
    return (
        // <Button
        //     color="secondary"
        //     variant="contained"
        //     size="large"
        //     component="a"
        //     href="/sign-up"
        //     sx={{ minWidth: 200 }}
        //   >
        //     Submit
        //   </Button>
        <Button
            disabled={!mounted || disabled}
            type="submit"
            variant="contained"
            color="secondary"
            size="large"
            sx={{minWidth: 200}}
        >
            Submit
        </Button>
    );
}

export default defer(FormButton);