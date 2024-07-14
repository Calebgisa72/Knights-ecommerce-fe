import axios from 'axios';
import handleError from '../../utils/errorHandler';
import toast from 'react-hot-toast';

export const deactivateUser = async (
  userToken: string,
  email: string,
  name: string,
  setReload: React.Dispatch<React.SetStateAction<boolean>>,
  setUpadatingLaoding: React.Dispatch<React.SetStateAction<boolean>>
) => {
  try {
    setUpadatingLaoding(true);
    const response = await axios.post(
      `${import.meta.env.VITE_APP_API_URL}/user/deactivate`,
      { email },
      {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      }
    );

    if (response.status === 200) {
      toast.success(`${name} deactivated successfully`);
      setTimeout(() => {
        setReload((prevState) => !prevState);
        setUpadatingLaoding(false);
      }, 1000);
    }
  } catch (error) {
    handleError(error);
  }
};
