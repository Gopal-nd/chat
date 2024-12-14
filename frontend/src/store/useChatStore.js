import {create} from 'zustand'
import toast from 'react-hot-toast'
import { axiosInstance } from '../lib/axios';
import axios from 'axios';

export const useChatStore = create((set,get)=>({
messages:[],
users:[],
selectedUser:null,
isUsersLoding:false,
isMessagesLoading:false,


getUsers: async()=>{
set({isUsersLoding:true});
try {
 const res = await axiosInstance.get("/messages/users"); 
set({users:res.data});
} catch (error) {
 toast.error(error.response.data.message);
}finally{
set({isUsersLoding:false});
}
},


getMessage: async(userId)=>{
set({isMessagesLoading:true});
try {
 const res =await axiosInstance.get(`/messages/${userId}`);
set({messages:res.data});
} catch (error) {
  toast.error(error.response.data.message);
}finally{
set({isMessagesLoading:false});
}
},


sendMessage:async(messageData)=>{
const {selectedUser,messages} = get();
try {
 const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`,messageData); 
} catch (error) {
 toast.error(error.response.data.message) 
}
},

setSelectedUser: async(user)=>{set({selectedUser:user})},


}))
