import axios from 'axios';
import toast from 'react-hot-toast';

const handleError = (error: any) => {
  axios.isAxiosError(error)
    ? toast.error(error.response?.data?.message || 'Server Down. Try again later!')
    : toast.error((error as Error).message);
};

export default handleError;
