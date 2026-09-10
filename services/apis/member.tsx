// src/services/api/members.ts
import apifetch from "./api.tsx";

type HubUser = {
  id: string;
  name: string;
  email: string;
  is_member: boolean;
};

export type CheckUserResponse = {
  status: boolean;
  msg: string;
  data: HubUser;
};
// "status": true,
//     "msg": "Non member data captured successfully",
//     "data": {
//         "id": "cbf18cfd-bac1-4c78-a164-992add13e6ae",
//         "user_name": "John Doe",
//         "email": "test@example.us",
//         "department": "computer science",
//         "whatsapp_number": "09098979284",
//         "date_of_birth": "2004-02-07",
//         "tech_stack": "frontend developer"
//     }
// }
type captureDetails = {
  id: string;
  user_name: string;
  email: string;
  department: string;
  date_of_birth: string;
  tech_stack: string;
};
type capture = {
  status: boolean;
  msg: string;
  data: captureDetails;
};
export function createMember(payload: {
  user_name: string;
  email: string;
  department: string;
  whatsapp_number: string;
  date_of_birth: string;
  tech_stack: string;
}) {
  const { whatsapp_number, ...rest } = payload;
  return apifetch<capture>("api/v1/member/create/", {
    method: "POST",
    body: JSON.stringify({ ...rest, phone_number: whatsapp_number }),
  });
}

export function checkIfUserExists(data: { email: string }) {
  return apifetch<CheckUserResponse>("api/v1/member/record/exists/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function captureNonMember(payload: {
  user_name: string;
  email: string;
  whatsapp_number: string;
  department: string;
  tech_stack: string;
  date_of_birth: string;
}) {
  const { whatsapp_number, ...rest } = payload;
  return apifetch<capture>("api/v1/non-member/data/capture/", {
    method: "POST",
    body: JSON.stringify({ ...rest, phone_number: whatsapp_number }),
  });
}

// {status:true,
//   msg:'hub user exists',
//   data:{
//     id:'09540587368yhdnjiegvniu3i'
//     name:'frank',
//     email:"frank@gmail.com",
//     is_member:true
//   }
// }
