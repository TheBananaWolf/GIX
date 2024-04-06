import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


interface AlertDialogProps {
  confirmCallbackFunc: () => void;
  titleStr: string;
  contentStr: string;
  confirmStr: string;
  cancelStr: string;
  btnStr: string;
  btnDir: string;
  isForProfilePage: boolean;
}

const AlertDialogWithBtn: React.FC<AlertDialogProps> = ({confirmCallbackFunc, titleStr, contentStr, confirmStr, cancelStr, btnStr, btnDir, isForProfilePage}) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirmClose = () => {
    setOpen(false);
    confirmCallbackFunc();
  };

  return (
    <React.Fragment>
      {/* X btn */}
      {isForProfilePage&&<Button
          color="secondary"
          size="small"
          variant="contained"
          component="a"
          onClick={handleClickOpen}
          sx={{float: btnDir, position: 'relative', zIndex:1}}
        >
        {btnStr}
      </Button>}
      {/* Donate Btn */}
      {!isForProfilePage&&<Button
          color="secondary"
          size="large"
          variant="contained"
          component="a"
          onClick={handleClickOpen}
          sx={{float: btnDir}}
        >
        {btnStr}
      </Button>}
      
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {titleStr}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {contentStr}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{cancelStr}</Button>
          <Button onClick={handleConfirmClose} autoFocus>{confirmStr}</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default AlertDialogWithBtn;