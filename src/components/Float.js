import Fab from '@mui/material/Fab';
import Button from './Button';

const Float = ({ text }) => {
  return (
    <div>
        <Fab color='primary' aria-label='add'>{text}</Fab>
    </div>
  )
}

export default Float