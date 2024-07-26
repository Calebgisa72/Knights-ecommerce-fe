import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { ListFilter } from 'lucide-react';
import searchIcon from '/search.svg';
import formatDateAndTime from '../../../utils/formartDate&Time';
import { useNavigate } from 'react-router-dom';
import { PropagateLoader } from 'react-spinners';

export interface user {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  gender?: string;
  phoneNumber: string;
  photoUrl?: string;
  verified?: boolean;
  twoFactorEnabled?: boolean;
  status: 'active' | 'suspended';
  userType?: 'Admin' | 'Buyer' | 'Vendor';
  role: string;
  createdAt: Date;
  updatedAt?: Date;
}
export const numberOfUsers = 10;

function Users() {
  const navigate = useNavigate();
  const { userToken } = useSelector((state: RootState) => state.auth);
  const [allUsers, setAllUsers] = useState<user[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<user[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [totalVendors, setTotalVendors] = useState<number>(0);
  const [totalBuyers, setTotalBuyers] = useState<number>(0);
  const [activeBuyers, setActiveBuyers] = useState<number>(0);
  const [activeVendors, setActiveVendors] = useState<number>(0);
  const [inactiveBuyers, setInactiveBuyers] = useState<number>(0);
  const [inactiveVendors, setInactiveVendors] = useState<number>(0);
  const [pages, setPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [pageJsxElements, setPageJsxElements] = useState<JSX.Element[]>([]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase());
    setCurrentPage(1);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/user/allUsers`, {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        });
        if (response.status === 200) {
          const users: user[] = response.data.users;
          setAllUsers(users);
        }
        setLoading(false);
      } catch (error) {
        toast.error('Failed to fetch users');
      }
    };
    fetchData();
  }, [userToken]);

  useEffect(() => {
    let vendor = 0;
    let buyer = 0;
    let activeVendor = 0;
    let activeBuyer = 0;
    let inactiveVendor = 0;
    let inactiveBuyer = 0;

    allUsers.forEach((user) => {
      if (user.role.toLowerCase() === 'vendor') {
        vendor += 1;
        if (user.status.toLowerCase() === 'active') {
          activeVendor += 1;
        } else {
          inactiveVendor += 1;
        }
      } else if (user.role.toLowerCase() === 'buyer') {
        buyer += 1;
        if (user.status.toLowerCase() === 'active') {
          activeBuyer += 1;
        } else {
          inactiveBuyer += 1;
        }
      }
    });

    setTotalVendors(vendor);
    setActiveVendors(activeVendor);
    setInactiveVendors(inactiveVendor);
    setTotalBuyers(buyer);
    setActiveBuyers(activeBuyer);
    setInactiveBuyers(inactiveBuyer);
  }, [allUsers]);

  useEffect(() => {
    const filteredUsers = allUsers
      .filter(
        (user) =>
          user.firstName.toLowerCase().includes(searchTerm) ||
          user.lastName.toLowerCase().includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm)
      )
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    setTotalUsers(filteredUsers.length);
    const allPages = Math.ceil(filteredUsers.length / numberOfUsers);
    setPages(allPages);
    const start = (currentPage - 1) * numberOfUsers;
    const viewingUsers = filteredUsers.slice(start, start + numberOfUsers);
    setSelectedUsers(viewingUsers);

    const pageElemets: JSX.Element[] = [];
    for (let i = 0; i < allPages; i++) {
      pageElemets.push(
        <div
          key={i}
          onClick={() => setCurrentPage(i + 1)}
          className={`px-3 ${currentPage === i + 1 ? 'bg-neutral-300' : ''} hover:bg-neutral-100 cursor-pointer py-1 border-[1.5px] border-[#D1D1D1]`}
        >
          {i + 1}
        </div>
      );
    }

    setPageJsxElements(pageElemets);
  }, [allUsers, searchTerm, currentPage]);

  const handleUserClick = (id: string) => {
    navigate(`/Admin/dashboard/users/${id}`);
  };

  return (
    <div className="p-7 w-full h-[calc(100vh-94px)] bg-[#EEF5FF] overflow-y-scroll">
      <div className="flex flex-col gap-5">
        <div>
          <h1 className="text-[20px] font-semibold">All Users</h1>
          <p className="text-[14px] font-light">Home &gt; Users</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 xmd:gap-14 w-full sm:h-[140px]">
          <div className="h-full w-full text-white border-[1px] border-[#D1D1D1] bg-primary items-center sm:items-start justify-center py-2 sm:py-1 px-5 xmd:px-14 flex flex-col gap-1 rounded-xl">
            <p className="font-semibold text-[16px]">Total Vendors</p>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="flex flex-col gap-1">
                <p data-testid="totalVendors" className="text-[30px] text-center sm:text-start font-bold">
                  {totalVendors}
                </p>
                <div className="flex gap-2 text-white">
                  <span data-testid="activeVendors" className="py-1 text-[13px] px-2 bg-[#4D9A00] rounded-md">
                    Active: {activeVendors}
                  </span>
                  <span data-testid="inactiveVendors" className="py-1 text-[13px] px-2 bg-[#FF4141] rounded-md">
                    Inactive: {inactiveVendors}
                  </span>
                </div>
              </div>
            )}
          </div>
          <div className="h-full w-full bg-white border-[1px] border-[#D1D1D1] text-primary items-center sm:items-start justify-center py-2 sm:py-1 px-5 xmd:px-14 flex flex-col gap-1 rounded-xl">
            <p className="font-semibold text-[16px]">Total Buyers</p>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="flex flex-col gap-1">
                <p data-testid="totalBuyers" className="text-[30px] text-center sm:text-start font-bold">
                  {totalBuyers}
                </p>
                <div className="flex gap-2 text-white">
                  <span data-testid="activeBuyers" className="py-1 text-[13px] px-2 bg-[#4D9A00] rounded-md">
                    Active: {activeBuyers}
                  </span>
                  <span data-testid="inactiveBuyers" className="py-1 text-[13px] px-2 bg-[#FF4141] rounded-md">
                    Inactive: {inactiveBuyers}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-8 p-6 rounded-xl bg-white border-2 ">
          <div className="flex gap-4 ml-auto h-10">
            <div className="flex px-3 py-1 rounded-lg border border-[#d1d1d1] gap-2">
              <img className="w-[22px]" src={searchIcon} />
              <input
                type="text"
                data-testid="search-input"
                className="bg-white placeholder:text-[12px] xmd:placeholder:text-[15px]  w-[80%] md:w-[300px] outline-none"
                placeholder="Search by Name, Email "
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <button className="flex gap-2 items-center p-4 rounded-lg bg-[#070F2B] text-white">
              <span className="hidden sm:block">Filter</span> <ListFilter />
            </button>
          </div>
          <div className="w-[calc(100vw-267px] flex flex-col items-center justify-start gap-y-2">
            {loading ? (
              <div className="w-full flex justify-center px-6 py-20" data-testid="loading-spinner">
                <PropagateLoader color="#070f2b" />
              </div>
            ) : selectedUsers.length > 0 ? (
              <div className="w-full flex flex-col ">
                <div className="w-full overflow-x-auto" key={selectedUsers.length}>
                  <div
                    data-testid="userPropsTable"
                    className="w-[1000px] p-2 bg-primary grid grid-cols-12 gap-2 xmd:w-full className= font-medium font-poppins text-white text-[14px]"
                  >
                    <div className="col-span-1 flex items-center justify-start">
                      <p>No</p>
                    </div>
                    <div className="col-span-3 flex items-center justify-start">
                      <p>Name</p>
                    </div>
                    <div className="col-span-3 flex items-center justify-start ">
                      <p>Contact</p>
                    </div>
                    <div className="col-span-2 flex flex-col gap-1 justify-center">
                      <p>Register Date</p>
                    </div>
                    <div className="col-span-2 flex items-center justify-start">
                      <p>Status</p>
                    </div>
                    <div className="col-span-1 flex items-center justify-end">
                      <p>Role</p>
                    </div>
                  </div>
                  {selectedUsers.map((user, index) => {
                    const createdAt = formatDateAndTime(user.createdAt);
                    return (
                      <div
                        key={user.id}
                        onClick={() => handleUserClick(user.id)}
                        data-testid="userDiv"
                        className="hover:bg-neutral-200 hover:cursor-pointer"
                      >
                        <div className="w-[1000px] px-2 grid py-1 grid-cols-12 gap-2 xmd:w-full font-poppins text-[.7rem] xmd:text-[.76rem] lg:text-[.82rem]">
                          <div className="col-span-1 flex items-center justify-start">
                            <p>{(currentPage - 1) * numberOfUsers + index + 1}</p>
                          </div>
                          <div className="col-span-3 flex items-center justify-start">
                            <p>
                              {user.firstName} {user.lastName}
                            </p>
                          </div>
                          <div className="col-span-3 flex items-center justify-start ">
                            <div className="flex flex-col gap-y-1">
                              <p>{user.email}</p>
                              <p>{user.phoneNumber}</p>
                            </div>
                          </div>
                          <div className="col-span-2 flex flex-col gap-1 justify-center text-[13px]">
                            <p>{createdAt.date}</p>
                            <p>{createdAt.time}</p>
                          </div>
                          {user.status.toLowerCase() === 'active' ? (
                            <div className="col-span-2 flex items-center gap-1 justify-start">
                              <div className="w-[10px] h-[10px] rounded-full bg-[#4D9A00]"></div>
                              <p>Active</p>
                            </div>
                          ) : (
                            <div className="col-span-2 flex items-center gap-1 justify-start">
                              <div className="w-[10px] h-[10px] rounded-full bg-[#FF3333]"></div>
                              <p>Suspended</p>
                            </div>
                          )}
                          <div className="col-span-1 flex items-center justify-end">
                            <p>{user.role}</p>
                          </div>
                        </div>
                        <div className="w-[1000px] xmd:w-full h-[1px] bg-[#717171] mt-1"></div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 text-[13px] flex flex-col gap-2 sm:gap-0 sm:flex-row justify-between items-center">
                  <p>
                    Showing {(currentPage - 1) * numberOfUsers + 1} to{' '}
                    {(currentPage - 1) * numberOfUsers + selectedUsers.length} of {totalUsers} results
                  </p>
                  <div className="w-full justify-center sm:w-auto flex">
                    {pages > 1 && <div className="flex flex-wrap gap-y-1">{pageJsxElements}</div>}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-lg">No user found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Users;
