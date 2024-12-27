import React, { useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'

const UpdateProfileDialog = ({ open, setOpen }) => {
    const [loading, setLoading] = useState(false);
    const { user } = useSelector(store => store.auth);

    const [input, setInput] = useState({
        fullName: user?.fullName || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        bio: user?.profile?.bio || "",
        skills: user?.profile?.skills?.map(skill => skill) || "",
        file: user?.profile?.resume || ""
    });
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({ ...input, file })
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("fullName", input.fullName);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("bio", input.bio);
        formData.append("skills", input.skills);

        if (input.file) {
            formData.append("file", input.file);
        } 

        const token = localStorage.getItem('token');

        console.log("Token fetched from ls", token)

        formData.append('token', token);

        try {
            setLoading(true);
            console.log("Calling the Backend ");
            const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
                withCredentials: true 
            });

            console.log("Response from bd", res);

            if (res.data.success) {
                dispatch(setUser(res.data.user));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log("this is my error", error);
            toast.error(error.response?.data?.message);
        } finally {
            setLoading(false);
        }
        setOpen(false);
        console.log(input);
    }

    return (
        <Dialog open={open}>
            <DialogContent className="sm:max-w-md p-6 rounded-lg shadow-lg bg-white" onInteractOutside={() => setOpen(false)}>
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-gray-800">Update Profile</DialogTitle>
                </DialogHeader>
                <form onSubmit={submitHandler}>
                    <div className='grid gap-4 py-4'>
                        <div className='grid grid-cols-1 md:grid-cols-4 items-center gap-4'>
                            <Label htmlFor="name" className="text-right text-gray-700">Name</Label>
                            <Input
                                id="name"
                                name="fullName"
                                type="text"
                                value={input.fullName}
                                onChange={changeEventHandler}
                                className="col-span-3"
                            />
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-4 items-center gap-4'>
                            <Label htmlFor="email" className="text-right text-gray-700">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={input.email}
                                onChange={changeEventHandler}
                                className="col-span-3"
                            />
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-4 items-center gap-4'>
                            <Label htmlFor="number" className="text-right text-gray-700">Number</Label>
                            <Input
                                id="number"
                                name="phoneNumber"
                                value={input.phoneNumber}
                                onChange={changeEventHandler}
                                className="col-span-3"
                            />
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-4 items-center gap-4'>
                            <Label htmlFor="bio" className="text-right text-gray-700">Bio</Label>
                            <Input
                                id="bio"
                                name="bio"
                                value={input.bio}
                                onChange={changeEventHandler}
                                className="col-span-3"
                            />
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-4 items-center gap-4'>
                            <Label htmlFor="skills" className="text-right text-gray-700">Skills</Label>
                            <Input
                                id="skills"
                                name="skills"
                                value={input.skills}
                                onChange={changeEventHandler}
                                className="col-span-3"
                            />
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-4 items-center gap-4'>
                            <Label htmlFor="file" className="text-right text-gray-700">Resume</Label>
                            <Input
                                id="file"
                                name="file"
                                type="file"
                                accept="application/pdf"
                                onChange={fileChangeHandler}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        {
                            loading ? (
                                <Button className="w-full my-4 flex items-center justify-center" disabled>
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                    Please wait
                                </Button>
                            ) : (
                                <Button type="submit" className="w-full my-4">Update</Button>
                            )
                        }
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default UpdateProfileDialog
