import axios from 'axios';
import handleError from '../../utils/errorHandler';
import toast from 'react-hot-toast';

export const activateUser = async (
  userToken: string,
  email: string,
  name: string,
  setReload: React.Dispatch<React.SetStateAction<boolean>>,
  setUpadatingLaoding: React.Dispatch<React.SetStateAction<boolean>>
) => {
  try {
    setUpadatingLaoding(true);
    const response = await axios.post(
      `${import.meta.env.VITE_APP_API_URL}/user/activate`,
      { email },
      {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      }
    );

    if (response.status === 200) {
      setUpadatingLaoding(false);
      toast.success(`${name} activated successfully`);
      setTimeout(() => {
        setReload((prevState) => !prevState);
      }, 1000);
    }
  } catch (error) {
    handleError(error);
  }
};
